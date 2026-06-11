"""
Script autónomo: extrae datos del SQL Server de la CUN, procesa y sube a BigQuery.
Ejecutar desde un PC con sesión activa de la CUN (usa Windows Auth automáticamente).

Programar en Tarea de Windows para que corra automáticamente.
"""

import sys
import os
from datetime import datetime

# Agregar el directorio raíz del backend al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
import pandas as pd
import re
from google.cloud import bigquery

# ─── Configuración ──────────────────────────────────────────────────────────────

SQL_HOST     = "172.16.1.33"
SQL_PORT     = "1433"
SQL_DATABASE = "CUN_REPOSITORIO"

BQ_PROJECT = "desarrollo-investigaciones"
BQ_DATASET = "call_center"
BQ_TABLA   = "cltiene_llamadas_procesadas"

LOG_FILE = os.path.join(os.path.dirname(__file__), "subir_datos.log")


# ─── Logger ─────────────────────────────────────────────────────────────────────

def log(msg):
    linea = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(linea)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(linea + "\n")


# ─── SQL Server con Windows Auth (cuenta CUN) ───────────────────────────────────

def cargar_desde_sql():
    # trusted_connection=yes usa automáticamente tu sesión de Windows (cuenta CUN)
    url = (
        f"mssql+pyodbc://@{SQL_HOST}:{SQL_PORT}/{SQL_DATABASE}"
        f"?trusted_connection=yes&driver=SQL+Server"
    )
    engine = create_engine(url)

    sql = text("""
        WITH registros_unicos AS (
            SELECT cuenta,
                   TRY_CONVERT(datetime, fecha, 120) AS fecha,
                   COUNT(*) AS cant
            FROM CUN_REPOSITORIO.coe.CLTIENE_LLAMADAS
            WHERE TRY_CONVERT(datetime, fecha, 120) IS NOT NULL
            GROUP BY cuenta, TRY_CONVERT(datetime, fecha, 120)
        )
        SELECT
            TRY_CONVERT(datetime, b.Fecha, 120)          AS Fecha,
            b.[Contacto (Identificacion - Nombre],
            b.[Telefono], b.[Agente], b.[Cuenta],
            b.[Modulo], b.[Nombre del Modulo], b.[Motivo],
            b.[Estado de la LLamada],
            b.[Tiempo  de Llamada],
            b.[Tiempo  de Conversacion],
            b.[Estado de Registro], b.[Estado de Gestion],
            b.[Calificacion de la Llamada],
            b.[Direccion grabacion#1], b.[Direccion grabacion#2],
            b.[Direccion grabacion#3], b.[Direccion grabacion#4],
            b.[Direccion grabacion#5], b.[Direccion grabacion#6],
            b.[Direccion grabacion#7],
            b.[Comentario], b.[archivo],
            b.[saludo_inicial], b.[identificacion_cliente],
            b.[comprension_problema], b.[ofrecimiento_solucion],
            b.[manejo_inquietudes], b.[cierre_servicio], b.[proximo_paso],
            b.[efectiva], b.[polarity], b.[subjectivity],
            b.[clasificacion], b.[confianza], b.[palabras],
            b.[IDENTIFICACION], b.[fecha_carga], b.[transcripcion],
            CASE WHEN a.cant > 1 THEN 'mixto' ELSE b.tipo END AS tipo
        FROM CUN_REPOSITORIO.coe.CLTIENE_LLAMADAS b
        INNER JOIN registros_unicos a
            ON a.cuenta = b.cuenta
           AND a.fecha  = TRY_CONVERT(datetime, b.fecha, 120)
    """)

    with engine.connect() as conn:
        df = pd.read_sql_query(sql, conn)

    return df


# ─── Procesamiento ───────────────────────────────────────────────────────────────

def detectar_duracion_estimada(texto):
    if pd.isna(texto) or not texto: return "Sin Datos"
    n = len(str(texto).strip())
    if n < 50:   return "Buzón"
    if n < 200:  return "Muy Corta"
    if n < 500:  return "Corta"
    if n < 1500: return "Media"
    return "Larga"

def detectar_plan(texto):
    if pd.isna(texto) or not texto: return "Sin transcripción"
    tl = str(texto).lower()
    if re.search(r'(?:plan\s+)?manad[aá]', tl):  return "Plan Manada"
    if re.search(r'(?:plan\s+)?premium', tl):      return "Plan Premium"
    if re.search(r'mascota|perrit|gatit|perro|gato|veterinari', tl): return "Plan Mascotas"
    if re.search(r'salud|m[eé]dico\s+a\s+domicilio|pediatra|psic[oó]logo', tl): return "Plan Salud"
    if re.search(r'movilidad|gr[uú]a|veh[ií]cul|\bcarro\b|\bmoto\b', tl): return "Plan Movilidad"
    return "No identificado"

def detectar_resultado_llamada(texto):
    if pd.isna(texto) or not texto or len(str(texto).strip()) < 50: return "Sin Contacto"
    tl = str(texto).lower()
    if re.search(r'buz[oó]n\s+de\s+voz|deje\s+su\s+mensaje', tl):  return "Buzón de Voz"
    if re.search(r'n[uú]mero\s+equivocado|no\s+(?:lo\s+)?conozco', tl): return "Número Equivocado"
    if re.search(r'no\s+se\s+encuentra|est[aá]\s+ocupad', tl):      return "No Disponible"
    if re.search(r'procedemos|queda\s+activ|te\s+confirmo', tl):     return "Venta"
    if re.search(r'no\s+(?:me\s+)?interesa|no[\s,]+gracias', tl):   return "Rechazado"
    return "Contactado"

def detectar_saludo_completo(texto):
    if pd.isna(texto) or not texto: return "No"
    tl = str(texto).lower()
    n = sum([bool(re.search(r'tengo\s+el\s+gusto', tl)),
             bool(re.search(r'habl[aá]s?\s+con|soy\s+\w+\s+de', tl)),
             bool(re.search(r'tiene\s*soluciones', tl)),
             bool(re.search(r'registro\s+que\s+realizaste|me\s+estoy\s+comunic', tl))])
    return "Sí" if n >= 3 else ("Parcial" if n >= 1 else "No")

def detectar_ofrecio_whatsapp(texto):
    if pd.isna(texto) or not texto: return "No"
    return "Sí" if re.search(r'(?:env[ií]o|mando|dejo).*whatsapp|whatsapp.*(?:env[ií]o|mando)', str(texto).lower()) else "No"

def detectar_tipo_mascota(texto):
    if pd.isna(texto) or not texto: return "N/A"
    tl = str(texto).lower()
    if re.search(r'\bperr[oa]s?\b|\bcan[es]?\b|\bcachorr[oa]s?\b', tl): return "Perro"
    if re.search(r'\bgat[oa]s?\b|\bfelin[oa]s?\b|\bmichin\b', tl):      return "Gato"
    if re.search(r'\bconejo\b|\bhámster\b|\broedor\b', tl):              return "Roedor"
    if re.search(r'\bpájaro\b|\bave\b|\bperico\b|\bloro\b|\bcanario\b', tl): return "Ave"
    if re.search(r'\bmascota\b|\banimal\b', tl):                          return "Otra Mascota"
    return "N/A"

def detectar_tipo_vehiculo(texto):
    if pd.isna(texto) or not texto: return "N/A"
    tl = str(texto).lower()
    if re.search(r'\bmoto(?:cicleta)?\b|\bmotociclista\b', tl): return "Moto"
    if re.search(r'\bcarro\b|\bauto(?:m[oó]vil)?\b|\bveh[ií]culo\b|\bcamioneta\b|\bsed[aá]n\b', tl): return "Carro"
    if re.search(r'\bcami[oó]n\b|\bcarga\b|\bcamionero\b', tl): return "Camión"
    return "N/A"

def dividir_transcripcion_en_turnos(texto):
    """Convierte transcripción plana en turnos [Asesor]/[Cliente] alternos."""
    if pd.isna(texto) or not texto or len(str(texto).strip()) < 10:
        return None
    oraciones = re.split(r'(?<=[.!?])\s+', str(texto).strip())
    speakers = ["Asesor", "Cliente"]
    turnos = []
    idx = 0
    acumulado = []
    for oracion in oraciones:
        oracion = oracion.strip()
        if not oracion:
            continue
        acumulado.append(oracion)
        # Agrupar oraciones cortas para no fragmentar demasiado
        if sum(len(o) for o in acumulado) >= 40:
            turnos.append(f"[{speakers[idx % 2]}]: {' '.join(acumulado)}")
            idx += 1
            acumulado = []
    if acumulado:
        turnos.append(f"[{speakers[idx % 2]}]: {' '.join(acumulado)}")
    return "\n".join(turnos)

def procesar(df):
    df['Resultado_Llamada'] = df['transcripcion'].apply(detectar_resultado_llamada)
    df['Plan_Mencionado']   = df['transcripcion'].apply(detectar_plan)
    df['Duracion_Estimada'] = df['transcripcion'].apply(detectar_duracion_estimada)
    df['Saludo_Completo']   = df['transcripcion'].apply(detectar_saludo_completo)
    df['Ofrecio_WhatsApp']  = df['transcripcion'].apply(detectar_ofrecio_whatsapp)
    df['Motivo_Rechazo']    = df.apply(
        lambda r: ("No Interesa" if r['Resultado_Llamada'] == "Rechazado" else "N/A"), axis=1
    )
    df['Transcripcion_V4']  = df['transcripcion'].apply(dividir_transcripcion_en_turnos)
    df['Tipo_Mascota']      = df['transcripcion'].apply(detectar_tipo_mascota)
    df['Tipo_Vehiculo']     = df['transcripcion'].apply(detectar_tipo_vehiculo)
    return df


# ─── Subida a BigQuery ───────────────────────────────────────────────────────────

def sanitizar_columnas(df):
    df = df.copy()
    df.columns = [re.sub(r'[^\w]', '_', c).strip('_') for c in df.columns]
    return df

def subir_bigquery(df):
    client = bigquery.Client(project=BQ_PROJECT)
    tabla  = f"{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLA}"
    df = sanitizar_columnas(df)
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        autodetect=True,
    )
    job = client.load_table_from_dataframe(df, tabla, job_config=job_config)
    job.result()
    return len(df)


# ─── Pipeline ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    log("=" * 60)
    log("INICIO DE CARGA AUTOMÁTICA")
    log("=" * 60)

    try:
        log("Conectando a SQL Server con cuenta CUN (Windows Auth)...")
        df = cargar_desde_sql()
        log(f"Filas cargadas: {len(df):,}")

        log("Procesando transcripciones...")
        df = procesar(df)

        log("Subiendo a BigQuery...")
        n = subir_bigquery(df)
        log(f"COMPLETADO: {n:,} filas subidas a {BQ_TABLA}")

    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)

    log("=" * 60)