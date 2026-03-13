from IA.Open_AI import call
from api.models import FilterModel
from helpers.utils import get_llamada_context


def resumir_llamada(filters: FilterModel, asesor: str):
    return {
        "result": call(
            "Supervisor call center. Genera: 1.RESUMEN 2.RESULTADO 3.ACIERTOS(3) 4.ERRORES(3) 5.OBJECIONES 6.SCORECARD(/10 cada: Saludo,Empatía,Producto,Objeciones,Cierre → TOTAL/50) 7.COACHING(3) 8.GUION ALTERNATIVO. Español, emojis.",
            get_llamada_context(filters=filters, asesor=asesor)
        )
    }
