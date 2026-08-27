from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def saludo_asesor(filters: FilterModel):
    return option(f"""
    select Saludo_Completo from {TABLE} WHERE {filters.get_query()} group by Saludo_Completo
    """, "Saludo_Completo")
