from api.database import option


def llamada(id):
    return option(
        f"""
        WITH id_provicional AS (
            SELECT ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
            Resultado_Llamada,
            cuenta
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            ORDER BY fecha DESC
        ) SELECT id, concat({", \" | \", ".join(["\"#\", id", "Resultado_Llamada", "cuenta"])}) text FROM id_provicional
        """,
        "id",
        "text",
    )
