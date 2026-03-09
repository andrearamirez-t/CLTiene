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
            filtros_string.append(f"fecha >= {value}")

        if key == "fecha_hasta":
            filtros_string.append(f"fecha <= {value}")

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

        # No es viable obtener el dato mejor con IA
        # if key == "clasificacion_sentimiento":
        #     print(key)

        if key == "tipo_llamada":
            filtros_string.append(f"tipo = {value}")

        if key == "transcripcion" and value:
            filtros_string.append("transcripcion is not null")

    result = {
        "filter_string": " AND ".join(filtros_string) if filtros_string else "1=1",
        "filter_array": filtros_object,
    }

    print(result)

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
    row = list(job.result())[0]

    total = row.resumen.total
    contactadas = row.resumen.contactadas
    ventas = row.resumen.ventas
    turnos = row.resumen.turnos_prom

    ctx = f"""CALL CENTER CL TIENE SOLUCIONES:
    - Total: {total:,}
    - Contactadas: {contactadas:,} ({contactadas/total*100:.1f}%)
    - Ventas: {ventas:,} ({ventas/total*100:.2f}%)
    - Turnos prom: {turnos:.1f}

    RESULTADOS:
    """

    for r in row.resultados:
        ctx += f"{r.Resultado_Llamada}: {r.total}\n"

    ctx += "\nDURACIÓN:\n"
    for d in row.duracion:
        ctx += f"{d.Duracion_Estimada}: {d.total}\n"

    ctx += "\nPLANES:\n"
    for p in row.planes:
        ctx += f"{p.Plan_Mencionado}: {p.total}\n"

    ctx += f"""
    CALIDAD:
    Saludo: {row.calidad.saludo}
    Beneficios: {row.calidad.beneficios}
    WhatsApp: {row.calidad.whatsapp}
    Despedida: {row.calidad.despedida}
    """

    ctx += "\nASESORES:\n"
    for a in row.asesores:
        ctx += f"{a.Cuenta} | Llamadas: {a.llamadas} | Ventas: {a.efectivas} | Éxito: {a.exito_pct}%\n"

    if row.rechazos:
        ctx += "\nRECHAZOS:\n"
        for r in row.rechazos:
            ctx += f"{r.Motivo_Rechazo}: {r.total}\n"

    print(ctx)

    return ctx
