from api.database import result
from api.models import FilterModel


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
            PARSE_TIMESTAMP(
                '%d/%m/%Y %H:%M:%S',
                CONCAT(
                    REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}/\\d{{1,2}}/\\d{{4}})'),
                    ' ',
                    REGEXP_EXTRACT(fecha, r'(\\d{{1,2}}:\\d{{2}}:\\d{{2}})')
                )
            ) +
            IF(REGEXP_CONTAINS(fecha, r'(?i)p'), INTERVAL 12 HOUR, INTERVAL 0 HOUR) ts
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
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )

    SELECT
        COUNT(*) total,
        COUNT(*) contestadas,
        SUM(CAST(efectiva AS FLOAT64)) efectivas,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) ventas,

        FORMAT_TIMESTAMP(
        '%H:%M',
        TIMESTAMP_SECONDS(CAST(AVG(UNIX_SECONDS(ts)) AS INT64))
    ) hora_promedio,

        (SELECT dia FROM top_dia) dia_promedio,
        (SELECT Cuenta FROM top_asesor) top_asesor,

        ROUND(AVG(saludo_inicial) * 100,1) saludo,

        ROUND((
            AVG(saludo_inicial) +
            AVG(identificacion_cliente) +
            AVG(comprension_problema) +
            AVG(ofrecimiento_solucion) +
            AVG(manejo_inquietudes) +
            AVG(cierre_servicio) +
            AVG(proximo_paso)
        ) / 7 * 100,1) calidad

    FROM base
    """)
