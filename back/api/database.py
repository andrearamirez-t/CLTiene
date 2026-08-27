import os
import time
from google.cloud import bigquery

client = bigquery.Client(project=os.getenv("CLOUD_PROJECT"))

# --- Cache en memoria de resultados de SELECT ---
# La tabla se actualiza SEMANAL (subir_datos.py), así que un TTL corto evita
# re-consultar BigQuery en cada carga del dashboard (los KPIs + gráficas lanzan
# muchas queries) sin arriesgar datos viejos. Solo se cachean LECTURAS: result()
# y option() solo hacen SELECT. Con min-instances=1 la instancia caliente
# conserva el cache entre peticiones.
_CACHE_TTL = 300   # segundos (5 min)
_CACHE_MAX = 500   # tope de entradas (evita crecer sin límite)
_cache = {}


def _run_cached(key: str, runner):
    """Devuelve el resultado cacheado si está fresco; si no, corre runner(),
    lo guarda y lo devuelve."""
    now = time.time()
    hit = _cache.get(key)
    if hit is not None and now - hit[0] < _CACHE_TTL:
        return hit[1]

    records = runner()

    if len(_cache) >= _CACHE_MAX:                 # purga entradas ya expiradas
        for k, (t, _) in list(_cache.items()):
            if now - t >= _CACHE_TTL:
                _cache.pop(k, None)
    _cache[key] = (now, records)
    return records


def clear_cache():
    """Vacía el cache (útil, p. ej., tras una carga de datos)."""
    _cache.clear()


def result(query: str, query_parameters: list = []):
    def _run():
        job = bigquery.QueryJobConfig(query_parameters=query_parameters)
        print(f"Query-result: {query}")
        job2 = client.query(query, job)
        df = job2.to_dataframe()
        return {} if df.empty else df.to_dict(orient="records")

    return _run_cached(f"result::{query}::{query_parameters!r}", _run)


def option(query: str, column_id: str, column_name: str | None = None):
    column_name = column_name if column_name else column_id

    o_query = f"""
    -- Solo valido que el ID no este vacio y agrupo los nombres para que no se repitan
    with result as (
        {query}
    ) select {column_id} id, {column_name} name from result where {column_id} is not null
    -- group by {column_name}
    """

    def _run():
        print(o_query)
        job = client.query(o_query)
        df = job.to_dataframe()
        return {} if df.empty else df.to_dict(orient="records")

    return _run_cached(f"option::{o_query}", _run)


def calculo_fecha() -> str:
    # Fecha es INTEGER en nanosegundos → dividir por 1000 para microsegundos
    return "DATETIME(TIMESTAMP_MICROS(DIV(Fecha, 1000)))"
