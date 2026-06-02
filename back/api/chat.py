import os
import dotenv
from openai import OpenAI
from pydantic import BaseModel
from helpers.utils import get_data_context
from api.models import FilterModel
from IA.Open_AI import prompt_html

dotenv.load_dotenv()


def get_ai_client():
    api_key = os.getenv("OPENAI_API_MUNDIAL") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY no está configurada")
    return OpenAI(api_key=api_key)

class ChatRequest(BaseModel):
    user_message: str
    system_prompt: str | None = None


async def api_chat_logic(request: ChatRequest, filters: FilterModel):
    try:
        ai_client = get_ai_client()
        response = ai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": (
                    "Eres un asistente experto en call centers para CL Tiene Soluciones en Colombia. "
                    "Responde de forma conversacional, clara y en español. "
                    "Usa los datos del contexto para responder preguntas específicas. "
                    "Para saludos o preguntas generales responde brevemente sin mostrar tablas de datos. "
                    "Usa texto plano con saltos de línea, sin HTML ni markdown."
                )},
                {"role": "user", "content": f"Consulta: {request.user_message}\n\nDatos del call center:\n{get_data_context(filters.get_query())}"}
            ],
            temperature=0.7
        )
        return {"respuesta": response.choices[0].message.content}
    except Exception as e:
        return {"respuesta": f"⚠️ Error: {str(e)}"}
