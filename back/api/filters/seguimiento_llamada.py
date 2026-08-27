from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def seguimiento_llamada(filters: FilterModel):
    return option(f"""
    SELECT Tipo_Llamada FROM {TABLE}
    WHERE {filters.get_query()} AND Tipo_Llamada IS NOT NULL
    GROUP BY Tipo_Llamada
    """, "Tipo_Llamada")
