from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE


def transcripciones(filters: FilterModel):
    return result(f"""
    SELECT
        transcripcion
    FROM
        {TABLE}
    WHERE
        transcripcion != "" AND
        {filters.get_query()}
    """)
