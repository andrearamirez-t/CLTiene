from api.database import result
from api.models import FilterModel


def embudo_conversacion(filters: FilterModel):
    return result(f"""
    with embudo as (
        select
            "Total llamadas" nombre,
            count(*) valor,
            100.0 porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
        union all
        select
            "Contestadas" nombre,
            countif (Estado_de_la_LLamada = "ANSWERED") valor,
            round(
                countif (Estado_de_la_LLamada = "ANSWERED") * 100.0 / count(*),
                1
            ) porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
        union all
        select
            "Efectivas (contacto)" nombre,
            countif (efectiva = 1.0) valor,
            round(countif (efectiva = 1.0) * 100.0 / count(*), 1) porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
        union all
        select
            "Conv > 30s" nombre,
            countif (Duracion_Estimada in ('Corta', 'Media', 'Larga')) valor,
            round(
                countif (Duracion_Estimada in ('Corta', 'Media', 'Larga')) * 100.0 / count(*),
                1
            ) porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
        union all
        select
            "Con Saludo" nombre,
            countif (Saludo_Completo = "Sí") valor,
            round(
                countif (Saludo_Completo = "Sí") * 100.0 / count(*),
                1
            ) porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
        union all
        select
            "Ventas" nombre,
            countif (Resultado_Llamada = "Venta") valor,
            round(
                countif (Resultado_Llamada = "Venta") * 100.0 / count(*),
                1
            ) porcentaje
        from
            `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` where {filters.get_query()}
    ) select nombre, valor, concat(porcentaje, "%") from embudo
    """)
