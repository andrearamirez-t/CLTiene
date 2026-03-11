import pandas as pd
from api.database import client
from api.ia.llm import generar_respuesta_ia


def analizar_patrones_dashboard(filters=None):

    # -----------------------------
    # Construcción segura del WHERE
    # -----------------------------
    where = "1=1"

    if filters:
        q = filters.get_query()
        if q:
            where = q

    print("WHERE:", where)

    # -----------------------------
    # Query a BigQuery
    # -----------------------------
    query = f"""
    SELECT
        Cuenta,
        resultado_llamada,
        tipo,
        Nombre_del_Modulo,
        clasificacion,
        duracion_estimada
    FROM `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
    WHERE {where}
    """

    print(query)

    # -----------------------------
    # Ejecutar query
    # -----------------------------
    job = client.query(query)
    df = job.to_dataframe()

    # -----------------------------
    # Métricas básicas
    # -----------------------------
    total_llamadas = len(df)

    ventas = df[df["resultado_llamada"] == "Venta"].shape[0]

    tasa_conversion = 0
    if total_llamadas > 0:
        tasa_conversion = round((ventas / total_llamadas) * 100, 2)

    # -----------------------------
    # Top asesores
    # -----------------------------
    top_asesores = (
        df[df["resultado_llamada"] == "Venta"]
        .groupby("Cuenta")
        .size()
        .sort_values(ascending=False)
        .head(3)
    )

    # -----------------------------
    # Prompt para la IA
    # -----------------------------
    prompt = f"""
Analiza los siguientes datos de un call center.

Total llamadas: {total_llamadas}
Ventas: {ventas}
Tasa de conversión: {tasa_conversion}%

Top asesores con más ventas:
{top_asesores}

Genera un análisis con esta estructura:

1. PATRÓN DE ÉXITO
2. PATRÓN DE FRACASO
3. ESTRATEGIA
4. KPIs CLAVE
5. QUICK WINS

Escribe en español profesional para un dashboard de analítica.
"""

    # -----------------------------
    # Llamada al modelo de IA
    # -----------------------------
    respuesta = generar_respuesta_ia(prompt)

    # -----------------------------
    # Respuesta API
    # -----------------------------
    return {
        "analisis": respuesta
    }