from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def nombre_asesor(filters: FilterModel):
    return option(f"""
    select cuenta from {TABLE}
    WHERE {filters.get_query()}
    group by cuenta
    """, "cuenta")
