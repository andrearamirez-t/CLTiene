from IA.Open_AI import call
from helpers.utils import get_history

from fastapi import APIRouter, Body, Query, Depends
import json
import os
import pandas as pd
from google.cloud import bigquery
from dotenv import load_dotenv
from api.database import client as bq_client
from api.models import FilterModel

load_dotenv()

router = APIRouter()


def fetch_bigquery_data(query: str):
    return bq_client.query(query).to_dataframe()


@router.post("/analisis_automatico")
async def generar_reporte_ia(payload: dict = Body(...)):
    try:
        query = """
            SELECT cuenta, Resultado_Llamada, transcripcion
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE transcripcion IS NOT NULL AND length(transcripcion) > 100
            LIMIT 10
        """
        df = fetch_bigquery_data(query)

        texto_contexto = ""
        for _, row in df.iterrows():
            texto_contexto += f"Asesor: {row['cuenta']} | Resultado: {row['Resultado_Llamada']} | Transcripción: {row['transcripcion'][:300]}...\n\n"

        contenido, error = call(
            "Eres un Consultor de Calidad en Call Center. Responde únicamente en JSON.",
            f"Analiza estas llamadas y genera un JSON con exactamente estas 3 llaves: 'resumen' (string), 'hallazgos' (array de strings, cada elemento es una frase), 'recomendaciones' (array de strings, cada elemento es una frase). NO uses objetos dentro de los arrays, solo strings. Datos: {texto_contexto}",
            response_format={"type": "json_object"},
        )
        if error:
            return {"resultado": None, "error": error}

        return {"resultado": json.loads(contenido)}
    except Exception as e:
        return {"resultado": None, "error": str(e)}


@router.get("/resumir_llamada/{id}")
async def resumir_llamada(id: str):

    llamada_data = get_history(f"id='{id}'")

    system_prompt = """
    Eres un analista experto en calidad de llamadas de servicio al cliente.
    Analiza conversaciones y genera evaluaciones claras y estructuradas.
    """

    user_prompt = f"""
    Analiza la siguiente transcripción de llamada de servicio al cliente:

    {llamada_data}

    Responde ESTRICTAMENTE en formato JSON con esta estructura:

    {{
        "info": {{
            "resultado": "Breve resumen de la llamada",
            "aciertos": ["Punto positivo 1", "Punto positivo 2"],
            "errores": ["Punto a mejorar 1", "Punto a mejorar 2"],
            "scorecard": {{
                "Saludo": 100,
                "Empatía": 80,
                "Resolución": 90,
                "Cierre": 70
            }}
        }},
        "chat": [
            {{"role": "Asesor", "text": "texto"}},
            {{"role": "Cliente", "text": "texto"}}
        ]
    }}

    No incluyas explicaciones adicionales.
    No uses markdown.
    Devuelve solo JSON válido.
    """

    respuesta, error = call(system_prompt, user_prompt)

    if error:
        return {"error": error}

    try:
        return json.loads(respuesta)
    except Exception:
        return {
            "error": "La IA devolvió un JSON inválido",
            "raw": respuesta
        }


@router.get("/ranking_ia")
async def ranking_ia():
    try:
        query = """
            SELECT cuenta,
                   AVG(saludo_inicial) * 100 as score_promedio,
                   COUNT(*) as total_llamadas
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            GROUP BY cuenta
            ORDER BY score_promedio DESC
            LIMIT 5
        """
        df = fetch_bigquery_data(query)
        ranking = df.to_dict(orient="records")
        return {"resultado": ranking}
    except Exception as e:
        return {"resultado": None, "error": str(e)}


@router.post("/chat_asistente")
async def chat_asistente(payload: dict = Body(...)):
    pregunta = payload.get("pregunta")
    try:
        contenido, error = call(
            "Eres un asistente de soporte para el dashboard de Call Center.",
            pregunta,
        )
        if error:
            return {"error": error}
        return {"respuesta": contenido}
    except Exception as e:
        return {"error": str(e)}


@router.get("/ranking_asesores")
async def ranking_asesores(filters: FilterModel = Depends()):
    try:
        where = filters.get_query() or "1=1"
        query = f"""
            SELECT
                cuenta as nombre,
                COUNT(*) as llamadas,
                SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) as ventas,
                ROUND(AVG(saludo_inicial) * 100) as puntos
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
            WHERE {where}
            GROUP BY cuenta
            ORDER BY puntos DESC
            LIMIT 10
        """
        df = fetch_bigquery_data(query)

        ranking = []
        for index, row in df.iterrows():
            ranking.append({
                "posicion": index + 1,
                "nombre": row['nombre'],
                "llamadas": int(row['llamadas']),
                "ventas": int(row['ventas']),
                "puntos": int(row['puntos'])
            })
        return ranking
    except Exception as e:
        print(f"Error en ranking_asesores: {e}")
        return []


@router.post("/analisis_ranking_ia")
async def analisis_ranking_ia(payload: dict = Body(...)):
    asesores = payload.get("asesores", [])
    try:
        if not asesores:
            return {"resultado": {"analisis_top": "", "mejoras": [], "mentoria": ""}}

        contexto = "\n".join([
            f"Asesor: {a['nombre']} | Posición: #{a['posicion']} | Puntos: {a['puntos']} | Ventas: {a['ventas']} | Llamadas: {a['llamadas']}"
            for a in asesores
        ])

        contenido, error = call(
            (
                "Eres un experto en Call Center. Tu respuesta DEBE ser un JSON con 3 llaves estrictas:\n"
                "1. 'analisis_top': Un string con el Informe del TOP 3, justificaciones y '¿Qué hacen bien?'.\n"
                "2. 'mejoras': Una LISTA DE STRINGS (Array) donde cada elemento sea un hallazgo o análisis individual.\n"
                "3. 'mentoria': Un string con Brechas, Plan de Mentoría, Metas a 30 días y Perfil Ganador.\n"
                "IMPORTANTE: 'mejoras' debe ser siempre una lista []. Usa emojis y Markdown."
            ),
            f"Genera el informe detallado para estos datos:\n{contexto}",
            response_format={"type": "json_object"},
        )
        if error:
            return {"resultado": {"analisis_top": "Error", "mejoras": ["Error al procesar"], "mentoria": error}}

        data = json.loads(contenido)

        if not isinstance(data.get("mejoras"), list):
            data["mejoras"] = [str(data.get("mejoras", ""))]

        return {"resultado": data}

    except Exception as e:
        print(f"Error crítico: {e}")
        return {"resultado": {"analisis_top": "Error", "mejoras": ["Error al procesar"], "mentoria": str(e)}}