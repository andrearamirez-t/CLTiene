"""
Compara detección de hablantes: Regex vs OpenAI vs Groq.
Uso: python comparar_metodos.py [N_MUESTRAS]
     python comparar_metodos.py 100
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

import re
import asyncio
import pandas as pd
import io
import openai
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from google.cloud import bigquery
from subir_datos import (
    estructurar_dialogo,
    estructurar_dialogos_ia,
    detectar_resultado_llamada,
    _PROMPT_HABLANTES,
    BQ_PROJECT, BQ_DATASET, BQ_TABLA,
)

N = int(sys.argv[1]) if len(sys.argv) > 1 else 50
MUESTRA_CSV = os.path.join(os.path.dirname(__file__), "muestra_fija.csv")
GROQ_MODEL  = "llama-3.3-70b-versatile"


# ─── Muestra ─────────────────────────────────────────────────────────────────

def cargar_muestra(n):
    if os.path.exists(MUESTRA_CSV):
        df = pd.read_csv(MUESTRA_CSV, encoding='utf-8-sig')
        print(f"  (muestra fija cargada desde {MUESTRA_CSV})")
        return df.head(n)
    client = bigquery.Client(project=BQ_PROJECT)
    query = f"""
        SELECT transcripcion, efectiva, Resultado_Llamada AS resultado_original, Tipo_Llamada
        FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLA}`
        WHERE transcripcion IS NOT NULL AND LENGTH(transcripcion) > 100
        ORDER BY RAND()
        LIMIT {n}
    """
    df = client.query(query).to_dataframe()
    df.to_csv(MUESTRA_CSV, index=False, encoding='utf-8-sig')
    print(f"  (muestra nueva guardada en {MUESTRA_CSV})")
    return df


# ─── Groq async ──────────────────────────────────────────────────────────────

async def _groq_async(texto, client, sem, tipo='saliente'):
    if pd.isna(texto) or not texto or len(str(texto).strip()) < 10:
        return None
    texto = str(texto).strip()
    tipo_str = str(tipo).lower() if pd.notna(tipo) else 'saliente'
    user_content = f"[Tipo: {tipo_str}]\n{texto[:3000]}"
    async with sem:
        try:
            resp = await client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": _PROMPT_HABLANTES},
                    {"role": "user",   "content": user_content},
                ],
                temperature=0,
                max_tokens=2000,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return estructurar_dialogo(texto)  # fallback a regex


async def _batch_groq(textos, tipos=None, concurrencia=10):
    api_key = os.getenv("GROQ_API_KEY")
    client  = openai.AsyncOpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    sem     = asyncio.Semaphore(concurrencia)
    if tipos is None:
        tipos = ['saliente'] * len(textos)
    tasks = [_groq_async(t, client, sem, tp) for t, tp in zip(textos, tipos)]
    return await asyncio.gather(*tasks)


def estructurar_dialogos_groq(textos, tipos=None):
    return asyncio.run(_batch_groq(list(textos), tipos=list(tipos) if tipos is not None else None))


# ─── Helpers ─────────────────────────────────────────────────────────────────

def primer_hablante(v4):
    if not v4:
        return None
    m = re.match(r'\[(Asesor|Cliente)\]', str(v4).strip())
    return m.group(1) if m else None


def acuerdo(a, b, df):
    return (df[a] == df[b]).sum()


def imprimir_metrica(label, col, n, df):
    asesor = (df[col] == 'Asesor').sum()
    print(f"  {label:<8} → primer hablante = Asesor : {asesor:>3}/{n}  ({asesor/n*100:5.1f}%)")


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    sep  = "=" * 66
    line = "─" * 66

    print(f"\n{sep}")
    print(f"  COMPARACIÓN: Regex vs OpenAI vs Groq ({GROQ_MODEL})  —  {N} llamadas")
    print(f"{sep}\n")

    print("Cargando muestra...")
    df = cargar_muestra(N)
    print(f"  {len(df)} llamadas cargadas\n")

    tipos = df['Tipo_Llamada'] if 'Tipo_Llamada' in df.columns else None

    print("Aplicando Regex...")
    df['v4_regex'] = df['transcripcion'].apply(estructurar_dialogo)

    print("Aplicando OpenAI (async, hasta 50 simultáneas)...")
    df['v4_ia'] = estructurar_dialogos_ia(df['transcripcion'], tipos)

    print(f"Aplicando Groq / {GROQ_MODEL} (async, 10 simultáneas)...")
    df['v4_groq'] = estructurar_dialogos_groq(df['transcripcion'], tipos)
    print()

    for col, v4_col in [('resultado_regex','v4_regex'), ('resultado_ia','v4_ia'), ('resultado_groq','v4_groq')]:
        df[col] = df.apply(lambda r: detectar_resultado_llamada(r['transcripcion'], r[v4_col] or ''), axis=1)

    df['primer_regex'] = df['v4_regex'].apply(primer_hablante)
    df['primer_ia']    = df['v4_ia'].apply(primer_hablante)
    df['primer_groq']  = df['v4_groq'].apply(primer_hablante)

    n = len(df)

    # ── 1. Hablantes ─────────────────────────────────────────────────
    print(f"{line}")
    print("  1. DETECCIÓN DE HABLANTES (primer hablante)")
    print(f"{line}")
    imprimir_metrica("Regex",  'primer_regex', n, df)
    imprimir_metrica("OpenAI", 'primer_ia',    n, df)
    imprimir_metrica("Groq",   'primer_groq',  n, df)
    print()
    ac_re_ia   = acuerdo('primer_regex', 'primer_ia',   df)
    ac_re_groq = acuerdo('primer_regex', 'primer_groq', df)
    ac_ia_groq = acuerdo('primer_ia',   'primer_groq',  df)
    print(f"  Acuerdo Regex  ↔ OpenAI : {ac_re_ia:>3}/{n}  ({ac_re_ia/n*100:5.1f}%)")
    print(f"  Acuerdo Regex  ↔ Groq   : {ac_re_groq:>3}/{n}  ({ac_re_groq/n*100:5.1f}%)")
    print(f"  Acuerdo OpenAI ↔ Groq   : {ac_ia_groq:>3}/{n}  ({ac_ia_groq/n*100:5.1f}%)")

    # ── 2. Efectividad ───────────────────────────────────────────────
    print(f"\n{line}")
    print("  2. EFECTIVIDAD (Resultado_Llamada)")
    print(f"{line}")
    for label, col in [("Regex", "resultado_regex"), ("OpenAI", "resultado_ia"), ("Groq", "resultado_groq")]:
        v = (df[col] == 'Venta').sum()
        print(f"  {label:<8} → Ventas : {v:>3}/{n}  ({v/n*100:5.1f}%)")

    if 'resultado_original' in df.columns:
        print(f"\n  BigQuery original:")
        for val, cnt in df['resultado_original'].value_counts().items():
            print(f"    {val:<22}: {cnt:>3}  ({cnt/n*100:5.1f}%)")

    # ── 3. Concordancia vs BigQuery ──────────────────────────────────
    if 'resultado_original' in df.columns:
        print(f"\n{line}")
        print("  3. CONCORDANCIA VS BIGQUERY ORIGINAL")
        print(f"{line}")
        orig = df['resultado_original']
        for label, col in [("Regex", "resultado_regex"), ("OpenAI", "resultado_ia"), ("Groq", "resultado_groq")]:
            ok = (df[col] == orig).sum()
            print(f"  {label:<8} coincide con BigQuery : {ok:>3}/{n}  ({ok/n*100:5.1f}%)")

        print(f"\n  Desglose por categoría:")
        for cat in orig.value_counts().index:
            mask = orig == cat
            cnt  = mask.sum()
            rg   = (df['resultado_regex'][mask] == cat).sum()
            ia   = (df['resultado_ia'][mask]    == cat).sum()
            gr   = (df['resultado_groq'][mask]  == cat).sum()
            print(f"    {cat:<20}: {cnt:>3} filas  |  Regex {rg}/{cnt} ({rg/cnt*100:.0f}%)  |  OpenAI {ia}/{cnt} ({ia/cnt*100:.0f}%)  |  Groq {gr}/{cnt} ({gr/cnt*100:.0f}%)")

    # ── 4. Casos donde difieren los 3 ────────────────────────────────
    print(f"\n{line}")
    print("  4. CASOS DONDE LOS 3 DIFIEREN (primeros 6)")
    print(f"{line}")
    mask_dif = (df['primer_regex'] != df['primer_ia']) | (df['primer_ia'] != df['primer_groq'])
    difieren = df[mask_dif].head(6)
    if difieren.empty:
        print("  ¡Todos coinciden!")
    else:
        for idx, (_, row) in enumerate(difieren.iterrows(), 1):
            print(f"\n  [{idx}] Regex={row['primer_regex']}  OpenAI={row['primer_ia']}  Groq={row['primer_groq']}")
            print(f"       Resultado: Regex={row['resultado_regex']}  OpenAI={row['resultado_ia']}  Groq={row['resultado_groq']}")
            print(f"       Regex : {str(row['v4_regex'])[:150]}")
            print(f"       OpenAI: {str(row['v4_ia'])[:150]}")
            print(f"       Groq  : {str(row['v4_groq'])[:150]}")

    # ── CSV ───────────────────────────────────────────────────────────
    out = os.path.join(os.path.dirname(__file__), "comparacion_metodos.csv")
    df[['transcripcion','Tipo_Llamada',
        'primer_regex','primer_ia','primer_groq',
        'resultado_regex','resultado_ia','resultado_groq',
        'resultado_original']].to_csv(out, index=False, encoding='utf-8-sig')
    print(f"\n  Detalle guardado en: comparacion_metodos.csv")
    print(f"\n{sep}\n")


if __name__ == '__main__':
    main()
