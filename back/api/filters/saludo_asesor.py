from api.database import option
from api.models import FilterModel


def saludo_asesor(filters: FilterModel):
    return option(f"""
    select Saludo_Completo from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` WHERE {filters.get_query()} group by Saludo_Completo
    """, "Saludo_Completo")
