import json
import os
from fastapi import APIRouter, Query
import google.generativeai as genai
from helpers.utils import get_search_results_context

router = APIRouter()

GEMINI_KEY = os.getenv("GEMINI_API_KEY") 
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@router.get("/api/obtener_lista_llamadas") 
async def obtener_lista():
    try:
        query = "SELECT id, cuenta FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas` LIMIT 15"
        query_job = client.query(query)
        data = query_job.to_dataframe().to_dict(orient='records')
        
        resultado = []
        for item in data:
            resultado.append({
                "id": str(item.get('id', '0')),
                "cuenta": item.get('cuenta') or "Cliente Desconocido"
            })
        
        return resultado 
    except Exception as e:
        print(f"Error: {e}")
        return []

@router.get("/api/resumir_llamada")
async def resumir_llamada(id: str = Query(...)):
       
        llamada_data = get_raw_calls_data(id=id) 
        
        prompt = f"""
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
        """

        response = model.generate_content(prompt)
        
        
        texto_limpio = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(texto_limpio)
    

    

    
   