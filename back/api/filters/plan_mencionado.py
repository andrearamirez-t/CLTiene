from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def plan_mencionado(filters: FilterModel):
    return option(f"""
    SELECT
    Plan_Mencionado
    FROM
        {TABLE}
    WHERE
        Plan_Mencionado in (
            "Plan Manada",
            "Plan Mascotas",
            "Plan Movilidad",
            "Plan Premium",
            "Plan Salud",
            "No identificado"
        )
    AND {filters.get_query()}
    group by
        Plan_Mencionado
    """, "plan_mencionado")
