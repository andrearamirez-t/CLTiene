from api.database import option
from api.models import FilterModel


def plan_mencionado(filters: FilterModel):
    return option(f"""
    select
        plan_mencionado
    from
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    group by plan_mencionado
    """, "plan_mencionado")
