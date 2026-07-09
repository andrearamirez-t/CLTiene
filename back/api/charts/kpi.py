from api.database import result
from api.models import FilterModel
from api.database import calculo_fecha


def kpi(filters: FilterModel):
    return result(f"""
    WITH base AS (
        SELECT
            resultado_llamada,
            efectiva,
            Cuenta,
            saludo_inicial,
            identificacion_cliente,
            comprension_problema,
            ofrecimiento_solucion,
            manejo_inquietudes,
            cierre_servicio,
            proximo_paso,
            transcripcion,
            {calculo_fecha()} ts
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {filters.get_query()}
    ),

    top_asesor AS (
        SELECT Cuenta
        FROM base
        GROUP BY Cuenta
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ),

    top_dia AS (
        SELECT FORMAT_DATE('%A', DATE(ts)) dia
        FROM base
        GROUP BY dia
        HAVING dia IS NOT NULL
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ),

    top_hora AS (
        SELECT EXTRACT(HOUR FROM ts) h
        FROM base
        WHERE ts IS NOT NULL
        GROUP BY h
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )

    SELECT
        COUNT(*) total,
        COUNT(*) contestadas,
        COALESCE(SUM(CAST(efectiva AS FLOAT64)), 0) efectivas,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) ventas,

        FORMAT('%02d:00', (SELECT h FROM top_hora)) hora_promedio,
        CASE
            WHEN (SELECT dia FROM top_dia) = 'Monday' THEN 'Lunes'
            WHEN (SELECT dia FROM top_dia) = 'Tuesday' THEN 'Martes'
            WHEN (SELECT dia FROM top_dia) = 'Wednesday' THEN 'Miércoles'
            WHEN (SELECT dia FROM top_dia) = 'Thursday' THEN 'Jueves'
            WHEN (SELECT dia FROM top_dia) = 'Friday' THEN 'Viernes'
            WHEN (SELECT dia FROM top_dia) = 'Saturday' THEN 'Sábado'
            WHEN (SELECT dia FROM top_dia) = 'Sunday' THEN 'Domingo'
            ELSE (SELECT dia FROM top_dia)
        END AS dia_promedio,
        (SELECT Cuenta FROM top_asesor) top_asesor,

        COALESCE(ROUND(
            SAFE_DIVIDE(
                SUM(CASE WHEN transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50 AND saludo_inicial = 1 THEN 1 ELSE 0 END),
                SUM(CASE WHEN transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50 THEN 1 ELSE 0 END)
            ) * 100, 1
        ), 0) saludo,

        COALESCE(ROUND((
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, saludo_inicial, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, identificacion_cliente, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, comprension_problema, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, ofrecimiento_solucion, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, manejo_inquietudes, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, cierre_servicio, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, proximo_paso, NULL))
        ) / 7 * 100,1), 0) calidad

    FROM base
    """)
