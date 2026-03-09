from api.database import result
from api.models import FilterModel


def transcripciones(filters: FilterModel):
    return result(f"""
    SELECT
        transcripcion
    FROM
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE
        transcripcion != "" AND
        {filters.get_query()}
    """)
