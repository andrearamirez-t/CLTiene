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
    - Usa únicamente etiquetas: <p>, <strong>, <ul>, <ol>, <li>
    - No uses markdown
    - No incluyas ``` ni bloques de código
    - El HTML debe ser válido y cerrar todas las etiquetas
    - La respuesta debe poder insertarse directamente dentro de un <div>
    - Usa español claro y profesional
    - Puedes usar emojis moderadamente
    """

    return f"""
    {system_prompt}

    {reglas_html}
    """.strip()
