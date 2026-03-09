from api.database import result
from api.models import FilterModel


def tipo_mascota(filters: FilterModel):
    return result(f"""
    with
        resultado as (
            select
                Tipo_Mascota,
                count(*) total
            from
                `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            where
                Tipo_Mascota != "N/A" AND
                {filters.get_query()}
            group by
                Tipo_Mascota
        )
    select
        *,
        concat (round(total * 100.0 / sum(total) over (), 2), "%") porcentaje
    from
        resultado
    """)
