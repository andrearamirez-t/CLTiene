from api.database import option
from api.models import FilterModel


def asistencia_mencionada(filters: FilterModel):
    return option(f"""
    SELECT
        CASE
            WHEN LENGTH(asistencia) > 20
                THEN CONCAT(SUBSTR(asistencia, 1, 20),'...')
            ELSE asistencia
        END AS asistencia
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    GROUP BY asistencia
    """, "asistencia")