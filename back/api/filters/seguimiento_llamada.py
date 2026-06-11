from api.database import option
from api.models import FilterModel


def seguimiento_llamada(filters: FilterModel):
    return option(f"""
    SELECT Tipo_de_Llamada FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()} AND Tipo_de_Llamada IS NOT NULL
    GROUP BY Tipo_de_Llamada
    """, "Tipo_de_Llamada")
