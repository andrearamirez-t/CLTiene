from api.database import result
from api.models import FilterModel


def motivo_rechazo(filters: FilterModel):
    return result(f"""
    with
    resultado as (
        select
        Motivo_Rechazo,
        count(*) total
        from
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
                  WHERE {filters.get_query()}
        group by
        Motivo_Rechazo
    )
    select
    Motivo_Rechazo n,
    total valorReal,
    concat (ROUND(total * 100.0 / SUM(total) OVER (), 2), "%") v
    from
    resultado;
    """)
