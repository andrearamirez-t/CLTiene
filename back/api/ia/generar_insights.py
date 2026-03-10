from IA.claude import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context


def generar_insights(filters: FilterModel):
    return {
        "result": call(
            prompt_html("Eres analista experto de call centers en Colombia. Genera 5 insights accionables basados en los datos."),
            f"Analiza:\n{get_data_context(filters.get_query())}"
        )
    }
