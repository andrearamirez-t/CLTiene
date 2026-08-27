from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def tipo_llamada(filters: FilterModel):
    return option(f"""
    select tipo from {TABLE}
    WHERE {filters.get_query()}
    group by tipo
    """, "tipo")
