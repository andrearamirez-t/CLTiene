from api.database import result
from api.models import FilterModel


def embudo_conversacion(filters: FilterModel):
    return result(f"""
    WITH base AS (
        SELECT *
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {filters.get_query()}
    ),
    embudo AS (
        SELECT
            "Total llamadas" nombre,
            COUNT(*) valor,
            100.0 porcentaje
        FROM base

        UNION ALL

        SELECT
            "Contestadas" nombre,
            COUNTIF(Estado_de_la_LLamada = "ANSWERED") valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Estado_de_la_LLamada = "ANSWERED") * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            "Efectivas (contacto)" nombre,
            COUNTIF(efectiva = 1.0) valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(efectiva = 1.0) * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            "Conv > 30s" nombre,
            COUNTIF(Duracion_Estimada IN ('Corta', 'Media', 'Larga')) valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Duracion_Estimada IN ('Corta', 'Media', 'Larga')) * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            "Con Saludo" nombre,
            COUNTIF(Saludo_Completo = "Sí") valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Saludo_Completo = "Sí") * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            "Ventas" nombre,
            COUNTIF(Resultado_Llamada = "Venta") valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Resultado_Llamada = "Venta") * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base
    )

    SELECT nombre, valor, CONCAT(porcentaje, "%")
    FROM embudo
    """)
