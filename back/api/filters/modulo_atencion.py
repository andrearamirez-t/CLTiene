from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def modulo_atencion(filters: FilterModel):
    return option(f"""
    select Nombre_del_Modulo from {TABLE}
    WHERE {filters.get_query()}
    group by Nombre_del_Modulo
    """, "Nombre_del_Modulo")
