from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_llamada_context


def analizar_llamada(filters: FilterModel, llamada_id: str):
    content, error = call(
        prompt_html(
            "Eres supervisor de call center. Analiza la transcripción y genera: "
            "1. RESUMEN (2-3 oraciones) "
            "2. RESULTADO DE LA LLAMADA "
            "3. ACIERTOS del asesor (3 puntos) "
            "4. ERRORES o áreas de mejora (3 puntos) "
            "5. MANEJO DE OBJECIONES "
            "6. SCORECARD: Saludo / Empatía / Producto / Objeciones / Cierre (cada uno sobre 10) "
            "7. TIPS DE COACHING (3 recomendaciones concretas) "
            "8. GUIÓN ALTERNATIVO si la llamada no resultó en venta. "
            "Usa emojis, sé específico con los datos de la transcripción."
        ),
        get_llamada_context(filters=filters, llamada_id=llamada_id)
    )
    return {"result": content, "error": error}
