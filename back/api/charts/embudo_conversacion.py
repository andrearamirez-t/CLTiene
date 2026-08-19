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
            1 orden,
            "Total llamadas" nombre,
            COUNT(*) valor,
            100.0 porcentaje
        FROM base

        UNION ALL

        SELECT
            2 orden,
            "Conv > 30s" nombre,
            COUNTIF(Duracion_Estimada IN ('Muy Corta', 'Corta', 'Media', 'Larga')) valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Duracion_Estimada IN ('Muy Corta', 'Corta', 'Media', 'Larga')) * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            3 orden,
            "Con Saludo" nombre,
            COUNTIF(saludo_inicial = 1.0) valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(saludo_inicial = 1.0) * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            4 orden,
            "Contactado" nombre,
            -- Misma partición que la gráfica "Contacto Efectivo" (distribucion_resultado):
            -- se habló con la persona (Contactado + Rechazado + Venta). Así "Contactado"
            -- significa lo mismo en todo el dashboard y Ventas queda como subconjunto real.
            COUNTIF(Resultado_Llamada IN ("Contactado", "Rechazado", "Venta")) valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Resultado_Llamada IN ("Contactado", "Rechazado", "Venta")) * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base

        UNION ALL

        SELECT
            5 orden,
            "Posibles ventas" nombre,
            COUNTIF(Resultado_Llamada = "Venta") valor,
            ROUND(
                SAFE_DIVIDE(COUNTIF(Resultado_Llamada = "Venta") * 100.0, COUNT(*)),
                1
            ) porcentaje
        FROM base
    )

    SELECT nombre, valor, CONCAT(porcentaje, "%")
    FROM embudo
    ORDER BY orden
    """)
