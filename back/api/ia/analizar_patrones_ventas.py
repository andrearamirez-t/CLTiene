from IA.Open_AI import call
from api.models import FilterModel
from helpers.utils import get_data_context


def analizar_patrones_ventas(filters: FilterModel):
    return {
        "result": call(
            "Eres experto en call centers Colombia. Detecta: 1.PATRÓN DE ÉXITO 2.PATRÓN DE FRACASO 3.ESTRATEGIA 4.KPIs CLAVE 5.QUICK WINS(3 acciones esta semana). Datos concretos.",
            f"Detecta patrones:\n{get_data_context(filters.get_query())}"
        )
    }
