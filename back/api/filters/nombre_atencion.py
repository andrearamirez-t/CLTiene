from api.database import option
from api.models import FilterModel


def nombre_atencion(filters: FilterModel):
    return option(f"""
    select Nombre_del_Modulo from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` WHERE {filters.get_query()} group by Nombre_del_Modulo
    """, "Nombre_del_Modulo")
