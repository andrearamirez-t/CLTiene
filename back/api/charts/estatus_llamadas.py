from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE


def estatus_llamadas(filters: FilterModel):
    """Estatus de Llamadas del marcador (Contestada / No Contestada / Ocupada),
    traducido de Estado_de_la_LLamada. Respeta todos los filtros del sidebar.
    Es lo que pide la plantilla del contact center (ContactVox)."""
    return result(f"""
    WITH base AS (
        SELECT
            CASE UPPER(TRIM(Estado_de_la_LLamada))
                WHEN 'ANSWERED'   THEN 'Contestada'
                WHEN 'NO ANSWER'  THEN 'No Contestada'
                WHEN 'NOANSWER'   THEN 'No Contestada'
                WHEN 'BUSY'       THEN 'Ocupada'
                WHEN 'FAILED'     THEN 'Fallida'
                WHEN 'CANCEL'     THEN 'Cancelada'
                WHEN 'CONGESTION' THEN 'Congestión'
                ELSE Estado_de_la_LLamada
            END AS label,
            COUNT(*) AS valor
        FROM {TABLE}
        WHERE {filters.get_query()}
            AND Estado_de_la_LLamada IS NOT NULL
            AND TRIM(Estado_de_la_LLamada) != ''
        GROUP BY label
    )
    SELECT
        label,
        valor,
        CONCAT(ROUND(valor * 100.0 / SUM(valor) OVER (), 1), '%') AS porcentaje,
        CASE label
            WHEN 'Contestada'    THEN '#22c55e'
            WHEN 'No Contestada' THEN '#f59e0b'
            WHEN 'Ocupada'       THEN '#ef4444'
            ELSE '#94a3b8'
        END AS color
    FROM base
    ORDER BY valor DESC
    """)
