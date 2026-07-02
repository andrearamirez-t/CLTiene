import os
from openai import OpenAI

import dotenv

dotenv.load_dotenv()




def call(system_prompt, user_message):
    # Rotación con failover: intenta la key 1 y, si se queda sin cupo (429),
    # reintenta con la key 2. Otros errores no se recuperan cambiando de key.
    keys = [
        k for k in (
            os.getenv("OPENAI_API_MUNDIAL"),
            os.getenv("OPENAI_API_MUNDIAL_2"),
            os.getenv("OPENAI_API_KEY"),
        ) if k and len(k) > 20
    ]
    max_tokens = int(os.getenv("MAX_TOKENS") or 4000)
    model = os.getenv("MODEL") or "gpt-4o-mini"

    if not keys:
        return None, "⚠️ Configura el API Key"

    ultimo_error = None
    for api_key in keys:
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
            ultimo_error = f"❌ Error: {str(e)}"
            texto = str(e).lower()
            # Solo rota de key si es error de cupo / rate limit
            if "insufficient_quota" in texto or "429" in texto or "rate limit" in texto:
                continue
            return None, ultimo_error

    return None, ultimo_error


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
