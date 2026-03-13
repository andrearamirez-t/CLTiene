from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context


def analisis_automatico(filters: FilterModel, tipo_analisis: str):
    prompts = {
        "resumen_ejecutivo": "Resumen ejecutivo profesional: KPIs, tendencias, fortalezas, debilidades, 5 recomendaciones priorizadas. Formato gerencial.",
        "oportunidades_mejora": "10 oportunidades de mejora: descripción, impacto estimado, esfuerzo, prioridad. Ordena por impacto.",
        "analisis_rechazos": "Análisis profundo de rechazos: distribución, patrones, correlaciones, estrategias para reducir 20% cada tipo.",
        "mejores_practicas": "Benchmark de top performers: qué hacen diferente, métricas comparativas, cómo replicar éxito.",
        "patrones_ventas": "Patrones ventas exitosas vs fallidas: duración óptima, turnos ideales, planes exitosos, perfil de llamada exitosa.",
        "plan_coaching": "Plan coaching 4 semanas: diagnóstico por asesor, ejercicios prácticos, métricas seguimiento, cronograma.",
        "recomendaciones_semanales": "3 prioridades semanales, métricas diarias, objetivos por asesor, alertas y riesgos.",
        "prediccion_tendencias": "Proyección próximo mes: KPIs esperados, riesgos, oportunidades, 5 acciones preventivas."
    }

    return {
        "result": call(
            prompt_html(
                "Consultor senior de call centers en Colombia. Analiza los datos y genera un informe profesional."),
            f"{prompts[tipo_analisis]}\n\nDATOS:\n{get_data_context(filters.get_query())}"
        )
    }
