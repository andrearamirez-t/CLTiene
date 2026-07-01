from api.database import result


def historial_telefono(telefono: str):
    telefono_safe = str(telefono).replace("'", "").replace(";", "").strip()
    return result(
        f"""
        WITH todos AS (
            SELECT
                ROW_NUMBER() OVER (ORDER BY Fecha ASC) AS id_global,
                Fecha,
                Resultado_Llamada,
                Cuenta,
                Tiempo__de_Conversacion,
                Duracion_Estimada,
                Telefono,
                COALESCE(Transcripcion_V4, transcripcion) AS transcripcion_text
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE COALESCE(Transcripcion_V4, transcripcion) IS NOT NULL
        )
        SELECT
            id_global AS id,
            FORMAT_DATETIME('%Y-%m-%d %H:%M', DATETIME(TIMESTAMP_MICROS(DIV(Fecha, 1000)))) AS fecha,
            IFNULL(Resultado_Llamada, '-') AS resultado,
            IFNULL(Cuenta, '-') AS asesor,
            IFNULL(Tiempo__de_Conversacion, '-') AS duracion,
            IFNULL(Duracion_Estimada, '-') AS duracion_est,
            CASE WHEN transcripcion_text IS NOT NULL AND transcripcion_text != '' THEN TRUE ELSE FALSE END AS tiene_transcripcion
        FROM todos
        WHERE CAST(CAST(Telefono AS INT64) AS STRING) = '{telefono_safe}'
        ORDER BY Fecha ASC
        """
    )
