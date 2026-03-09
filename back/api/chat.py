import os
from openai import OpenAI
from pydantic import BaseModel

ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    user_message: str
    system_prompt: str | None = None

async def api_chat_logic(request: ChatRequest):
    prompt_base = """
    Eres un analista experto de Call Centers en Colombia...
    """
    try:
      
        response = ai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt_base},
                {"role": "user", "content": request.user_message}
            ],
            temperature=0.7
        )
        return {"respuesta": response.choices[0].message.content}
    except Exception as e:
        return {"respuesta": f"⚠️ Error en OpenAI: {str(e)}"}