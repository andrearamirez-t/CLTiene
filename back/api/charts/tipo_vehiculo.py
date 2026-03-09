from api.database import result
from api.models import FilterModel


def tipo_vehiculo(filters: FilterModel):
    return result(f"""
    with
        resultado as (
            SELECT
                Tipo_Vehiculo,
                count(*) value
            from
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            where
                Tipo_Vehiculo != "N/A" AND
                {filters.get_query()}
            group by
                Tipo_Vehiculo
        )
    SELECT
        *,
        concat (round(value * 100.0 / sum(value) over (), 2), "%") porcentaje
    from
        resultado
    """)
