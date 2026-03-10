from IA.claude import call
from api.models import FilterModel
from helpers.utils import get_data_context


def generar_insights(filters: FilterModel):
    return {
        "result": call(
            """
            Eres analista experto de call centers en Colombia.

            Genera 5 insights accionables basados en los datos.

            Formato obligatorio:
            - Devuelve SOLO HTML válido
            - Usa <p>, <strong>, <ul>, <li>
            - No uses markdown
            - No incluyas ``` ni etiquetas de código
            - Español y emojis
            """,
            f"Analiza:\n{get_data_context(filters.get_query())}"
        )
    }