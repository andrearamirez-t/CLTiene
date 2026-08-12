from api.database import result
from api.models import FilterModel
from api.database import calculo_fecha


def kpi(filters: FilterModel):
    return result(f"""
    WITH base AS (
        SELECT
            resultado_llamada,
            efectiva,
            Cuenta,
            saludo_inicial,
            identificacion_cliente,
            comprension_problema,
            ofrecimiento_solucion,
            manejo_inquietudes,
            cierre_servicio,
            proximo_paso,
            transcripcion,
            Transcripcion_V4,
            SAFE_CAST(SPLIT(Tiempo__de_Conversacion, ':')[SAFE_OFFSET(0)] AS INT64) * 3600
              + SAFE_CAST(SPLIT(Tiempo__de_Conversacion, ':')[SAFE_OFFSET(1)] AS INT64) * 60
              + SAFE_CAST(SPLIT(Tiempo__de_Conversacion, ':')[SAFE_OFFSET(2)] AS INT64) AS dur_seg,
            {calculo_fecha()} ts
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {filters.get_query()}
    ),

    top_asesor AS (
        SELECT Cuenta
        FROM base
        GROUP BY Cuenta
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ),

    top_dia AS (
        SELECT FORMAT_DATE('%A', DATE(ts)) dia
        FROM base
        GROUP BY dia
        HAVING dia IS NOT NULL
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ),

    top_hora AS (
        SELECT EXTRACT(HOUR FROM ts) h
        FROM base
        WHERE ts IS NOT NULL
          -- Excluye ~3.9k registros con la hora del día perdida (00:00:00 exacto).
          -- Tienen fecha pero sin time-of-day y casi todos traen transcripción, por lo que
          -- contaminaban la moda al filtrar "Solo con transcripción" (daba Hora Pico = 00:00).
          AND NOT (EXTRACT(HOUR FROM ts) = 0 AND EXTRACT(MINUTE FROM ts) = 0 AND EXTRACT(SECOND FROM ts) = 0)
        GROUP BY h
        ORDER BY COUNT(*) DESC
        LIMIT 1
    )

    SELECT
        COUNT(*) total,
        COUNT(*) contestadas,
        COALESCE(SUM(CAST(efectiva AS FLOAT64)), 0) efectivas,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) ventas,

        -- Cuando el filtro no devuelve datos, estos 3 muestran '0' (en vez de None)
        IFNULL((SELECT FORMAT('%02d:00', h) FROM top_hora), '0') hora_promedio,
        COALESCE(CASE
            WHEN (SELECT dia FROM top_dia) = 'Monday' THEN 'Lunes'
            WHEN (SELECT dia FROM top_dia) = 'Tuesday' THEN 'Martes'
            WHEN (SELECT dia FROM top_dia) = 'Wednesday' THEN 'Miércoles'
            WHEN (SELECT dia FROM top_dia) = 'Thursday' THEN 'Jueves'
            WHEN (SELECT dia FROM top_dia) = 'Friday' THEN 'Viernes'
            WHEN (SELECT dia FROM top_dia) = 'Saturday' THEN 'Sábado'
            WHEN (SELECT dia FROM top_dia) = 'Sunday' THEN 'Domingo'
            ELSE (SELECT dia FROM top_dia)
        END, '0') AS dia_promedio,
        COALESCE((SELECT Cuenta FROM top_asesor), '0') top_asesor,

        COALESCE(ROUND(
            SAFE_DIVIDE(
                SUM(CASE WHEN transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50 AND saludo_inicial = 1 THEN 1 ELSE 0 END),
                SUM(CASE WHEN transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50 THEN 1 ELSE 0 END)
            ) * 100, 1
        ), 0) saludo,

        COALESCE(ROUND((
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, saludo_inicial, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, identificacion_cliente, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, comprension_problema, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, ofrecimiento_solucion, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, manejo_inquietudes, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, cierre_servicio, NULL)) +
            AVG(IF(transcripcion IS NOT NULL AND LENGTH(transcripcion) > 50, proximo_paso, NULL))
        ) / 7 * 100,1), 0) calidad,

        -- TMO (tiempo hablado promedio): promedio de Tiempo de Conversacion, formateado H:MM:SS
        (SELECT FORMAT('%d:%02d:%02d', DIV(s, 3600), DIV(MOD(s, 3600), 60), MOD(s, 60))
         FROM (SELECT COALESCE(CAST(ROUND(AVG(dur_seg)) AS INT64), 0) s FROM base WHERE dur_seg > 0)) tmo,

        -- Participación del cliente: % de turnos que son del cliente (¿se deja hablar al cliente?)
        COALESCE(ROUND(
            SAFE_DIVIDE(
                SUM(ARRAY_LENGTH(REGEXP_EXTRACT_ALL(IFNULL(Transcripcion_V4, ''), r'\\[Cliente\\]'))),
                SUM(ARRAY_LENGTH(REGEXP_EXTRACT_ALL(IFNULL(Transcripcion_V4, ''), r'\\[(?:Asesor|Cliente)\\]')))
            ) * 100, 1
        ), 0) participacion_cliente

    FROM base
    """)
