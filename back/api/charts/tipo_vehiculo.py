from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE


def tipo_vehiculo(filters: FilterModel):
    return result(f"""
    with
        resultado as (
            SELECT
                Tipo_Vehiculo tipo,
                count(*) value
            from
                {TABLE}
            where
                Tipo_Vehiculo != "N/A" AND
                {filters.get_query()}
            group by
                tipo
        )
    SELECT
        *,
        concat (round(value * 100.0 / sum(value) over (), 2), "%") porcentaje
    from
        resultado
    """)
