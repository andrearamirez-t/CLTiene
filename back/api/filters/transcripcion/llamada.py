import re
from api.database import result
from api.models import FilterModel


def llamada(id=None, buscar="", filters=FilterModel):

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
                COALESCE(Transcripcion_V4, transcripcion) AS transcripcion_text,
                cuenta
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE COALESCE(Transcripcion_V4, transcripcion) IS NOT NULL
            {filtro} and {filters.get_query()}
        )
        SELECT * FROM id_provicional
        {"WHERE id = " + str(id) if id else ""}
        LIMIT 1
        """
    )

    if not data:
        return {}

    row = data[0]

    transcripcion = row.get("transcripcion_text") or ""

    patron = r"\[(Cliente|Asesor)\]:\s*(.*?)(?=\[(Cliente|Asesor)\]:|$)"
    mensajes = []

    for match in re.finditer(patron, transcripcion, re.DOTALL):
        speaker = match.group(1)
        text = match.group(2).strip()
        if text:
            mensajes.append({"speaker": speaker, "text": text})

    # Si no hay etiquetas de speaker, mostrar texto plano dividido por párrafos
    if not mensajes and transcripcion.strip():
        for parrafo in transcripcion.split("\n"):
            parrafo = parrafo.strip()
            if parrafo:
                mensajes.append({"speaker": "Transcripción", "text": parrafo})

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
