from datetime import datetime, timedelta

from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_data_context, contexto_tipo_llamada, get_periodo_anterior_context


def _contexto_periodo_anterior(filters: FilterModel) -> str:
    """Si hay rango de fechas, computa el período inmediatamente anterior (mismo largo,
    mismos filtros) y devuelve su bloque de comparación. '' si no aplica o falla."""
    fd, fh = filters.fecha_desde, filters.fecha_hasta
    if not (fd and fh):
        return ""
    try:
        d1 = datetime.strptime(fd, "%Y-%m-%d").date()
        d2 = datetime.strptime(fh, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return ""
    prev_hasta = d1 - timedelta(days=1)
    prev_desde = prev_hasta - timedelta(days=(d2 - d1).days)
    prev = filters.model_copy(update={
        "fecha_desde": prev_desde.strftime("%Y-%m-%d"),
        "fecha_hasta": prev_hasta.strftime("%Y-%m-%d"),
    })
    try:
        return get_periodo_anterior_context(
            prev.get_query(), prev_desde.strftime("%Y-%m-%d"), prev_hasta.strftime("%Y-%m-%d")
        )
    except Exception:
        return ""


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
            "distinto de la calidad de la conversación. 'Contestada' NO es 'contacto efectivo': una "
            "llamada puede ser 100% Contestada por el marcador y AÚN así quedar 'sin contacto' (hubo "
            "llamada pero nunca hablaron con la persona: buzón, cuelga rápido). Cuando el estatus da "
            "100% contestada pero hay resultados 'sin contacto', incluye SIEMPRE en la sección Estatus "
            "una Nota metodológica breve, textual: 'Nota: una llamada contestada indica que la marcación "
            "fue atendida o estableció conexión; no implica necesariamente un contacto efectivo ni una "
            "conversación de calidad con el cliente.' Así NO se lee como contradicción.\n"
            "- 'Posibles ventas': preséntala SIEMPRE con número Y porcentaje juntos, formato 'N (X.X%)' "
            "(ej. '24 (2.5%)'), igual en el Resumen, el Tablero y por asesor. Nunca solo el % ni solo el número.\n"
            "- TMO: muéstralo SIEMPRE en el formato M:SS tal como viene en el contexto (ej. '1:22', '1:11'); "
            "NO lo reformatees a '0:01:22' ni cambies el formato entre secciones.\n\n"

            "REGLA DEL SEMÁFORO — el contexto ya trae la sección 'SEMÁFOROS YA CALCULADOS'. "
            "COPIA ESE color EXACTO para cada indicador en el Tablero (NO lo recalcules ni lo cambies "
            "por tu criterio de 'bueno/malo'). Es lo que garantiza que el mismo valor dé el mismo color "
            "entre un informe y otro. Para Saludo/Calidad (que no vienen precalculados): 🔴 si es "
            "claramente bajo respecto al volumen, si no 🟡.\n\n"

            "REGLA DE COMPARACIÓN ENTRE PERÍODOS:\n"
            "- Si el contexto incluye datos del período anterior, compáralos explícitamente con el actual.\n"
            "- Identifica cambios en volumen, contactabilidad, TMO, participación del cliente y posibles ventas.\n"
            "- Indica claramente si cada indicador aumentó, disminuyó o se mantuvo estable.\n"
            "- El período actual es siempre el principal; el anterior se usa únicamente como línea base.\n"
            "- Incluye la comparación principalmente en el Resumen Ejecutivo y en Patrones y Hallazgos.\n"
            "- No inventes comparaciones ni datos que no estén disponibles en ambos períodos.\n\n"

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

            "Usa porcentajes y emojis con moderación. No inventes datos que no estén en el contexto.\n"
            "REGLA DE FORMATO CRÍTICA: CADA sección debe tener su PROPIO contenido (mínimo 1-2 "
            "frases o su tabla); NUNCA dejes un encabezado vacío. NO traslades el análisis de una "
            "sección a otra: el desglose del estatus (Contestada/No Contestada/Ocupada con conteos) "
            "va SIEMPRE en la sección 'Estatus de Llamadas', NO en el Resumen — aunque sea 100% de "
            "una sola categoría, escríbelo ahí con su número."
        ),
        f"Genera el reporte gerencial con estos datos del periodo filtrado:\n"
        f"{get_data_context(filters.get_query())}"
        f"{_contexto_periodo_anterior(filters)}"
    )
    return {"result": content, "error": error}
