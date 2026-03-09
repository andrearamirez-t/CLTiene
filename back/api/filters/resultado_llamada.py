from api.database import option
from api.models import FilterModel


def resultado_llamada(filters: FilterModel):

    return option(f"""
    select Resultado_Llamada from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()} group by Resultado_Llamada
    """, "Resultado_Llamada")