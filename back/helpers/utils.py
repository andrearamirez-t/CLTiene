from api.database import client


def filters(filters: dict) -> dict:
    filtros_object = {}
    filtros_string = []

    for key, value in filters.items():

        # Ignorar None
        if value is None:
            continue

        # Ignorar string vacío
        if isinstance(value, str) and value.strip() == "":
            continue

        # Ignorar listas vacías
        if isinstance(value, list) and len(value) == 0:
            continue

        # Ignorar diccionarios vacíos
        if isinstance(value, dict) and len(value) == 0:
            continue

        filtros_object[key] = value

        if key == "fecha_desde":
            # filtros_string.append(f"fecha >= {value}")
            filtros_string.append(f"""DATE(
                PARSE_TIMESTAMP(
                    '%d/%m/%Y %H:%M:%S',
                    CONCAT(
                        REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}/\\d{{1,2}}/\\d{{4}})'),
                        ' ',
                        REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}:\\d{{2}}:\\d{{2}})')
                    )
                )
                +
                IF(
                    REGEXP_CONTAINS(fecha, r'(?i)p'),
                    INTERVAL 12 HOUR,
                    INTERVAL 0 HOUR
                )
            ) >= {value}""")

        if key == "fecha_hasta":
            # filtros_string.append(f"fecha <= {value}")
            filtros_string.append(f"""DATE(
                PARSE_TIMESTAMP(
                    '%d/%m/%Y %H:%M:%S',
                    CONCAT(
                        REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}/\\d{{1,2}}/\\d{{4}})'),
                        ' ',
                        REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}:\\d{{2}}:\\d{{2}})')
                    )
                )
                +
                IF(
                    REGEXP_CONTAINS(fecha, r'(?i)p'),
                    INTERVAL 12 HOUR,
                    INTERVAL 0 HOUR
                )
            ) <= {value}""")

        if key in ["resultado_llamada", "plan_mencionado", "Duracion_Estimada"]:
            filtros_string.append(f"{key} = '{value}'")

        if key == "duracion_llamada":
            filtros_string.append(f"Duracion_Estimada = '{value}'")

        # Pendiente: ya tengo el calculo, pero se complejo sacarlo a una consulta
        # if key == "saludo_asesor":
        #     filtros_string.append("")

        if key == "nombre_asesor":
            filtros_string.append(f"cuenta like '%{value}%'")

        if key == "modulo_atencion":
            filtros_string.append(f"nombre_atencion = {value}")

        if key == "tipo_llamada":
            filtros_string.append(f"tipo = {value}")

        if key == "transcripcion" and value == "true":
            filtros_string.append("transcripcion is not null")

    result = {
        "filter_string": " AND ".join(filtros_string) if filtros_string else "1=1",
        "filter_array": filtros_object,
    }

    return result


def get_data_context(where="1=1"):

    query = f"""
    WITH base AS (
        SELECT
            Estado_de_la_Llamada,
            Resultado_Llamada,
            Num_Turnos_V4,
            Duracion_Estimada,
            Plan_Mencionado,
            Saludo_Completo,
            Explico_Beneficios,
            Ofrecio_WhatsApp,
            Despedida_Correcta,
            Cuenta,
            Motivo_Rechazo
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    ),

    resumen AS (
        SELECT
            COUNT(*) total,
            SUM(CASE WHEN Estado_de_la_Llamada = 'ANSWERED' THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas,
            AVG(Num_Turnos_V4) turnos_prom
        FROM base
    ),

    calidad AS (
        SELECT
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN Explico_Beneficios = 'Sí' THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN Despedida_Correcta = 'Sí' THEN 1 ELSE 0 END) despedida
        FROM base
    ),

    resultados AS (
        SELECT Resultado_Llamada, COUNT(*) total
        FROM base
        GROUP BY Resultado_Llamada
    ),

    duracion AS (
        SELECT Duracion_Estimada, COUNT(*) total
        FROM base
        GROUP BY Duracion_Estimada
    ),

    planes AS (
        SELECT Plan_Mencionado, COUNT(*) total
        FROM base
        GROUP BY Plan_Mencionado
    ),

    asesores AS (
        SELECT
            Cuenta,
            COUNT(*) llamadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) efectivas
        FROM base
        GROUP BY Cuenta
    ),

    rechazos AS (
        SELECT Motivo_Rechazo, COUNT(*) total
        FROM base
        WHERE Motivo_Rechazo IS NOT NULL
        AND Motivo_Rechazo != 'N/A'
        GROUP BY Motivo_Rechazo
    )

    SELECT
        (SELECT AS STRUCT * FROM resumen) resumen,
        (SELECT AS STRUCT * FROM calidad) calidad,

        ARRAY(
            SELECT AS STRUCT *
            FROM resultados
            ORDER BY total DESC
        ) resultados,

        ARRAY(
            SELECT AS STRUCT *
            FROM duracion
            ORDER BY total DESC
        ) duracion,

        ARRAY(
            SELECT AS STRUCT *
            FROM planes
            ORDER BY total DESC
        ) planes,

        ARRAY(
            SELECT AS STRUCT
                Cuenta,
                llamadas,
                efectivas,
                ROUND(SAFE_DIVIDE(efectivas,llamadas)*100,2) exito_pct
            FROM asesores
            ORDER BY exito_pct DESC
        ) asesores,

        ARRAY(
            SELECT AS STRUCT *
            FROM rechazos
            ORDER BY total DESC
        ) rechazos
    """

    job = client.query(query)
    # row = list(job.result())[0]
    row = dict(list(job.result())[0])

    total = row["resumen"]["total"]
    contactadas = row["resumen"]["contactadas"]
    ventas = row["resumen"]["ventas"]
    turnos = row["resumen"]["turnos_prom"]

    ctx = f"""CALL CENTER CL TIENE SOLUCIONES:
    - Total: {total:,}
    - Contactadas: {contactadas:,} ({contactadas/total*100:.1f}%)
    - Ventas: {ventas:,} ({ventas/total*100:.2f}%)
    - Turnos prom: {turnos:.1f}

    RESULTADOS:
    """

    for r in row["resultados"]:
        ctx += f"{r['Resultado_Llamada']}: {r['total']}\n"

    ctx += "\nDURACIÓN:\n"
    for d in row["duracion"]:
        ctx += f"{d['Duracion_Estimada']}: {d['total']}\n"

    ctx += "\nPLANES:\n"
    for p in row["planes"]:
        ctx += f"{p['Plan_Mencionado']}: {p['total']}\n"

    ctx += f"""
    CALIDAD:
    Saludo: {row["calidad"]["saludo"]}
    Beneficios: {row["calidad"]["beneficios"]}
    WhatsApp: {row["calidad"]["whatsapp"]}
    Despedida: {row["calidad"]["despedida"]}
    """

    ctx += "\nASESORES:\n"
    for a in row["asesores"]:
        ctx += f"{a['Cuenta']} | Llamadas: {a['llamadas']} | Ventas: {a['efectivas']} | Éxito: {a['exito_pct']}%\n"

    if row["rechazos"]:
        ctx += "\nRECHAZOS:\n"
        for r in row["rechazos"]:
            ctx += f"{r['Motivo_Rechazo']}: {r['total']}\n"

    return ctx


def get_asesor_context(where, asesor=""):

    query = f"""
    WITH base AS (
        SELECT
            Estado_de_la_Llamada,
            Resultado_Llamada,
            Num_Turnos_V4,
            Duracion_Estimada,
            Plan_Mencionado,
            Saludo_Completo,
            Explico_Beneficios,
            Ofrecio_WhatsApp,
            Despedida_Correcta,
            Cuenta,
            Motivo_Rechazo
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
        AND Cuenta LIKE '%{asesor}%'
    ),

    resumen AS (
        SELECT
            COUNT(*) total,
            SUM(CASE WHEN Estado_de_la_Llamada = 'ANSWERED' THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas,
            AVG(Num_Turnos_V4) turnos_prom
        FROM base
    ),

    calidad AS (
        SELECT
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN Explico_Beneficios = 'Sí' THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN Despedida_Correcta = 'Sí' THEN 1 ELSE 0 END) despedida
        FROM base
    ),

    resultados AS (
        SELECT Resultado_Llamada, COUNT(*) total
        FROM base
        GROUP BY Resultado_Llamada
    ),

    duracion AS (
        SELECT Duracion_Estimada, COUNT(*) total
        FROM base
        GROUP BY Duracion_Estimada
    ),

    planes AS (
        SELECT Plan_Mencionado, COUNT(*) total
        FROM base
        GROUP BY Plan_Mencionado
    ),

    rechazos AS (
        SELECT Motivo_Rechazo, COUNT(*) total
        FROM base
        WHERE Motivo_Rechazo IS NOT NULL
        AND Motivo_Rechazo != 'N/A'
        GROUP BY Motivo_Rechazo
    )

    SELECT
        (SELECT AS STRUCT * FROM resumen) resumen,
        (SELECT AS STRUCT * FROM calidad) calidad,

        ARRAY(
            SELECT AS STRUCT *
            FROM resultados
            ORDER BY total DESC
        ) resultados,

        ARRAY(
            SELECT AS STRUCT *
            FROM duracion
            ORDER BY total DESC
        ) duracion,

        ARRAY(
            SELECT AS STRUCT *
            FROM planes
            ORDER BY total DESC
        ) planes,

        ARRAY(
            SELECT AS STRUCT *
            FROM rechazos
            ORDER BY total DESC
        ) rechazos
    """

    job = client.query(query)
    row = dict(list(job.result())[0])

    total = row["resumen"]["total"]
    contactadas = row["resumen"]["contactadas"]
    ventas = row["resumen"]["ventas"]
    turnos = row["resumen"]["turnos_prom"]

    tasa_contacto = (contactadas / total * 100) if total else 0
    tasa_venta = (ventas / total * 100) if total else 0

    ctx = f"""
    ASESOR ANALIZADO: {asesor}

    RESUMEN:
    - Total llamadas: {total:,}
    - Contactadas: {contactadas:,} ({tasa_contacto:.1f}%)
    - Ventas: {ventas:,} ({tasa_venta:.2f}%)
    - Turnos promedio: {turnos:.1f}

    RESULTADOS:
    """

    for r in row["resultados"]:
        ctx += f"{r['Resultado_Llamada']}: {r['total']}\n"

    ctx += "\nDURACIÓN:\n"
    for d in row["duracion"]:
        ctx += f"{d['Duracion_Estimada']}: {d['total']}\n"

    ctx += "\nPLANES MENCIONADOS:\n"
    for p in row["planes"]:
        ctx += f"{p['Plan_Mencionado']}: {p['total']}\n"

    ctx += f"""
    CALIDAD:
    - Saludo correcto: {row["calidad"]["saludo"]}
    - Explicó beneficios: {row["calidad"]["beneficios"]}
    - Ofreció WhatsApp: {row["calidad"]["whatsapp"]}
    - Despedida correcta: {row["calidad"]["despedida"]}
    """

    if row["rechazos"]:
        ctx += "\nMOTIVOS DE RECHAZO:\n"
        for r in row["rechazos"]:
            ctx += f"{r['Motivo_Rechazo']}: {r['total']}\n"

    return ctx


def get_ranking_context(where="1=1"):

    query = f"""
    WITH base AS (
        SELECT
            Cuenta,
            Resultado_Llamada,
            Estado_de_la_Llamada,
            Num_Turnos_V4,
            Duracion_Estimada,
            Saludo_Completo,
            Explico_Beneficios,
            Ofrecio_WhatsApp,
            Despedida_Correcta
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    ),

    asesores AS (
        SELECT
            Cuenta,
            COUNT(*) llamadas,
            SUM(CASE WHEN Estado_de_la_Llamada = 'ANSWERED' THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas,
            AVG(Num_Turnos_V4) turnos_prom,
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN Explico_Beneficios = 'Sí' THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN Despedida_Correcta = 'Sí' THEN 1 ELSE 0 END) despedida
        FROM base
        GROUP BY Cuenta
    )

    SELECT
        Cuenta,
        llamadas,
        contactadas,
        ventas,
        ROUND(SAFE_DIVIDE(ventas,llamadas)*100,2) exito_pct,
        turnos_prom,
        saludo,
        beneficios,
        whatsapp,
        despedida
    FROM asesores
    ORDER BY exito_pct DESC
    """

    job = client.query(query)
    rows = list(job.result())

    ctx = "RANKING DE ASESORES CALL CENTER CL TIENE SOLUCIONES\n\n"

    for r in rows:
        ctx += f"""
        ASESOR: {r.Cuenta}
        - Llamadas: {r.llamadas}
        - Contactadas: {r.contactadas}
        - Ventas: {r.ventas}
        - Tasa de éxito: {r.exito_pct}%
        - Turnos promedio: {r.turnos_prom:.1f}

        CALIDAD:
        - Saludo correcto: {r.saludo}
        - Explicó beneficios: {r.beneficios}
        - Ofreció WhatsApp: {r.whatsapp}
        - Despedida correcta: {r.despedida}
        --------------------------------
        """

    return ctx


def get_search_results_context(where="1=1", search_query=""):

    query = f"""
    SELECT
        Cuenta,
        Resultado_Llamada,
        Duracion_Estimada,
        Plan_Mencionado,
        Motivo_Rechazo,
        SUBSTR(transcripcion,1,500) transcripcion
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    AND transcripcion IS NOT NULL
    AND LOWER(transcripcion) LIKE '%{search_query.lower()}%'
    LIMIT 50
    """

    job = client.query(query)
    rows = list(job.result())

    ctx = f"""
    BUSQUEDA EN TRANSCRIPCIONES
    Término buscado: "{search_query}"

    Resultados encontrados: {len(rows)}

    """

    for r in rows:
        ctx += f"""
        ASESOR: {r.Cuenta}
        Resultado: {r.Resultado_Llamada}
        Duración: {r.Duracion_Estimada}
        Plan mencionado: {r.Plan_Mencionado}
        Motivo rechazo: {r.Motivo_Rechazo}

        Fragmento:
        {r.transcripcion}

        --------------------------------
        """

    return ctx


def get_llamada_context(where="1=1", asesor=None):

    query = f"""
    SELECT
        Cuenta,
        Estado_de_la_Llamada,
        Resultado_Llamada,
        Duracion_Estimada,
        Num_Turnos_V4,
        Plan_Mencionado,
        Motivo_Rechazo,
        Saludo_Completo,
        Explico_Beneficios,
        Ofrecio_WhatsApp,
        Despedida_Correcta,
        transcripcion
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    AND Cuenta = '{asesor}'
    LIMIT 1
    """

    job = client.query(query)
    rows = list(job.result())

    if not rows:
        return "No se encontró la llamada solicitada."

    r = rows[0]

    ctx = f"""
    ANÁLISIS DE LLAMADA – CALL CENTER CL TIENE SOLUCIONES

    ASESOR:
    {r.Cuenta}

    ESTADO DE LA LLAMADA:
    {r.Estado_de_la_Llamada}

    RESULTADO:
    {r.Resultado_Llamada}

    DETALLES OPERATIVOS:
    - Duración estimada: {r.Duracion_Estimada}
    - Turnos conversación: {r.Num_Turnos_V4}
    - Plan mencionado: {r.Plan_Mencionado}
    - Motivo de rechazo: {r.Motivo_Rechazo}

    CALIDAD DE ATENCIÓN:
    - Saludo completo: {r.Saludo_Completo}
    - Explicó beneficios: {r.Explico_Beneficios}
    - Ofreció WhatsApp: {r.Ofrecio_WhatsApp}
    - Despedida correcta: {r.Despedida_Correcta}

    TRANSCRIPCIÓN DE LA LLAMADA:
    {r.transcripcion}
    """

    return ctx
