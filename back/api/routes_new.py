from fastapi import APIRouter, Body, Query
import json
import os
import pandas as pd
from google.cloud import bigquery
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

client = bigquery.Client()
client_openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fetch_bigquery_data(query: str):
    return client.query(query).to_dataframe()

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

        response = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un Consultor de Calidad en Call Center. Responde únicamente en JSON."},
                {"role": "user", "content": f"Analiza estas llamadas y genera un JSON con llaves: 'resumen', 'hallazgos' (array), 'recomendaciones' (array). Datos: {texto_contexto}"}
            ],
            response_format={ "type": "json_object" }
        )
        
        return {"resultado": json.loads(response.choices[0].message.content)}
    except Exception as e:
        return {"resultado": None, "error": str(e)}

@router.post("/resumir_llamada")
async def resumir_llamada(payload: dict = Body(...)):
    cuenta = payload.get("cuenta")
    try:
        query = f"""
            SELECT transcripcion FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` 
            WHERE cuenta = '{cuenta}' LIMIT 1
        """
        df = fetch_bigquery_data(query)
        texto = df['transcripcion'].iloc[0] if not df.empty else "No se encontró transcripción."

        response = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Resume la llamada en 3 puntos clave. Formato JSON: {'resumen': '...', 'puntos_clave': []}"},
                {"role": "user", "content": texto}
            ],
            response_format={ "type": "json_object" }
        )
        return {"resultado": json.loads(response.choices[0].message.content)}
    except Exception as e:
        return {"resultado": None, "error": str(e)}

@router.get("/ranking_ia")
async def obtener_ranking():
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
        response = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un asistente de soporte para el dashboard de Call Center."},
                {"role": "user", "content": pregunta}
            ]
        )
        return {"respuesta": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


        @router.post("/analisis_ranking_ia")
        async def analizar_ranking(payload: dict = Body(...)):
         asesores = payload.get("asesores", [])
    try:
        # Convertimos la lista de asesores a texto para que la IA la entienda
        contexto = "\n".join([f"#{a['posicion']} {a['nombre']}: {a['puntos']} pts, {a['ventas']} ventas" for a in asesores])

        response = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un experto en gestión de equipos. Responde solo en JSON con llaves: 'analisis_top' (string), 'mejoras' (lista), 'mentoria' (string)."},
                {"role": "user", "content": f"Analiza este ranking y dime quiénes son los mejores y qué debe mejorar el resto:\n{contexto}"}
            ],
            response_format={ "type": "json_object" }
        )
        return {"resultado": json.loads(response.choices[0].message.content)}
    except Exception as e:
        return {"error": str(e)}
    

   

@router.get("/ranking_asesores")
async def obtener_ranking():
    """Trae la lista de asesores para mostrar en la tabla inicial"""
    try:
        query = """
            SELECT 
                cuenta as nombre, 
                COUNT(*) as llamadas,
                SUM(CASE WHEN Resultado_Llamada = 'Venta' THEN 1 ELSE 0 END) as ventas,
                ROUND(AVG(saludo_inicial) * 100) as puntos
            FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
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
async def analizar_ranking(payload: dict = Body(...)):
    """Genera un informe avanzado asegurando que los tipos de datos no rompan el frontend"""
    asesores = payload.get("asesores", [])
    try:
        if not asesores:
            return {"resultado": {"analisis_top": "", "mejoras": [], "mentoria": ""}}

        contexto = "\n".join([
            f"Asesor: {a['nombre']} | Posición: #{a['posicion']} | Puntos: {a['puntos']} | Ventas: {a['ventas']} | Llamadas: {a['llamadas']}" 
            for a in asesores
        ])

        response = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "Eres un experto en Call Center. Tu respuesta DEBE ser un JSON con 3 llaves estrictas:\n"
                        "1. 'analisis_top': Un string con el Informe del TOP 3, justificaciones y '¿Qué hacen bien?'.\n"
                        "2. 'mejoras': Una LISTA DE STRINGS (Array) donde cada elemento sea un hallazgo o análisis individual.\n"
                        "3. 'mentoria': Un string con Brechas, Plan de Mentoría, Metas a 30 días y Perfil Ganador.\n"
                        "IMPORTANTE: 'mejoras' debe ser siempre una lista []. Usa emojis y Markdown."
                    )
                },
                {"role": "user", "content": f"Genera el informe detallado para estos datos:\n{contexto}"}
            ],
            response_format={ "type": "json_object" }
        )
        
        data = json.loads(response.choices[0].message.content)
        
        if not isinstance(data.get("mejoras"), list):
            data["mejoras"] = [str(data.get("mejoras", ""))]

        return {"resultado": data}

    except Exception as e:
        print(f"Error crítico: {e}")
        return {"resultado": {"analisis_top": "Error", "mejoras": ["Error al procesar"], "mentoria": str(e)}}