from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def duracion_llamada(filters: FilterModel):
    return option(f"""
    select
        CASE
            WHEN length (transcripcion) < 50 THEN 'Buzón'
            WHEN length (transcripcion) < 200 THEN 'Muy Corta'
            WHEN length (transcripcion) < 500 THEN 'Corta'
            WHEN length (transcripcion) < 1500 THEN 'Media'
            ELSE 'Larga'
        END duracion
    from
        {TABLE}
    WHERE {filters.get_query()}
    group by duracion
                  
    """, "duracion")
