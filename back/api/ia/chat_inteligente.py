from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_history


def chat_inteligente(pregunta: str, filters: FilterModel):
    historia = get_history(filters.get_query())
    contexto = "\n---\n".join(historia)[:8000]
    content, error = call(
        prompt_html("Eres analista de call centers Colombia para CL Tiene"),
        f"Responde con base en estas transcripciones de llamadas:\n\n{contexto}\n\nPregunta: {pregunta}"
    )
    return {"result": content, "error": error}
