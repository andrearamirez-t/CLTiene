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

# --- 4. CHAT CON TUS DATOS (Búsqueda) ---
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