from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE


def tipo_mascota(filters: FilterModel):
    return result(f"""
    with
        resultado as (
            select
                Tipo_Mascota tipo,
                count(*) value
            from
                {TABLE}
            where
                Tipo_Mascota != "N/A" AND
                {filters.get_query()}
            group by
                tipo
        )
    select
        *,
        concat (round(value * 100.0 / sum(value) over (), 2), "%") porcentaje
    from
        resultado
    """)
