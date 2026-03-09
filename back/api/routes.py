from fastapi import APIRouter

from fastapi import APIRouter, Depends

from api.models import FilterModel

from api.filters.test import test

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

from api.charts.transcripciones import transcripciones
from api.charts.tipo_vehiculo import tipo_vehiculo
from api.charts.tipo_mascota import tipo_mascota
from api.charts.rendimiento_hora import rendimiento_hora
from api.charts.rendimiento_agente import rendimiento_agente
from api.charts.planes_mencionados import planes_mencionados
from api.charts.distribucion_resultado import distribucion_resultado
from api.charts.motivo_rechazo import motivo_rechazo
from api.charts.duraccion_efectivo import duraccion_efectivo

router = APIRouter()


# ------------------------------------------------------- #
# ----------------------- Filters ----------------------- #
# ------------------------------------------------------- #
@router.get("/api/test")
def api_test(filters: FilterModel = Depends()):
    return test(filters)


@router.get("/api/resultado_llamada")
def api_resultado_llamada(filters: FilterModel = Depends()):
    return resultado_llamada(filters)


@router.get("/api/plan_mencionado")
def api_plan_mencionado(filters: FilterModel = Depends()):
    return plan_mencionado(filters)


@router.get("/api/duracion_llamada")
def api_duracion_llamada(filters: FilterModel = Depends()):
    return duracion_llamada(filters)


@router.get("/api/saludo_asesor")
def api_saludo_asesor(filters: FilterModel = Depends()):
    return saludo_asesor(filters)


@router.get("/api/nombre_asesor")
def api_nombre_asesor(filters: FilterModel = Depends()):
    return nombre_asesor(filters)


@router.get("/api/nombre_atencion")
def api_nombre_atencion(filters: FilterModel = Depends()):
    return nombre_atencion(filters)


@router.get("/api/clasificacion_sentimiento")
def api_clasificacion_sentimiento(filters: FilterModel = Depends()):
    return clasificacion_sentimiento(filters)


@router.get("/api/modulo_atencion")
def api_modulo_atencion(filters: FilterModel = Depends()):
    return modulo_atencion(filters)


@router.get("/api/tipo_llamada")
def api_tipo_llamada(filters: FilterModel = Depends()):
    return tipo_llamada(filters)


@router.get("/api/distribucion_resultado")
def api_distribucion_resultado(filters: FilterModel = Depends()):
    return distribucion_resultado(filters)


@router.get("/api/asistencia_mencionada")
def api_asistencia_mencionada(filters: FilterModel = Depends()):
    return asistencia_mencionada(filters)


# ------------------------------------------------------ #
# ----------------------- Charts ----------------------- #
# ------------------------------------------------------ #
@router.get("/api/transcripciones")
def api_transcripciones(filters: FilterModel = Depends):
    return transcripciones(filters)


@router.get("/api/tipo_vehiculo")
def api_tipo_vehiculo(filters: FilterModel = Depends):
    return tipo_vehiculo(filters)


@router.get("/api/tipo_mascota")
def api_tipo_mascota(filters: FilterModel = Depends):
    return tipo_mascota(filters)


@router.get("/api/rendimiento_hora")
def api_rendimiento_hora(filters: FilterModel = Depends):
    return rendimiento_hora(filters)


@router.get("/api/rendimiento_agente")
def api_rendimiento_agente(filters: FilterModel = Depends):
    return rendimiento_agente(filters)


@router.get("/api/planes_mencionados")
def api_planes_mencionados(filters: FilterModel = Depends):
    return planes_mencionados(filters)


@router.get("/api/distribucion_resultado")
def api_distribucion_resultado(filters: FilterModel = Depends):
    return distribucion_resultado(filters)


@router.get("/api/motivo_rechazo")
def api_motivo_rechazo(filters: FilterModel = Depends):
    return motivo_rechazo(filters)


@router.get("/api/duraccion_efectivo")
def api_duraccion_efectivo(filters: FilterModel = Depends):
    return duraccion_efectivo(filters)
