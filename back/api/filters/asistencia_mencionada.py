from api.database import option
from api.models import FilterModel


def asistencia_mencionada(filters: FilterModel):
    return option(f"""
    SELECT asistencia_item AS Asistencia
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`,
    UNNEST(SPLIT(Asistencia, ', ')) AS asistencia_item
    WHERE {filters.get_query()}
    AND Asistencia IS NOT NULL
    AND Asistencia != 'No identificado'
    GROUP BY asistencia_item
    ORDER BY asistencia_item
    """, "Asistencia")