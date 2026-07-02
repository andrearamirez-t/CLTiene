from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context, contexto_tipo_llamada


def generar_insights(filters: FilterModel):
    content, error = call(
        prompt_html(contexto_tipo_llamada(filters) +
                    "Eres analista experto de call centers en Colombia. Genera 5 insights accionables basados en los datos."),
        f"Analiza:\n{get_data_context(filters.get_query())}"
    )
    return {"result": content, "error": error}
