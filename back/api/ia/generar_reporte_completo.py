from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context, contexto_tipo_llamada


def generar_reporte_completo(filters: FilterModel):
    content, error = call(
        prompt_html(
            contexto_tipo_llamada(filters) +
            "Consultor senior. Genera REPORTE EJECUTIVO COMPLETO con estas secciones:\n"
            "1. Resumen Ejecutivo (3-4 párrafos)\n"
            "2. KPIs Principales (tabla con estado)\n"
            "3. Rendimiento por Asesor\n"
            "4. Patrones Detectados\n"
            "5. Calidad del Servicio\n"
            "6. Rechazos y Mitigación\n"
            "7. Top 10 Recomendaciones\n"
            "8. Plan de Acción (4 semanas)\n"
            "9. Metas SMART\n"
            "Usa datos específicos, porcentajes y emojis. Formato profesional."
        ),
        f"Genera reporte:\n{get_data_context(filters.get_query())}"
    )
    return {"result": content, "error": error}
