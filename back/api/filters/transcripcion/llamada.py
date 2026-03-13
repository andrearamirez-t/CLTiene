import re
from api.database import result


def llamada(id=None, buscar=None):

    filtro = ""

    if buscar:
        filtro = f"""
        AND (
            CAST(cuenta AS STRING) LIKE '%{buscar}%'
            OR LOWER(asesor) LIKE LOWER('%{buscar}%')
        )
        """

    data = result(
        f"""
        WITH id_provicional AS (
            SELECT 
                ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
                Resultado_Llamada,
                Transcripcion_V4,
                cuenta
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE Transcripcion_V4 IS NOT NULL
            {filtro}
            ORDER BY fecha DESC
        ) 
        SELECT * FROM id_provicional
        {"WHERE id = " + str(id) if id else ""}
        LIMIT 1
        """
    )

    if not data:
        return {}

    row = data[0]

    transcripcion = row.get("Transcripcion_V4") or ""

    patron = r"\[(Cliente|Asesor)\]:\s*(.*?)(?=\[(Cliente|Asesor)\]:|$)"

    mensajes = []

    for match in re.finditer(patron, transcripcion, re.DOTALL):
        speaker = match.group(1)
        text = match.group(2).strip()

        mensajes.append({"speaker": speaker, "text": text})

    # métricas simples
    turnos = len(mensajes)
    cliente = sum(1 for m in mensajes if m["speaker"] == "Cliente")
    asesor = sum(1 for m in mensajes if m["speaker"] == "Asesor")

    return {
        "info": {
            "resultado": row.get("Resultado_Llamada"),
            "cuenta": row.get("cuenta"),
        },
        "metricas": {
            "turnos": turnos,
            "cliente_intervenciones": cliente,
            "asesor_intervenciones": asesor,
        },
        "mensajes": mensajes,
    }
