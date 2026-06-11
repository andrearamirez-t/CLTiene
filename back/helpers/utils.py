from api.database import client, calculo_fecha


def filters(filters: dict) -> dict:
    filtros_object = {}
    filtros_string = []

    print(f"\n\nFilter: {filters}", end="\n\n")

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
            filtros_string.append(
                f"""Fecha >= UNIX_MICROS(TIMESTAMP('{value}')) * 1000""")

        if key == "fecha_hasta":
            filtros_string.append(
                f"""Fecha <= UNIX_MICROS(TIMESTAMP('{value} 23:59:59')) * 1000""")

        if key in ["resultado_llamada", "plan_mencionado", "Duracion_Estimada"]:
            filtros_string.append(f"{key} = '{value}'")

        if key == "duracion_llamada":
            filtros_string.append(f"Duracion_Estimada = '{value}'")

        if key == "saludo_asesor":
            filtros_string.append(f"Saludo_Completo = '{value}'")

        if key == "nombre_asesor":
            filtros_string.append(f"cuenta like '%{value}%'")

        if key == "modulo_atencion":
            filtros_string.append(f"Nombre_del_Modulo = '{value}'")

        if key == "tipo_llamada":
            filtros_string.append(f"tipo = '{value}'")

        if key == "transcripcion" and value == "true":
            filtros_string.append("transcripcion is not null")

        if key == "clasificacion_sentimiento":
            filtros_string.append(f"clasificacion = '{value}'")

        if key == "asistencia_mencionada":
            asistencia = value.replace("...", "")
            filtros_string.append(
                f"(Asistencia like '{asistencia}%' or transcripcion like '%{asistencia}%')")

    result = {
        "filter_string": " AND ".join(filtros_string) if filtros_string else "1=1",
        "filter_array": filtros_object,
    }

    return result


def get_data_context(where="1=1"):

    query = f"""
    WITH base AS (
        SELECT
            efectiva,
            Resultado_Llamada,
            Duracion_Estimada,
            Plan_Mencionado,
            Saludo_Completo,
            ofrecimiento_solucion,
            Ofrecio_WhatsApp,
            cierre_servicio,
            Cuenta,
            Motivo_Rechazo
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    ),

    resumen AS (
        SELECT
            COUNT(*) total,
            SUM(CASE WHEN efectiva = 1.0 THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas
        FROM base
    ),

    calidad AS (
        SELECT
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN ofrecimiento_solucion = 1 THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN cierre_servicio = 1 THEN 1 ELSE 0 END) despedida
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
            efectiva,
            Resultado_Llamada,
            Duracion_Estimada,
            Plan_Mencionado,
            Saludo_Completo,
            ofrecimiento_solucion,
            Ofrecio_WhatsApp,
            cierre_servicio,
            Cuenta,
            Motivo_Rechazo
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
        AND Cuenta LIKE '%{asesor}%'
    ),

    resumen AS (
        SELECT
            COUNT(*) total,
            SUM(CASE WHEN efectiva = 1.0 THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas
        FROM base
    ),

    calidad AS (
        SELECT
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN ofrecimiento_solucion = 1 THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN cierre_servicio = 1 THEN 1 ELSE 0 END) despedida
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

    tasa_contacto = (contactadas / total * 100) if total else 0
    tasa_venta = (ventas / total * 100) if total else 0

    ctx = f"""
    ASESOR ANALIZADO: {asesor}

    RESUMEN:
    - Total llamadas: {total:,}
    - Contactadas (efectivas): {contactadas:,} ({tasa_contacto:.1f}%)
    - Ventas: {ventas:,} ({tasa_venta:.2f}%)

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
            efectiva,
            Duracion_Estimada,
            Saludo_Completo,
            ofrecimiento_solucion,
            Ofrecio_WhatsApp,
            cierre_servicio
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    ),

    asesores AS (
        SELECT
            Cuenta,
            COUNT(*) llamadas,
            SUM(CASE WHEN efectiva = 1.0 THEN 1 ELSE 0 END) contactadas,
            SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) ventas,
            SUM(CASE WHEN Saludo_Completo = 'Sí' THEN 1 ELSE 0 END) saludo,
            SUM(CASE WHEN ofrecimiento_solucion = 1 THEN 1 ELSE 0 END) beneficios,
            SUM(CASE WHEN Ofrecio_WhatsApp = 'Sí' THEN 1 ELSE 0 END) whatsapp,
            SUM(CASE WHEN cierre_servicio = 1 THEN 1 ELSE 0 END) despedida
        FROM base
        GROUP BY Cuenta
    )

    SELECT
        Cuenta,
        llamadas,
        contactadas,
        ventas,
        ROUND(SAFE_DIVIDE(ventas,llamadas)*100,2) exito_pct,
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
        - Contactadas (efectivas): {r.contactadas}
        - Ventas: {r.ventas}
        - Tasa de éxito: {r.exito_pct}%

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


def get_llamada_context(filters, llamada_id):

    where = filters.get_query() if hasattr(filters, "get_query") else "1=1"

    query = f"""
    WITH numeradas AS (
        SELECT
            ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            Cuenta,
            Estado_de_la_LLamada      AS estado,
            Resultado_Llamada,
            Duracion_Estimada,
            Plan_Mencionado,
            Motivo_Rechazo,
            Saludo_Completo,
            saludo_inicial,
            ofrecimiento_solucion,
            cierre_servicio,
            Ofrecio_WhatsApp,
            Transcripcion_V4
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE Transcripcion_V4 IS NOT NULL
        AND {where}
    )
    SELECT * FROM numeradas
    WHERE id = {llamada_id}
    LIMIT 1
    """

    job = client.query(query)
    rows = list(job.result())

    if not rows:
        return "No se encontró la llamada solicitada."

    r = rows[0]

    ctx = f"""
    ANÁLISIS DE LLAMADA #{llamada_id} – CALL CENTER CL TIENE SOLUCIONES

    ASESOR: {r.Cuenta}
    ESTADO: {r.estado}
    RESULTADO: {r.Resultado_Llamada}

    DETALLES OPERATIVOS:
    - Duración estimada: {r.Duracion_Estimada}
    - Plan mencionado: {r.Plan_Mencionado}
    - Motivo de rechazo: {r.Motivo_Rechazo}

    CALIDAD DE ATENCIÓN (escala 0–1):
    - Saludo inicial (CUN): {r.saludo_inicial}
    - Saludo completo (pipeline): {r.Saludo_Completo}
    - Ofreció solución: {r.ofrecimiento_solucion}
    - Cierre del servicio: {r.cierre_servicio}
    - Ofreció WhatsApp: {r.Ofrecio_WhatsApp}

    TRANSCRIPCIÓN:
    {r.Transcripcion_V4}
    """

    return ctx


def get_raw_calls_data(where="1=1", search_query=""):
    TABLE_REF = "desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas"

    query = f"""
    with resultado as (
        SELECT
            CAST(ROW_NUMBER() OVER() AS STRING) as id, 
            *
        FROM `{TABLE_REF}`
        LIMIT 20
    ) select * from resultado WHERE {where}
    """

    try:
        query_job = client.query(query)
        results = query_job.result()
        return [dict(row) for row in results]
    except Exception as e:
        print(f"Error en BigQuery raw: {e}")
        return []


def get_history(where):
    query = f"""
    WITH resultado AS (
        SELECT
            CAST(ROW_NUMBER() OVER() AS STRING) AS id,
            transcripcion
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50
    )
    SELECT * FROM resultado WHERE {where}
    LIMIT 40
    """

    job = client.query(query)
    results = job.result()

    transcripciones = [
        row.transcripcion[:600]
        for row in results
        if row.transcripcion is not None
    ]

    return transcripciones
