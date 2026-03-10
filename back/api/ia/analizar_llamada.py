from IA.claude import call
from api.models import FilterModel
from helpers.utils import get_llamada_context


def analizar_llamada(filters: FilterModel, llamada_id: str):
    return {
        "result": call(
            "Eres supervisor de call center. Genera: 1.RESUMEN(2-3 oraciones) 2.RESULTADO 3.ACIERTOS(3) 4.ERRORES(3) 5.OBJECIONES 6.SCORECARD(Saludo/Empatía/Producto/Objeciones/Cierre cada uno /10) 7.COACHING(3 tips) 8.GUION ALTERNATIVO si falló. Español, emojis, detallado.",
            get_llamada_context(filters=filters, llamada_id=llamada_id)
        )
    }
