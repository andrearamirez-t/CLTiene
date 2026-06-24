"""
Compara detección de hablantes (Regex vs OpenAI) y precisión de efectividad.
Uso: python back/comparar_metodos.py [N_MUESTRAS]
     python back/comparar_metodos.py 100
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

import re
import pandas as pd
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from google.cloud import bigquery
from subir_datos import (
    estructurar_dialogo,
    estructurar_dialogos_ia,
    detectar_resultado_llamada,
    BQ_PROJECT, BQ_DATASET, BQ_TABLA,
)

N = int(sys.argv[1]) if len(sys.argv) > 1 else 50


MUESTRA_CSV = os.path.join(os.path.dirname(__file__), "muestra_fija.csv")

def cargar_muestra(n):
    # Reutiliza muestra fija si existe, para medir mejoras reales entre corridas
    if os.path.exists(MUESTRA_CSV):
        df = pd.read_csv(MUESTRA_CSV, encoding='utf-8-sig')
        print(f"  (muestra fija cargada desde {MUESTRA_CSV})")
        return df.head(n)
    client = bigquery.Client(project=BQ_PROJECT)
    query = f"""
        SELECT transcripcion, efectiva, Resultado_Llamada AS resultado_original, Tipo_Llamada
        FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLA}`
        WHERE transcripcion IS NOT NULL
          AND LENGTH(transcripcion) > 100
        ORDER BY RAND()
        LIMIT {n}
    """
    df = client.query(query).to_dataframe()
    df.to_csv(MUESTRA_CSV, index=False, encoding='utf-8-sig')
    print(f"  (muestra nueva guardada en {MUESTRA_CSV})")
    return df


def primer_hablante(v4):
    if not v4:
        return None
    m = re.match(r'\[(Asesor|Cliente)\]', str(v4).strip())
    return m.group(1) if m else None


def main():
    sep = "=" * 62

    print(f"\n{sep}")
    print(f"  COMPARACIÓN: Regex vs OpenAI  —  {N} llamadas")
    print(f"{sep}\n")

    print("Cargando muestra de BigQuery...")
    df = cargar_muestra(N)
    print(f"  {len(df)} llamadas cargadas\n")

    print("Aplicando regex...")
    df['v4_regex'] = df['transcripcion'].apply(estructurar_dialogo)

    print("Aplicando OpenAI (async, 25 simultáneas)...")
    tipos = df['Tipo_Llamada'] if 'Tipo_Llamada' in df.columns else None
    df['v4_ia'] = estructurar_dialogos_ia(df['transcripcion'], tipos)
    print()

    df['resultado_regex'] = df.apply(
        lambda r: detectar_resultado_llamada(r['transcripcion'], r['v4_regex'] or ''), axis=1)
    df['resultado_ia'] = df.apply(
        lambda r: detectar_resultado_llamada(r['transcripcion'], r['v4_ia'] or ''), axis=1)

    df['primer_regex']       = df['v4_regex'].apply(primer_hablante)
    df['primer_ia']          = df['v4_ia'].apply(primer_hablante)
    df['acuerdan_hablante']  = df['primer_regex'] == df['primer_ia']
    df['acuerdan_resultado'] = df['resultado_regex'] == df['resultado_ia']

    n = len(df)
    line = "─" * 62

    # ── Sección 1: Hablantes ──────────────────────────────────────
    print(f"{line}")
    print("  1. DETECCIÓN DE HABLANTES (primer hablante de la llamada)")
    print(f"{line}")

    regex_asesor  = (df['primer_regex'] == 'Asesor').sum()
    ia_asesor     = (df['primer_ia']    == 'Asesor').sum()
    acuerdo_hab   = df['acuerdan_hablante'].sum()
    desacuerdo    = n - acuerdo_hab

    print(f"  Regex  → primer hablante = Asesor : {regex_asesor:>3}/{n}  ({regex_asesor/n*100:5.1f}%)")
    print(f"  OpenAI → primer hablante = Asesor : {ia_asesor:>3}/{n}  ({ia_asesor/n*100:5.1f}%)")
    print(f"  Acuerdo entre métodos              : {acuerdo_hab:>3}/{n}  ({acuerdo_hab/n*100:5.1f}%)")
    print(f"  Desacuerdo (regex probablemente mal): {desacuerdo:>3}/{n}  ({desacuerdo/n*100:5.1f}%)")

    # ── Sección 2: Efectividad ────────────────────────────────────
    print(f"\n{line}")
    print("  2. EFECTIVIDAD  (Resultado_Llamada)")
    print(f"{line}")

    ventas_regex = (df['resultado_regex'] == 'Venta').sum()
    ventas_ia    = (df['resultado_ia']    == 'Venta').sum()
    acuerdo_res  = df['acuerdan_resultado'].sum()

    print(f"  Regex  → Ventas detectadas : {ventas_regex:>3}/{n}  ({ventas_regex/n*100:5.1f}%)")
    print(f"  OpenAI → Ventas detectadas : {ventas_ia:>3}/{n}  ({ventas_ia/n*100:5.1f}%)")
    print(f"  Acuerdo entre métodos      : {acuerdo_res:>3}/{n}  ({acuerdo_res/n*100:5.1f}%)")

    if 'resultado_original' in df.columns:
        ventas_orig = (df['resultado_original'] == 'Venta').sum()
        print(f"\n  Resultado_Llamada original (BigQuery) :")
        for val, cnt in df['resultado_original'].value_counts().items():
            print(f"    {val:<25}: {cnt:>3}  ({cnt/n*100:5.1f}%)")

    if 'efectiva' in df.columns:
        ef = df['efectiva'].fillna(0).astype(int).sum()
        print(f"\n  Campo 'efectiva' original (SQL Server) : {ef}/{n}  ({ef/n*100:.1f}%)")

    # ── Sección 3: Concordancia vs BigQuery original ──────────────
    if 'resultado_original' in df.columns:
        print(f"\n{line}")
        print("  3. CONCORDANCIA VS BIGQUERY ORIGINAL (ground truth)")
        print(f"{line}")

        orig = df['resultado_original']
        r_regex = df['resultado_regex']
        r_ia    = df['resultado_ia']

        # Acuerdo global
        reg_ok = (r_regex == orig).sum()
        ia_ok  = (r_ia    == orig).sum()
        print(f"  Regex  coincide con BigQuery : {reg_ok:>3}/{n}  ({reg_ok/n*100:5.1f}%)")
        print(f"  OpenAI coincide con BigQuery : {ia_ok:>3}/{n}  ({ia_ok/n*100:5.1f}%)")

        # Ventaja
        regex_gana = ((r_regex == orig) & (r_ia != orig)).sum()
        ia_gana    = ((r_ia    == orig) & (r_regex != orig)).sum()
        ambos_mal  = ((r_regex != orig) & (r_ia != orig)).sum()
        ambos_bien = ((r_regex == orig) & (r_ia == orig)).sum()
        print(f"\n  Ambos correctos            : {ambos_bien:>3}/{n}  ({ambos_bien/n*100:5.1f}%)")
        print(f"  Solo Regex correcto        : {regex_gana:>3}/{n}  ({regex_gana/n*100:5.1f}%)")
        print(f"  Solo OpenAI correcto       : {ia_gana:>3}/{n}  ({ia_gana/n*100:5.1f}%)")
        print(f"  Ambos incorrectos          : {ambos_mal:>3}/{n}  ({ambos_mal/n*100:5.1f}%)")

        # Desglose por categoría
        print(f"\n  Desglose por categoría (BigQuery original):")
        for cat in orig.value_counts().index:
            mask = orig == cat
            cnt  = mask.sum()
            rg   = (r_regex[mask] == cat).sum()
            ia   = (r_ia[mask]    == cat).sum()
            print(f"    {cat:<20}: {cnt:>3} filas  |  Regex {rg}/{cnt} ({rg/cnt*100:.0f}%)  |  IA {ia}/{cnt} ({ia/cnt*100:.0f}%)")

    # ── Sección 4: Casos donde difieren ──────────────────────────
    print(f"\n{line}")
    print("  4. CASOS DONDE DIFIEREN (primeros 8)")
    print(f"{line}")

    difieren = df[~df['acuerdan_hablante'] | ~df['acuerdan_resultado']].head(8)
    if difieren.empty:
        print("  ¡Ambos métodos coinciden en todos los casos!")
    else:
        for idx, (_, row) in enumerate(difieren.iterrows(), 1):
            print(f"\n  [{idx}] Primer hablante — Regex: {row['primer_regex']}  |  IA: {row['primer_ia']}")
            print(f"       Resultado       — Regex: {row['resultado_regex']}  |  IA: {row['resultado_ia']}")
            if row['v4_regex']:
                print(f"       Regex : {str(row['v4_regex'])[:180]}")
            if row['v4_ia']:
                print(f"       IA    : {str(row['v4_ia'])[:180]}")

    # ── CSV ───────────────────────────────────────────────────────
    out = os.path.join(os.path.dirname(__file__), "comparacion_metodos.csv")
    df[[
        'transcripcion', 'Tipo_Llamada',
        'primer_regex', 'primer_ia', 'acuerdan_hablante',
        'resultado_regex', 'resultado_ia', 'acuerdan_resultado',
        'resultado_original',
    ]].to_csv(out, index=False, encoding='utf-8-sig')

    print(f"\n  Detalle completo guardado en: comparacion_metodos.csv")
    print(f"\n{sep}\n")


if __name__ == '__main__':
    main()
