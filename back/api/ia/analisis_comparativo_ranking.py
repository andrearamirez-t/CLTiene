from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_ranking_context, contexto_tipo_llamada


def analisis_comparativo_ranking(filters: FilterModel):
    es_servicio = (filters.tipo_llamada or "").lower() == "servicio"
    # Puntos que mencionan ventas se reformulan cuando el filtro es Servicio
    punto_rendimiento = (
        "- 🎯 EFECTIVIDAD EN EL SERVICIO (con números)"
        if es_servicio else
        "- 🎯 ¿RINDE MÁS EN VENTAS O SERVICIO? (con números)"
    )
    perfil_ganador = (
        "7. 🎯 PERFIL GANADOR (Características de los asesores con mejor rendimiento en atención y servicio)"
        if es_servicio else
        "7. 🎯 PERFIL GANADOR (Características de los asesores que más venden o tienen mejor rendimiento)"
    )
    content, error = call(
        prompt_html(contexto_tipo_llamada(filters) + f"""Eres Director de Operaciones de un call center en Colombia. Genera un informe COMPLETO y ACCIONABLE.

            ESTRUCTURA OBLIGATORIA:
            1. 🏆 TOP 3 ASESORES - Por qué son los mejores, qué hacen bien
            2. 📉 3 ASESORES CON MAYOR OPORTUNIDAD DE MEJORA - Por qué están abajo, qué les falta
            3. 📊 ANÁLISIS INDIVIDUAL POR ASESOR:
            Para CADA Y TODOS de los asesores que esten en la lista de Ranking IA incluir siempre debe poner el nombre del asesor y luego desarrollar los siguientes puntos:
            - ✅ FORTALEZAS (mínimo 2, con datos específicos)
            - ❌ DEBILIDADES (mínimo 2, con datos específicos)
            - 📈 CÓMO PUEDE MEJORAR (acciones concretas y medibles)
            {punto_rendimiento}
            4. 🔄 BRECHAS ENTRE MEJOR Y PEOR
            5. 📋 PLAN DE MENTORÍA (quién entrena a quién y en qué)
            6. 🎯 METAS A 30 DÍAS por cada asesor que esta en la lista
            {perfil_ganador}

            Usa datos específicos, porcentajes, comparaciones. Español, emojis, formato claro.
            """),
        get_ranking_context(filters.get_query(), es_servicio=es_servicio)
    )
    return {"result": content, "error": error}
