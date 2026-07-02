from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context, contexto_tipo_llamada


def analizar_inteligencia_operativa(filters: FilterModel):
    es_servicio = (filters.tipo_llamada or "").lower() == "servicio"
    punto_3 = "3.EFECTIVIDAD DEL SERVICIO" if es_servicio else "3.VENTAS VS SERVICIO"
    content, error = call(
        prompt_html(
            contexto_tipo_llamada(filters) +
            f"Eres director de operaciones de call center. Analiza: 1.MEJORES HORARIOS 2.MEJORES DÍAS {punto_3} 4.SENTIMIENTO 5.SCORECARD ASESORES 6.RECOMENDACIONES(5). Datos concretos, español, emojis."
        ),
        f"Analiza inteligencia operativa:\n{get_data_context(filters.get_query())}",
    )
    return {"result": content, "error": error}
