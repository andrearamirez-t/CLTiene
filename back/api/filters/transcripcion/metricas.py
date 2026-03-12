from api.database import result


def metricas(id):
    return result(
        f"""
        WITH id_provicional AS (
            SELECT ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            *
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        ), base AS (
            SELECT *
            FROM id_provicional
            WHERE id = {id}
            LIMIT 1
        )

        SELECT 'Resultado' AS label, IFNULL(Resultado_Llamada,'-') AS val FROM base
        UNION ALL
        SELECT 'Duración', IFNULL(Duracion_Estimada,'-') FROM base
        UNION ALL
        SELECT 'Plan', IFNULL(Plan_Mencionado,'-') FROM base
        UNION ALL
        SELECT 'Turnos', IFNULL(CAST(Turnos_Asesor_V4 AS STRING),'-') FROM base
        UNION ALL
        SELECT 'Saludo', IFNULL(Saludo_Completo,'-') FROM base
        UNION ALL
        SELECT 'WhatsApp', IFNULL(Ofrecio_WhatsApp,'-') FROM base
        """
    )
