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
    )

    SELECT
        COUNT(*) total,
        COUNT(*) contestadas,
        COALESCE(SUM(CAST(efectiva AS FLOAT64)), 0) efectivas,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) ventas,

        FORMAT_TIMESTAMP(
        '%H:%M',
        TIMESTAMP_SECONDS(CAST(AVG(UNIX_SECONDS(TIMESTAMP(ts))) AS INT64))
    ) hora_promedio,
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

        COALESCE(ROUND(AVG(saludo_inicial) * 100,1), 0) saludo,

        COALESCE(ROUND((
            AVG(saludo_inicial) +
            AVG(identificacion_cliente) +
            AVG(comprension_problema) +
            AVG(ofrecimiento_solucion) +
            AVG(manejo_inquietudes) +
            AVG(cierre_servicio) +
            AVG(proximo_paso)
        ) / 7 * 100,1), 0) calidad

    FROM base
    """)
