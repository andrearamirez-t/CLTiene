import os
from openai import OpenAI

import dotenv

dotenv.load_dotenv()


api_key = os.getenv("OPENAI_API_KEY")
max_tokens = int(os.getenv("MAX_TOKENS"))  # cast a int
model = os.getenv("MODEL")


def call(system_prompt, user_message):
    if not api_key or len(api_key) < 20:
        return None, "⚠️ Configura el API Key"

    try:
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model=model, max_tokens=max_tokens, messages=[
                {
                    "role": "system", "content": system_prompt
                }, {
                    "role": "user", "content": user_message
                }
            ]
        )

        return response.choices[0].message.content, None
    except Exception as e:
        return None, f"❌ Error: {str(e)}"


def prompt_html(system_prompt: str) -> str:
    reglas_html = """
    REGLAS DE RESPUESTA:
    - Devuelve SOLO un FRAGMENTO HTML
    - NO incluyas <html>, <head>, <body>
    - NO incluyas <!DOCTYPE>
    - NO devuelvas una página completa
    - No uses markdown
    - No incluyas ``` ni bloques de código
    - El HTML debe ser válido y cerrar todas las etiquetas
    - La respuesta debe poder insertarse directamente dentro de un <div>
    - Usa español claro y profesional
    - Puedes usar emojis moderadamente

    CONDICIÓN PARA TABLAS:
    - SOLO usa <table> cuando la información requiera comparaciones, listados estructurados o datos tabulares
    - Si el contenido puede explicarse en texto o listas, NO uses tablas
    - No generes tablas innecesarias

    CONTENEDOR OBLIGATORIO PARA TABLAS:
    - Si generas una tabla, SIEMPRE debe estar dentro de un contenedor <div>
    - Estructura obligatoria: div > table > thead/tbody
    - El div debe tener EXACTAMENTE este estilo:

    <div style="background-color: rgb(15, 23, 42); border-radius: 12px; overflow: hidden; margin-bottom: 24px;">

    ESTILO DE TABLAS (SOLO SI SE USA <table>):
    - No inventes estilos nuevos
    - No agregues <style>, clases CSS o CSS externo
    - Usa únicamente estilos inline
    - Respeta exactamente los estilos siguientes

    table
    style="width:100%; border-collapse:collapse; color:rgb(203,213,225); font-size:13px;"

    thead > tr
    style="border-bottom:1px solid rgb(30,41,59); text-align:left;"

    thead > tr > th
    style="padding:12px 16px;"

    tbody > tr
    style="border-bottom:1px solid rgb(30,41,59);"

    tbody > tr > td
    style="padding:16px;"

    ESTRUCTURA DE REFERENCIA:

    <div style="background-color: rgb(15, 23, 42); border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
        <table style="width:100%; border-collapse:collapse; color:rgb(203,213,225); font-size:13px;">
            <thead>
                <tr style="border-bottom:1px solid rgb(30,41,59); text-align:left;">
                    <th style="padding:12px 16px;">Columna</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom:1px solid rgb(30,41,59);">
                    <td style="padding:16px;">Valor</td>
                </tr>
            </tbody>
        </table>
    </div>
    """

    return f"""
    {system_prompt}

    {reglas_html}
    """.strip()
