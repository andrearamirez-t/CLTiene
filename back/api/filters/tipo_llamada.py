from api.database import option
from api.models import FilterModel


def tipo_llamada(filters: FilterModel):
    return option(f"""
    select tipo from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    group by tipo
    """, "tipo")
