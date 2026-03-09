from api.database import result
from api.models import FilterModel


def rendimiento_agente(filters: FilterModel):
    return result(f"""
    SELECT
        cuenta AS n,
        COUNT(*) AS llamadas,
        AVG(Turnos_Asesor_V4) AS turnos,
        AVG(
            IF(Saludo_Completo = "Sí", 25, 0) +
            IF(Explico_Beneficios = "Sí", 25, 0) +
            IF(Ofrecio_WhatsApp = "Sí", 20, 0) +
            IF(Despedida_Correcta = "Sí", 20, 0) +
            IF(Duracion_Estimada IN ('Media', 'Larga'), 10, 0) +
            IF(Duracion_Estimada = "Corta", 5, 0)
        ) AS palabras,
        ROUND(SAFE_DIVIDE(SUM(efectiva), COUNT(*)) * 100, 2) AS efectivas,
        ROUND(SAFE_DIVIDE(SUM(efectiva), COUNT(*)) * 100, 2) AS exito,
        ROUND(SAFE_DIVIDE(COUNTIF(Resultado_Llamada = 'Venta'), COUNT(*)) * 100, 2) AS calidad,
        CONCAT('#', FORMAT('%06X', CAST(FLOOR(RAND() * 16777215) AS INT64))) AS color
                  
    FROM
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    GROUP BY
        cuenta
    ORDER BY
        cuenta
    """)
