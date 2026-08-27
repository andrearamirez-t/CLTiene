# Pendiente
from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def clasificacion_sentimiento(filters: FilterModel):
    return option(f"""
    select clasificacion from {TABLE}
    WHERE {filters.get_query()}
    group by clasificacion
    """, "clasificacion")
