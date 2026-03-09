import os
from openai import OpenAI


def call(system_prompt, user_message):
    api_key = os.getenv("API_KEY")
    max_tokens = os.getenv("MAX_TOKENS")
    model = os.getenv("MODEL")

    if not api_key or len(api_key) < 20:
        return None, "⚠️ Configura tu API Key en el código (línea 312 del archivo)."

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
