from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_history


def chat_inteligente(pregunta: str, filters: FilterModel):
    return {
        "result": call(
            prompt_html(f"Eres analista de call centers Colombia para CL Tiene"),
            f"""
            Responde la siguiente pregunta con base a la información del contexto: {pregunta}

            Contexto: {get_history(filters.get_query())}
            """
        )
    }
