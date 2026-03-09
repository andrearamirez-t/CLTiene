from api.database import option
from api.models import FilterModel


def tipo_vehiculo(filters: FilterModel):
    return option(f"""
    with
        resultado as (
            SELECT
                Tipo_Vehiculo,
                count(*) total
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
        concat (round(total * 100.0 / sum(total) over (), 2), "%") porcentaje
    from
        resultado
    """, "Nombre_del_Modulo")
