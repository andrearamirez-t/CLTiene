from IA.Open_AI import call, prompt_html
from api.models import FilterModel
from helpers.utils import get_ranking_context


def analisis_comparativo_ranking(filters: FilterModel):
    return {
        "result": call(
            prompt_html("""Eres Director de Operaciones de un call center en Colombia. Genera un informe COMPLETO y ACCIONABLE.

            ESTRUCTURA OBLIGATORIA:
            1. 🏆 TOP 3 ASESORES - Por qué son los mejores, qué hacen bien
            2. 📉 3 ASESORES CON MAYOR OPORTUNIDAD DE MEJORA - Por qué están abajo, qué les falta
            3. 📊 ANÁLISIS INDIVIDUAL POR ASESOR:
            Para CADA Y TODOS de los asesores que esten en la lista de Ranking IA incluir siempre debe poner el nombre del asesor y luego desarrollar los siguientes puntos:
            - ✅ FORTALEZAS (mínimo 2, con datos específicos)
            - ❌ DEBILIDADES (mínimo 2, con datos específicos)
            - 📈 CÓMO PUEDE MEJORAR (acciones concretas y medibles)
            - 🎯 ¿RINDE MÁS EN VENTAS O SERVICIO? (con números)
            4. 🔄 BRECHAS ENTRE MEJOR Y PEOR
            5. 📋 PLAN DE MENTORÍA (quién entrena a quién y en qué)
            6. 🎯 METAS A 30 DÍAS por cada asesor que esta en la lista
            7. 🎯 PERFIL GANADOR (Caracteristicas de los asesores que más venden o tienen mejor rendimiento)

            Usa datos específicos, porcentajes, comparaciones. Español, emojis, formato claro.
            """),
            get_ranking_context(filters.get_query())
        )
    }
