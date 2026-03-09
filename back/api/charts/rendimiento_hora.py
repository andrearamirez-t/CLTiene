from api.database import result
from api.models import FilterModel


def rendimiento_hora(filters: FilterModel):
    return result(f"""
    WITH
        contador_resultados AS (
            SELECT
                Resultado_Llamada estado,
                count(*) total
            FROM
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE
                {filters.get_query()}
            GROUP BY
                Resultado_Llamada
        ),
        suma_efectivos AS (
            SELECT
                Resultado_Llamada estado,
                sum(efectiva) suma
            FROM
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            GROUP BY
                Resultado_Llamada
        )
    select
        a.estado,
        a.total,
        b.suma,
        concat (
            round(a.total * 100.0 / sum(a.total) over (), 2),
            "%"
        ) porcentaje
    from
        contador_resultados a
        INNER JOIN suma_efectivos b ON a.estado = b.estado
    """)
