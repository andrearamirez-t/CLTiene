from IA.Open_AI import call
from api.models import FilterModel
from helpers.utils import get_data_context


def chat_inteligente(filters: FilterModel, messages_history: list):
    return {
        "result": call(
            f"Eres analista de call centers Colombia para CL Tiene. Datos:\n{get_data_context(filters.get_query())}\nEspañol, emojis, datos concretos, recomendaciones accionables.",
            messages_history
        )
    }
