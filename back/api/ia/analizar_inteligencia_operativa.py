from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context


def analizar_inteligencia_operativa(filters: FilterModel):
    return {
        "result": call(
            prompt_html(
                "Eres director de operaciones de call center. Analiza: 1.MEJORES HORARIOS 2.MEJORES DÍAS 3.VENTAS VS SERVICIO 4.SENTIMIENTO 5.SCORECARD ASESORES 6.RECOMENDACIONES(5). Datos concretos, español, emojis."
            ),
            f"Analiza inteligencia operativa:\n{get_data_context(filters.get_query())}",
        )
    }
