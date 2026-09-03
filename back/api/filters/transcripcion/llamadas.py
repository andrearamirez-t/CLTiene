from api.database import option
from api.models import FilterModel
from helpers.sql import TABLE


def llamadas(filters: FilterModel):

    concat_fields = ', " | ", '.join([
        'FORMAT_DATETIME(\'%Y-%m-%d %H:%M\', DATETIME(TIMESTAMP_MICROS(DIV(Fecha, 1000))))',
        'Resultado_Llamada',
        'cuenta',
        'IFNULL(CAST(CAST(Telefono AS INT64) AS STRING), \'-\')',
    ])

    return option(
        f"""
        WITH id_provicional AS (
            SELECT ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            Fecha,
            Resultado_Llamada,
            cuenta,
            Telefono
            FROM {TABLE}
            WHERE COALESCE(Transcripcion_V4, transcripcion) IS NOT NULL AND {filters.get_query()}
        )
        SELECT id, concat({concat_fields}) text
        FROM id_provicional
        ORDER BY Fecha DESC
        LIMIT 300
        """,
        "id",
        "text",
    )
