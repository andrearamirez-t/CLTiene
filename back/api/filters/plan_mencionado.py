from api.database import option
from api.models import FilterModel


def plan_mencionado(filters: FilterModel):
    return option(f"""
    SELECT
    Plan_Mencionado
    FROM
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
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
