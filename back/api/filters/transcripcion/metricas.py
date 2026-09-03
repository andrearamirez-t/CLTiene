from api.database import result
from api.models import FilterModel
from helpers.sql import TABLE
from google.cloud import bigquery


def metricas(id, filters: FilterModel = None):
    filtro_query = filters.get_query() if filters else "TRUE"
    return result(
        f"""
        WITH id_provicional AS (
            SELECT ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            *
            FROM {TABLE}
            WHERE COALESCE(Transcripcion_V4, transcripcion) IS NOT NULL
              AND {filtro_query}
        ), base AS (
            SELECT *
            FROM id_provicional
            WHERE id = @rowid
            LIMIT 1
        )

        SELECT 1 AS ord, 'Resultado' AS label, IFNULL(Resultado_Llamada,'-') AS val FROM base
        UNION ALL
        SELECT 2, 'Duración Real', IFNULL(Tiempo__de_Conversacion,'-') FROM base
        UNION ALL
        SELECT 3, 'Duración', IFNULL(Duracion_Estimada,'-') FROM base
        UNION ALL
        SELECT 4, 'Plan', IFNULL(Plan_Mencionado,'-') FROM base
        UNION ALL
        SELECT 5, 'Turnos', CAST(
            ARRAY_LENGTH(REGEXP_EXTRACT_ALL(IFNULL(Transcripcion_V4,''), r'\\[(Asesor|Cliente)\\]'))
            AS STRING) FROM base
        UNION ALL
        SELECT 6, 'Saludo', IFNULL(Saludo_Completo,'-') FROM base
        UNION ALL
        SELECT 7, 'WhatsApp', IFNULL(Ofrecio_WhatsApp,'-') FROM base
        ORDER BY ord
        """,
        [bigquery.ScalarQueryParameter("rowid", "INT64", int(id))],
    )
