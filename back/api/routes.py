from api.database import calculo_fecha
from api.chat import api_chat_logic, ChatRequest
from api.filters.transcripcion.metricas import metricas
from api.filters.transcripcion.llamadas import llamadas
from api.filters.transcripcion.llamada import llamada
import pandas as pd
import numpy as np

from fastapi import APIRouter

from fastapi import APIRouter, Depends

from api.models import FilterModel
from pydantic import BaseModel

from api.filters.test import test
from api.database import option
from api.database import client


from api.ia.analizar_patrones_dashboard import analizar_patrones_dashboard


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
from api.charts.embudo_conversacion import embudo_conversacion
from api.charts.kpi import kpi

from api.ia.generar_insights import generar_insights
from api.ia.analizar_asesor import analizar_asesor
from api.ia.analizar_patrones_ventas import analizar_patrones_ventas
from api.ia.analizar_inteligencia_operativa import analizar_inteligencia_operativa
from api.ia.analizar_llamada import analizar_llamada
from api.ia.chat_inteligente import chat_inteligente
from api.ia.analisis_automatico import analisis_automatico
from api.ia.analizar_busqueda_transcripciones import analizar_busqueda_transcripciones
from api.ia.resumir_llamada import resumir_llamada
from api.ia.analisis_comparativo_ranking import analisis_comparativo_ranking
from api.ia.generar_reporte_completo import generar_reporte_completo

import dotenv

dotenv.load_dotenv()

router = APIRouter()

# ------------------------------------------------------- #
# -------------------- Transcripcion -------------------- #
# ------------------------------------------------------- #


@router.get("/api/transcripcion/llamadas")
def api_llamadas(filters: FilterModel = Depends()):
    return llamadas(filters)


@router.get("/api/transcripcion/llamada/{id}")
def api_llamada(id: int, buscar: str | None = None):
    return llamada(id, buscar)


@router.get("/api/transcripcion/metricas/{id}")
def api_metricas(id):
    return metricas(id)


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


# -------------------------------------------------- #
# ----------------------- IA ----------------------- #
# -------------------------------------------------- #


class AnalisisAutomaticoRequest(BaseModel):
    tipo_analisis: str
    filtros: dict | None = None


@router.post("/api/chat")
async def api_chat(request: ChatRequest, filters: FilterModel = Depends()):
    return await api_chat_logic(request, filters)


@router.post("/api/busqueda_inteligente")
async def api_busqueda_inteligente(query: str | None = None, filters: FilterModel = Depends()):
    return chat_inteligente(query, filters)


# ------------------------------------------------------ #
# ----------------------- Charts ----------------------- #
# ------------------------------------------------------ #
@router.get("/api/transcripciones")
def api_transcripciones(filters: FilterModel = Depends()):
    return transcripciones(filters)


@router.get("/api/tipo_vehiculo")
def api_tipo_vehiculo(filters: FilterModel = Depends()):
    return tipo_vehiculo(filters)


@router.get("/api/tipo_mascota")
def api_tipo_mascota(filters: FilterModel = Depends()):
    return tipo_mascota(filters)


@router.get("/api/rendimiento_hora")
def api_rendimiento_hora(filters: FilterModel = Depends()):
    return rendimiento_hora(filters)


@router.get("/api/rendimiento_agente")
def api_rendimiento_agente(filters: FilterModel = Depends()):
    return rendimiento_agente(filters)


@router.get("/api/planes_mencionados")
def api_planes_mencionados(filters: FilterModel = Depends()):
    return planes_mencionados(filters)


@router.get("/api/distribucion_resultado")
def api_distribucion_resultado(filters: FilterModel = Depends()):
    return distribucion_resultado(filters)


@router.get("/api/motivo_rechazo")
def api_motivo_rechazo(filters: FilterModel = Depends()):
    return motivo_rechazo(filters)


@router.get("/api/duraccion_efectivo")
def api_duraccion_efectivo(filters: FilterModel = Depends()):
    return duraccion_efectivo(filters)


@router.get("/api/embudo_conversacion")
def api_embudo_conversacion(filters: FilterModel = Depends()):
    return embudo_conversacion(filters)


@router.get("/api/kpi")
def api_kpi(filters: FilterModel = Depends()):
    return kpi(filters)


@router.get("/ia/generar_insights")
def api_generar_insights(filters: FilterModel = Depends()):
    return generar_insights(filters)


@router.get("/ia/analizar_asesor")
def api_analizar_asesor(asesor: str, filters: FilterModel = Depends()):
    return analizar_asesor(filters, asesor)


@router.get("/ia/inteligencia_operativa")
def api_inteligencia_operativa(filters: FilterModel = Depends()):
    return analizar_inteligencia_operativa(filters)


@router.get("/ia/analizar_llamada")
def api_analizar_llamada(llamada_id: str, filters: FilterModel = Depends()):
    return analizar_llamada(filters, llamada_id)


# @router.post("/ia/chat_inteligente")
# def api_chat_inteligente(pregunta: str | None = None, filters: FilterModel = Depends()):
#     return chat_inteligente(pregunta, filters)


@router.get("/ia/analisis_automatico")
def api_analisis_automatico(tipo_analisis: str, filters: FilterModel = Depends()):
    return analisis_automatico(filters, tipo_analisis)


@router.get("/ia/busqueda_transcripciones")
def api_busqueda_transcripciones(search_query: str, filters: FilterModel = Depends()):
    return analizar_busqueda_transcripciones(filters, search_query)


@router.get("/ia/resumir_llamada")
def api_resumir_llamada(asesor: str, filters: FilterModel = Depends()):
    return resumir_llamada(filters, asesor)


@router.get("/ia/analisis_ranking")
def api_analisis_ranking(filters: FilterModel = Depends()):
    return analisis_comparativo_ranking(filters)


@router.get("/ia/reporte_completo")
def api_reporte_completo(filters: FilterModel = Depends()):
    return generar_reporte_completo(filters)


# -------------------------------------------------- #
# ----------------------- IA ----------------------- #
# -------------------------------------------------- #


@router.get("/rendimiento-hora")
def x_rendimiento_hora(filters: FilterModel = Depends()):

    where = filters.get_query() or "1=1"

    query = f"""
    SELECT
    LPAD (
        CAST(
        EXTRACT(
            HOUR
            FROM
            {calculo_fecha()}
        ) AS STRING
        ),
        2,
        '0'
    ) name,
    COUNT(*) t,
    SUM(
        CASE
        WHEN resultado_llamada = 'Venta' THEN 1
        ELSE 0
        END
    ) ventas
    FROM
    `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY
    name
    ORDER BY
    name
    """

    job = client.query(query)
    df = job.to_dataframe()

    df["ef"] = (df["ventas"] / df["t"] * 100).round(1)

    return df[["name", "t", "ef"]].to_dict(orient="records")


# api/routes/inteligencia.py


@router.get("/rendimiento-dia")
def x_rendimiento_dia(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        FORMAT_DATE(
            '%A',
            {calculo_fecha()}
        ) name,
        COUNT(*) t,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) ventas
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY name
    """

    job = client.query(query)
    df = job.to_dataframe()

    df["ef"] = (
        (df["ventas"] / df["t"] * 100)
        .replace([float("inf"), -float("inf")], 0)
        .fillna(0)
        .round(1)
    )

    # Reemplazar inf y -inf
    df = df.replace([np.inf, -np.inf], None)

    # Convertir NaN, NA y NaT a None
    df = df.where(pd.notnull(df), None)

    # Convertir columnas a tipos Python estándar
    df = df.astype(object)

    result = df[["name", "t", "ef"]].to_dict(orient="records")

    return result


@router.get("/ventas-vs-servicio")
def ventas_vs_servicio(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        tipo name,
        COUNT(*) total,
        SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END) efectivas
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY tipo
    """

    job = client.query(query)
    df = job.to_dataframe()

    return df[["name", "total", "efectivas"]].to_dict(orient="records")


@router.get("/subjetividad-confianza-modulo")
def subjetividad_confianza_modulo(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        Nombre_del_Modulo name,
        AVG(subjectivity) x,
        AVG(confianza) y
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY Nombre_del_Modulo
    """

    job = client.query(query)
    df = job.to_dataframe()

    colores = {"CRM": "#10b981", "ASISTENCIA": "#e11d48"}

    df["color"] = df["name"].map(colores).fillna("#94a3b8")

    return df[["x", "y", "name", "color"]].to_dict(orient="records")


@router.get("/desempeno-sentimiento-asesor")
def desempeno_sentimiento_asesor(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    WITH base AS (
        SELECT
            Cuenta,
            clasificacion
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    ),

    agg AS (
        SELECT
            Cuenta,
            COUNTIF(clasificacion = 'negativo') neg,
            COUNTIF(clasificacion = 'neutro') neu,
            COUNTIF(clasificacion = 'positivo') pos,
            COUNT(*) total
        FROM base
        GROUP BY Cuenta
    )

    SELECT
        Cuenta n,
        SAFE_DIVIDE(neg,total)*100 negativo,
        SAFE_DIVIDE(neu,total)*100 neutro,
        SAFE_DIVIDE(pos,total)*100 positivo
    FROM agg
    ORDER BY total DESC
    """

    job = client.query(query)
    df = job.to_dataframe()

    return df.fillna(0).to_dict(orient="records")


@router.get("/evolucion-ventas")
def evolucion_ventas(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    WITH base AS (
        SELECT
            DATE_TRUNC(
                {calculo_fecha()},
                WEEK(MONDAY)
            ) semana,
            CAST(efectiva AS FLOAT64) efectiva
        FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
        WHERE {where}
    )

    SELECT
        semana fecha,
        COUNT(*) ingresos,
        SUM(efectiva) ventas
    FROM base
    GROUP BY semana
    ORDER BY semana
    """

    job = client.query(query)
    df = job.to_dataframe()

    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    df["fecha"] = df["fecha"].dt.strftime("%b %d")

    df = df.replace([float("inf"), -float("inf")], None)
    df = df.where(pd.notnull(df), None)

    return df.to_dict(orient="records")


@router.get("/scorecard-asesores")
def scorecard_asesores(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        Cuenta nombre,
        COUNT(*) total,
        SUM(CAST(efectiva AS FLOAT64)) ventas,
        ROUND(
            SAFE_DIVIDE (SUM(CAST(efectiva AS FLOAT64)), COUNT(*)) * 100,
            1
        ) efectividad,
        ROUND(AVG(CAST(Turnos_Asesor_V4 AS FLOAT64)), 1) turnosAsesor,
        ROUND(AVG(CAST(Turnos_Cliente_V4 AS FLOAT64)), 1) turnosCliente,
        ROUND(AVG(CAST(palabras AS FLOAT64)), 0) palabras,
        ROUND(AVG(CAST(saludo_inicial AS FLOAT64)), 3) saludo,
        ROUND(AVG(CAST(identificacion_cliente AS FLOAT64)), 3) identificacion,
        ROUND(AVG(CAST(comprension_problema AS FLOAT64)), 3) comprension,
        ROUND(AVG(CAST(ofrecimiento_solucion AS FLOAT64)), 3) ofrecimiento,
        ROUND(AVG(CAST(manejo_inquietudes AS FLOAT64)), 3) manejo,
        ROUND(AVG(CAST(cierre_servicio AS FLOAT64)), 3) cierre,
        ROUND(AVG(CAST(proximo_paso AS FLOAT64)), 3) paso
    FROM
        `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY
        Cuenta
    ORDER BY
        efectividad DESC
    """

    job = client.query(query)
    df = job.to_dataframe()

    return df.to_dict(orient="records")


@router.get("/duracion-vs-efectividad")
def duracion_vs_efectividad(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        duracion_estimada name,
        COUNT(*) total,
        ROUND(
            SAFE_DIVIDE(
                SUM(CASE WHEN resultado_llamada = 'Venta' THEN 1 ELSE 0 END),
                COUNT(*)
            ) * 100,1
        ) efectividad
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY duracion_estimada
    """

    job = client.query(query)
    df = job.to_dataframe()

    return df[["name", "total", "efectividad"]].to_dict(orient="records")


@router.get("/clasificacion-sentimiento")
def x_clasificacion_sentimiento(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        clasificacion AS name,
        COUNT(*) AS value
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where} and clasificacion IS NOT NULL
    GROUP BY clasificacion
    ORDER BY value DESC
    """

    job = client.query(query)
    df = job.to_dataframe()

    return df[["name", "value"]].to_dict(orient="records")


@router.get("/duracion_llamadas")
def api_duracion_llamadas(filters: FilterModel = Depends()):

    where = filters.get_query()

    query = f"""
    SELECT
        Duracion_Estimada as label,
        COUNT(*) as valor
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    GROUP BY Duracion_Estimada
    """

    job = client.query(query)
    rows = list(job.result())  # ← solución

    colores = {
        "Buzón": "#EE7553",
        "Muy Corta": "#EC635F",
        "Corta": "#EB526A",
        "Media": "#E94176",
        "Larga": "#E83081",
    }

    total = sum(r.valor for r in rows)

    data = []

    for r in rows:
        data.append(
            {
                "label": r.label,
                "valor": r.valor,
                "porcentaje": f"{(r.valor/total)*100:.1f}%",
                "color": colores.get(r.label, "#8884d8"),
            }
        )

    return data


@router.get("/analisis-patrones")
def analisis_patrones(filters: FilterModel = Depends()):
    return analizar_patrones_dashboard(filters)


@router.get("/api/lista_llamadas")
def api_lista_llamadas(filters: FilterModel = Depends()):

    where = filters.get_query()

    return option(
        f"""
    SELECT 
        ROW_NUMBER() OVER (ORDER BY fecha ASC) AS id,
        Resultado_Llamada,
        Num_Turnos_V4,
        Telefono,
        Cuenta
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    AND transcripcion IS NOT NULL
    ORDER BY fecha DESC
    """,
        "id",
        "concat('#', id, ' | ', Resultado_Llamada, ' | ', Num_Turnos_V4, ' | ', Telefono, ' | ', Cuenta)",
    )
