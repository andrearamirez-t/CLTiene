from api.database import result
from api.models import FilterModel


def rendimiento_agente(filters: FilterModel):
    return result(f"""
    SELECT
        cuenta AS n,
        COUNT(*) AS llamadas,
        ROUND(AVG(
            CAST((LENGTH(IFNULL(Transcripcion_V4,'')) - LENGTH(REPLACE(IFNULL(Transcripcion_V4,''), '[Asesor]:', ''))) / 9 AS INT64)
        ), 1) AS turnos,
        ROUND(AVG(
            IF(Saludo_Completo = "Sí", 25, 0) +
            IF(ofrecimiento_solucion = 1, 25, 0) +
            IF(Ofrecio_WhatsApp = "Sí", 20, 0) +
            IF(cierre_servicio = 1, 20, 0) +
            IF(Duracion_Estimada IN ('Media', 'Larga'), 10, 0) +
            IF(Duracion_Estimada = "Corta", 5, 0)
        ), 1) AS score_calidad,
        ROUND(SAFE_DIVIDE(SUM(efectiva), COUNT(*)) * 100, 2) AS contacto_pct,
        ROUND(SAFE_DIVIDE(COUNTIF(Resultado_Llamada = 'Venta'), COUNT(*)) * 100, 2) AS tasa_venta,
        CONCAT('#', FORMAT('%06X', CAST(FLOOR(RAND() * 16777215) AS INT64))) AS color

    FROM
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {filters.get_query()}
    GROUP BY
        cuenta
    ORDER BY
        cuenta
    """)