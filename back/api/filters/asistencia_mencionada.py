# Cambiar plan por asistencia
from api.database import option
from api.models import FilterModel


def asistencia_mencionada(filters: FilterModel):
    return option(f"""
    select Plan_Mencionado from `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()} group by Plan_Mencionado
    """, "Plan_Mencionado")


if __name__ == "__main__":
    filters = FilterModel()
    filters.fecha_desde = "05/03/2026"

    asistencia_mencionada(FilterModel)
