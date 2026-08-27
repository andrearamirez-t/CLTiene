from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE


def motivo_rechazo(filters: FilterModel):
    return result(f"""
    with
    resultado as (
        select
        Motivo_Rechazo,
        count(*) total
        from
        {TABLE}
                  WHERE {filters.get_query()}
                    -- Excluye 'N/A' (97.5% = llamadas NO rechazadas): tapaba las
                    -- categorías reales de rechazo. Ahora se ve "No Interesa" etc.
                    AND Motivo_Rechazo != 'N/A'
                    AND Motivo_Rechazo IS NOT NULL
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
