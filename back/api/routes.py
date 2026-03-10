import pandas as pd
import numpy as np
import dotenv
from fastapi import APIRouter, Depends
from pydantic import BaseModel

# Modelos y Filtros
from api.models import FilterModel
from api.filters.test import test
from api.database import client as bq_client

# Importaciones de filtros 
from api.filters.resultado_llamada import resultado_llamada
from api.filters.plan_mencionado import plan_mencionado
from api.filters.duracion_llamada import duracion_llamada
from api.filters.saludo_asesor import saludo_asesor
from api.filters.nombre_asesor import nombre_asesor
from api.filters.nombre_atencion import nombre_atencion
from api.filters.clasificacion_sentimiento import clasificacion_sentimiento
from api.filters.modulo_atencion import modulo_atencion
from api.filters.tipo_llamada import tipo_llamada
from api.filters.asistencia_mencionada import asistencia_mencionada

# Importaciones de Gráficos 
from api.charts.transcripciones import transcripciones
from api.charts.tipo_vehiculo import tipo_vehiculo
from api.charts.tipo_mascota import tipo_mascota
from api.charts.rendimiento_hora import rendimiento_hora
from api.charts.rendimiento_agente import rendimiento_agente
from api.charts.planes_mencionados import planes_mencionados
from api.charts.distribucion_resultado import distribucion_resultado
from api.charts.motivo_rechazo import motivo_rechazo
from api.charts.duraccion_efectivo import duraccion_efectivo
from api.charts.embudo_conversacion import embudo_conversacion
from api.charts.kpi import kpi

# IMPORTACIÓN DE TU NUEVO ARCHIVO DE CHAT
from api.chat import api_chat_logic, ChatRequest 

dotenv.load_dotenv()
router = APIRouter()

# -------------------------------------------------- #
# ----------------------- IA ----------------------- #
# -------------------------------------------------- #

from api.chat import api_chat_logic, ChatRequest

@router.post("/api/chat")
async def api_chat(request: ChatRequest):
    return await api_chat_logic(request)

# ------------------------------------------------------- #
# ----------------------- Filters ----------------------- #
# ------------------------------------------------------- #

@router.get("/api/resultado_llamada")
def api_resultado_llamada(filters: FilterModel = Depends()):
    return resultado_llamada(filters)

@router.get("/api/plan_mencionado")
def api_plan_mencionado(filters: FilterModel = Depends()):
    return plan_mencionado(filters)



# ------------------------------------------------------ #
# ----------------------- Charts ----------------------- #
# ------------------------------------------------------ #

@router.get("/api/rendimiento_hora")
def api_rendimiento_hora(filters: FilterModel = Depends()):
    return rendimiento_hora(filters)

@router.get("/api/kpi")
def api_kpi(filters: FilterModel = Depends()):
    return kpi(filters)

@router.get("/api/duracion_llamada")
def api_duracion_llamada(filters: FilterModel = Depends()):
    return duracion_llamada(filters)

@router.get("/api/saludo_asesor")
def api_saludo_asesor(filters: FilterModel = Depends()):
    return saludo_asesor(filters)

@router.get("/api/nombre_asesor")
def api_nombre_asesor(filters: FilterModel = Depends()):
    return nombre_asesor(filters)

@router.get("/api/modulo_atencion")
def api_modulo_atencion(filters: FilterModel = Depends()):
    return modulo_atencion(filters)

@router.get("/api/tipo_llamada")
def api_tipo_llamada(filters: FilterModel = Depends()):
    return tipo_llamada(filters)

@router.get("/api/asistencia_mencionada")
def api_asistencia_mencionada(filters: FilterModel = Depends()):
    return asistencia_mencionada(filters)

@router.get("/api/clasificacion_sentimiento")
def api_clasificacion_sentimiento(filters: FilterModel = Depends()):
    return clasificacion_sentimiento(filters)



@router.get("/api/distribucion_resultado")
def api_distribucion_resultado(filters: FilterModel = Depends()):
    return distribucion_resultado(filters)

# ------------------------------------------------------ #
# ------------- Consultas Directas BigQuery ------------- #
# ------------------------------------------------------ #


@router.get("/scorecard-asesores")
def scorecard_asesores(filters: FilterModel = Depends()):
    where = filters.get_query()
    query = f"""
    SELECT Cuenta nombre, COUNT(*) total, SUM(CAST(efectiva AS FLOAT64)) ventas
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where} GROUP BY Cuenta ORDER BY total DESC
    """
    job = bq_client.query(query)
    return job.to_dataframe().to_dict(orient="records")