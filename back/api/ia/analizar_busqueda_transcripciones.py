from IA.Open_AI import call
from api.models import FilterModel
from helpers.utils import get_search_results_context


def analizar_busqueda_transcripciones(filters: FilterModel, search_query: str):
    return {
        "result": call(
            "Analiza resultados de búsqueda en transcripciones. Patrones e insights.",
            get_search_results_context(
                filters=filters, search_query=search_query
            )
        )
    }
