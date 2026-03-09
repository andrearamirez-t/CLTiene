from IA.claude import call
from api.models import FilterModel
from helpers.utils import get_data_context


def generar_insights(filters: FilterModel):
    return {
        "res": call(
            "Eres analista experto de call centers en Colombia. Genera 5 insights accionables. Español, emojis, datos específicos.",
            f"Analiza:\n{get_data_context()}"
        )
    }
