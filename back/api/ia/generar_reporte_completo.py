from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context, contexto_tipo_llamada


def generar_reporte_completo(filters: FilterModel):
    content, error = call(
        prompt_html(
            contexto_tipo_llamada(filters) +
            "Eres el Director de Operaciones del Contact Center. Escribe un REPORTE GERENCIAL "
            "para la reunión semanal de comité (lo lee el supervisor del contact center y la gerencia). "
            "Estilo EJECUTIVO: directo, cuantitativo, orientado a decisiones. Prioriza operación real "
            "(marcaciones, contactabilidad, TMO, estatus de llamadas, productividad por asesor) sobre "
            "generalidades. Cada afirmación debe apoyarse en un número del contexto. Sin relleno.\n\n"

            "REGLAS DE INTERPRETACIÓN DE DATOS (obligatorias):\n"
            "- 'Posibles ventas' NO es venta cerrada real: se infiere de la transcripción y está "
            "sobreestimada. Refiérete SIEMPRE a ella como 'posibles ventas' o 'intención de venta', "
            "nunca como ventas confirmadas ni ingresos.\n"
            "- 'Llamadas de calidad' (contactadas) = score de calidad del asesor >= 80%, NO es 'contacto efectivo'.\n"
            "- TMO = tiempo medio de conversación (del Excel de tiempos, no del audio). "
            "INTERPRÉTALO EN CONTEXTO, NO asumas que 'menos TMO es mejor' (esa regla es de "
            "servicio/soporte). Un TMO BAJO (~1-2 min) junto con baja contactabilidad/conversión "
            "significa que las llamadas mueren temprano (rechazos rápidos), NO eficiencia → en ese "
            "caso NO recomiendes ni pongas como meta REDUCIR el TMO (sería contraproducente: no se "
            "vende en <1 min); lo que falta es que la conversación se desarrolle más. Solo sugiere "
            "reducir el TMO si es claramente ALTO (ej. >4-5 min) con señales de ineficiencia.\n"
            "- Participación del cliente = % de turnos hablados por el cliente (más alto = el asesor "
            "deja hablar/escucha más; muy bajo = monólogo del asesor).\n"
            "- Estatus de llamadas (Contestada / No Contestada / Ocupada) mide alcance del marcador, "
            "distinto de la calidad de la conversación.\n\n"

            "ESTRUCTURA (usa <h2> por sección, tablas SOLO donde aporten):\n"
            "1. Resumen Ejecutivo — 'lo esencial primero' (BLUF): 4-5 bullets con el titular del periodo "
            "(volumen, contactabilidad, TMO, participación, posibles ventas y la conclusión accionable). "
            "Que un gerente entienda el estado del área leyendo solo esto.\n"
            "2. Tablero de Indicadores — tabla: Indicador | Valor | Semáforo. Usa 🟢/🟡/🔴 y una lectura "
            "corta. Incluye Total llamadas, Contactabilidad, TMO, Participación cliente, Saludo, "
            "Calidad y Posibles ventas.\n"
            "3. Estatus de Llamadas — desglose Contestada/No Contestada/Ocupada con % y qué implica para "
            "el marcador y la franja horaria.\n"
            "4. Productividad por Asesor — tabla ordenada por volumen: Asesor | Llamadas | TMO | "
            "Contacto% | Saludos | Posibles ventas. Señala sobre/infra-carga y outliers de TMO (muy "
            "corto = posible mala atención; muy largo = posible ineficiencia).\n"
            "5. Calidad de la Interacción — saludo, beneficios, uso de WhatsApp, despedida/cierre y "
            "participación del cliente; señala la principal brecha.\n"
            "6. Patrones y Hallazgos — 3-4 hallazgos concretos con su número.\n"
            "7. Rechazos y Objeciones — distribución y cómo rebatir la principal.\n"
            "8. Recomendaciones Priorizadas — máx. 6, cada una con impacto esperado (alto/medio) y "
            "responsable sugerido (formación, supervisión, marcador, etc.).\n"
            "9. Plan de Acción (4 semanas) — qué hacer cada semana.\n"
            "10. Metas SMART — 3 metas medibles para el próximo periodo con línea base y objetivo.\n\n"

            "Usa porcentajes y emojis con moderación. No inventes datos que no estén en el contexto."
        ),
        f"Genera el reporte gerencial con estos datos del periodo filtrado:\n{get_data_context(filters.get_query())}"
    )
    return {"result": content, "error": error}
