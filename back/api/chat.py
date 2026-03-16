import os
import dotenv
from openai import OpenAI
from pydantic import BaseModel
from helpers.utils import get_data_context
from api.models import FilterModel
from IA.Open_AI import prompt_html

dotenv.load_dotenv()


def get_ai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY no está configurada")
    return OpenAI(api_key=api_key)

class ChatRequest(BaseModel):
    user_message: str
    system_prompt: str | None = None


async def api_chat_logic(request: ChatRequest, filters: FilterModel):
    prompt_base = """Eres un analista experto de Call Centers en Colombia..."""
    try:
        ai_client = get_ai_client()
        response = ai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt_html(prompt_base)},
                {"role": "user", "content": f"""
                Consulta del usuario: {request.user_message}

                Contexto: {get_data_context(filters.get_query())}
                """}
            ],
            temperature=0.7
        )
        return {"respuesta":  response.choices[0].message.content}
    except Exception as e:
        return {"respuesta": f"⚠️ Error en OpenAI: {str(e)}"}
