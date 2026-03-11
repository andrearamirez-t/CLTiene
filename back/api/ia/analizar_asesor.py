from IA.claude import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_asesor_context


def analizar_asesor(filters: FilterModel, asesor: str):
    return {
        "result": call(
            prompt_html("Eres coach de call center. Genera: 1.DIAGNÓSTICO 2.FORTALEZAS(3) 3.MEJORAS(3) 4.PLAN ACCIÓN(3) 5.META mensual. Compara con el equipo. Español, emojis."),
            get_asesor_context(where=filters.get_query(), asesor=asesor)
        )
    }
