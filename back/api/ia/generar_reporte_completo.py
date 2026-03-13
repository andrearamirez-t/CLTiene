from IA.Open_AI import call
from api.models import FilterModel
from helpers.utils import get_data_context


def generar_reporte_completo(filters: FilterModel):
    return {
        "result": call(
            "Consultor senior. Genera REPORTE EJECUTIVO COMPLETO:\n# REPORTE CL TIENE SOLUCIONES\n## 1. Resumen Ejecutivo (3-4 párrafos)\n## 2. KPIs Principales (tabla con estado)\n## 3. Rendimiento por Asesor\n## 4. Patrones Detectados\n## 5. Calidad del Servicio\n## 6. Rechazos y Mitigación\n## 7. Top 10 Recomendaciones\n## 8. Plan de Acción (4 semanas)\n## 9. Metas SMART\nDatos específicos, porcentajes, emojis, formato profesional.",
            f"Genera reporte:\n{get_data_context(filters.get_query())}"
        )
    }
