import os
from openai import OpenAI
import dotenv

dotenv.load_dotenv()

_client = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_MUNDIAL") or os.getenv("OPENAI_API_KEY")
        _client = OpenAI(api_key=api_key)
    return _client


def generar_respuesta_ia(prompt: str) -> str:
    try:
        response = _get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres un analista experto en call centers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        print("ERROR IA:", e)
        return "No fue posible generar el análisis con IA."