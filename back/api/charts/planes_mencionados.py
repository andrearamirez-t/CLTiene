from api.database import result
from api.models import FilterModel


def planes_mencionados(filters: FilterModel):
    return result(f"""
    WITH
        planes_mencionados AS (
            SELECT
                Plan_Mencionado,
                count(*) total
            FROM
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE
                {filters.get_query()}
            GROUP BY
                Plan_Mencionado
        )
    SELECT
        Plan_Mencionado n,
        concat(total, " ", "(", ROUND(total * 100.0 / SUM(total) over (), 2) ,"%)") v,
        total valorReal
    FROM
        planes_mencionados
    """)
