# Pendiente
from api.database import option
from api.models import FilterModel


def clasificacion_sentimiento(filters: FilterModel):
    return option(f"""
    select clasificacion from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    group by clasificacion
    """, "clasificacion")
