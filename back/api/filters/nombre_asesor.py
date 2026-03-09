from api.database import option
from api.models import FilterModel


def nombre_asesor(filters: FilterModel):
    return option(f"""
    select cuenta from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    group by cuenta
    """, "cuenta")
