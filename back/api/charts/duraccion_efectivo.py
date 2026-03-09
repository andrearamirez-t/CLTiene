from api.database import result
from api.models import FilterModel


def duraccion_efectivo(filters: FilterModel):
    return result(f"""
    with
    resultado_ventas as (
        select
        Duracion_Estimada,
        count(*) total,
        countif (Resultado_Llamada = "Venta") total_ventas
        from
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {filters.get_query()}
        group by
        Duracion_Estimada
    )
    select
    *,
    concat (ROUND(total * 100.0 / SUM(total) OVER (), 2), "%") porcentaje_llamadas,
    concat (
        ROUND(
        total_ventas * 100.0 / SUM(total_ventas) OVER (),
        2
        ),
        "%"
    ) porcentaje_ventas
    from
    resultado_ventas
    """)
