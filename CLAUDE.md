# CLTiene Dashboard — Contexto para Claude Code

> Este archivo se carga automáticamente en cada conversación. Mantenerlo actualizado al terminar cada sesión.

## Proyecto

Dashboard de análisis de llamadas de call center para **CL Tiene Soluciones** (Colombia).
Desarrollado por **DivergencyAI SAS**.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 7 → Firebase Hosting |
| Backend | Python 3.11 + FastAPI → Google Cloud Run |
| Base de datos | Google BigQuery |
| IA | OpenAI gpt-4o-mini (`OPENAI_API_MUNDIAL`) |

## URLs de producción

- **Frontend:** https://cltiene-dashboard.web.app
- **Backend:** `https://cltiene-backend-293865702055.us-central1.run.app`
  - Centralizado en `src/config.js` como `API_BASE`

## Flujo de datos completo (confirmado con Diego 2026-07-03)

```
CL Tiene
  ├── FTP: AUDIO de las llamadas (en carpetas por agente → por eso importa el nombre "agenteN")
  └── Excel: metadata (Tiempo de Conversacion, agente, fecha)
         │
         ▼
   Código de Juan Manuel (COE) — notebook `Proceso llamadas CL Tiene.ipynb`:
     1. EXTRACCIÓN: baja el audio del FTP y hace el STT (audio → texto)  ← el STT vive AQUÍ
     2. cruce con el Excel por fecha + agente
     3. EVALUACIÓN: Ollama qwen2.5 (7 categorías de calidad + efectiva)
         │
         ▼
   SQL Server (CUN, 172.16.1.33) → BigQuery (nuestro pipeline subir_datos.py) → Dashboard
```

- **El audio vive en un FTP** (de CL Tiene), en carpetas por agente. El **cruce** con el Excel es por **fecha + agente** (frágil → tema del martes / Airflow).
- **El STT (audio → texto) se hace DENTRO del código de Juan** con **`faster-whisper`** (modelo Whisper de OpenAI, local en GPU/CUDA), en la parte de "extracción" del notebook. NO es un servicio de un tercero. (La parte que revisamos, "evaluación de llamadas", es solo el Ollama de calidad.)
  - Fuente audio: **SFTP** `/u01/bk/ftp/telefonia/ContactVox_CLTIENE` (marcador **ContactVox**), recorrido por carpeta agente → año → fecha (por eso importa `agenteN`).
  - **Config actual del STT (verificada en el notebook 2026-07-03) — explica las transcripciones malas:**
    | Parámetro | Valor actual | Problema / mejora |
    |---|---|---|
    | `MODEL_NAME` | `"medium"` | Modelo mediano → palabras deformes. Subir a `large-v3` mejora mucho. |
    | `beam_size` | `1` | El más rápido pero menos preciso. Subir a `5`. |
    | `vad_filter` | `True` (min_silence 400ms) | **Recorta silencios/voz baja → causa probable de "se entrecortan".** Revisar/ajustar. |
- **Ahí es donde se pierden/entrecortan las transcripciones.** Dos causas, con responsables distintos:
  - **Audio malo/cortado en el FTP** → lo genera CL Tiene (grabación).
  - **STT débil (faster-whisper `medium` + `beam_size=1` + VAD agresivo)** → es config del código de Juan (COE); se puede mejorar.
  - Llamada muy corta → el STT solo capta el saludo (esperado).
- **Es el cuello de botella real y está upstream de nosotros.** La separación cliente/asesor (nuestra, con OpenAI) solo puede ser tan buena como el texto del STT — si llega mal, ningún prompt lo arregla.
- **Caso Edwin Cendales:** su carpeta de audio en el FTP se llama `ecendales` (no `agenteN`) y el código de Juan solo lee carpetas con la palabra "agente" → por eso no aparece. Lo corrige CL Tiene renombrando la carpeta.
- Nuestro pipeline V4 **solo separa cliente/asesor** (Transcripcion_V4); NO hace STT ni el cruce — eso es del lado de la CUN.

## BigQuery

- Tabla: `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
- `Fecha` es INTEGER en nanosegundos → `DATETIME(TIMESTAMP_MICROS(DIV(Fecha, 1000)))`
- `Resultado_Llamada = 'Venta'` (BigQuery es case-sensitive)
- `saludo_inicial` (CUN, 0/1) ≠ `Saludo_Completo` (pipeline, "Sí"/"Parcial"/"No")

## Columnas de la CUN — cómo se calculan (código de Heider/Juan Manuel, notebook `Proceso llamadas CL Tiene.ipynb`)

> Confirmado en reunión BD 2026-07-01. El proceso de la CUN es **independiente** de nuestro pipeline V4.

- **Motor:** Ollama local con modelo `qwen2.5:7b-instruct` (temperature 0). NO es GPT-4o-mini.
- **7 categorías de calidad (cada una 0/1)**, el LLM devuelve JSON con 1 si aparece claramente:
  `saludo_inicial`, `identificacion_cliente`, `comprension_problema`, `ofrecimiento_solucion`, `manejo_inquietudes`, `cierre_servicio`, `proximo_paso`
- **`efectiva` NO es venta.** Es score de calidad: `puntaje = sum(7 categorías)/7`; `efectiva = 1 if puntaje >= 0.8 else 0` (mínimo 6 de 7 categorías cumplidas).
  - ⚠️ NO usar `efectiva` como sinónimo de `Resultado_Llamada = 'Venta'`. Miden cosas distintas: `efectiva` = calidad del asesor; `Venta` = si hubo venta real (lo detecta nuestro pipeline).
- **`polarity`, `subjectivity`, `clasificacion`, `confianza`** → vienen de TextBlob/NaiveBayes, NO del LLM.
  - `clasificacion` = `positivo` si polarity≥0.1, `negativo` si ≤−0.1, `neutro` en medio.
- **`palabras`** = conteo regex `\b\w+\b` sobre la transcripción.
- **`Tiempo de Conversacion` sale del Excel que envía CL Tiene, NO se calcula del audio** → por eso puede no coincidir con la duración real de la transcripción. Juan Manuel solo cruza (join) ese Excel con la transcripción por fecha + agente.
- **Transcripciones entrecortadas** = llamadas de pocos segundos; el STT solo alcanza a capturar el saludo. Es esperado, no un bug.

### Hallazgos reunión 2026-07-01 (pendientes del lado CUN)
- **Edwin Cendales sin datos desde 3-feb:** su carpeta en el servidor se llama `ecendales` (su nombre), no `agenteN`. El algoritmo solo extrae carpetas con la palabra "agente". → **CL Tiene** (Sergio Nieto / admin del call center) debe renombrar todas las carpetas a `agenteN`. NO es tarea de la CUN/COE ni de DivergencyAI.
- **`Salientes` vs `Saliente`:** error de Juan Manuel, lo corregirá en la BD (dejar una sola nomenclatura).
- **`Agente` vs `Cuenta` truncado:** hay dos formatos de Excel (entrante/saliente) con estructura distinta; en uno la info viene truncada. Se alinea en reunión del martes.
- **Reunión martes 2026-07-07 9am** ("Revisión de procesos de llamadas"): objetivo = eliminar los Excel y automatizar con **Airflow** (lo desarrolla Santamaría). Diego agendado por Sofía.

## Arquitectura clave

```
FilterModel (back/api/models.py) → get_query() → WHERE clause BigQuery
buildQuery() (src/FiltersContext.jsx) → query params para fetch del frontend
```

Todos los endpoints de IA aceptan `FilterModel` como query params.

## Patrones de código establecidos

### Frontend — fetch con filtros
```js
const { buildQuery } = useFilters();
const params = buildQuery();
const query = params ? `?${params}` : '';
const response = await fetch(`${API_BASE}/ia/endpoint${query}`);
```

### Frontend — HTML de IA (limpiar colores oscuros antes de renderizar)
```js
const raw = result.result || '';
const limpio = raw
  .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
  .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
  .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0');
```

### Frontend — diseño CSS para resultados IA (estilo ReporteCompleto)
```jsx
// Tarjeta contenedora
<div style={{
  backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 40px',
  border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
}}>
  {/* Header con acento rosa */}
  <div style={{
    borderLeft: '5px solid #FC3276',
    background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
    borderRadius: '0 10px 10px 0',
    padding: '14px 20px', marginBottom: '28px',
  }}>
    <span style={{ fontSize: '18px', fontWeight: '700', color: '#FC3276' }}>
      🔍 Título del análisis
    </span>
  </div>
  {/* Cuerpo */}
  <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}
    dangerouslySetInnerHTML={{ __html: htmlLimpio }} />
</div>
```

### Frontend — botón IA estándar
```jsx
<button style={{
  padding: '14px 22px',
  background: cargando ? '#cbd5e0' : mostrar
    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
    : 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
  color: 'white', border: 'none', borderRadius: '12px',
  fontSize: '14px', fontWeight: '700', cursor: cargando ? 'not-allowed' : 'pointer',
}}>
  {cargando ? '⌛ Analizando...' : mostrar ? '✕ Ocultar' : '🧠 Analizar con IA'}
</button>
```

### Backend — siempre desempaquetar `call()`
```python
content, error = call(system_prompt, user_message)
if error: return {"error": error}
```

### Backend — adaptar reportes IA al filtro Servicio
`contexto_tipo_llamada(filters)` (en `helpers/utils.py`) devuelve una instrucción que se antepone al
system prompt. Cuando `tipo_llamada == 'servicio'` le dice a la IA que NO hable de ventas/conversión y
se enfoque en calidad de atención. Para cualquier otro caso devuelve `''` (sin cambios).
```python
from helpers.utils import get_data_context, contexto_tipo_llamada
content, error = call(
    prompt_html(contexto_tipo_llamada(filters) + "System prompt original..."),
    f"...\n{get_data_context(filters.get_query())}"
)
```
Aplicado en: `generar_insights`, `analisis_automatico`, `generar_reporte_completo`,
`analisis_comparativo_ranking`, `analizar_inteligencia_operativa`, `analizar_patrones_ventas`,
`analizar_patrones_dashboard`. El frontend (`esServicio = filters.tipo_llamada === 'servicio'`) ya
oculta columnas/pasos de ventas en Resumen, Rendimiento, Inteligencia, Embudo e IndicadoresTabla.

## Tabs del dashboard

| Tab | Archivo | Estado |
|-----|---------|--------|
| Resumen Ejecutivo | `src/tabs/Resumen.jsx` | ✅ |
| Rendimiento Asesores | `src/tabs/Rendimiento.jsx` | ✅ |
| Análisis Detallado | `src/tabs/Analisis.jsx` | ✅ |
| Inteligencia Operativa | `src/tabs/Inteligencia.jsx` | ✅ |
| Transcripciones | `src/tabs/Transcripciones.jsx` | ✅ |
| Agente IA PRO | `src/tabs/Agente.jsx` | ✅ |

## Endpoints IA

| Endpoint | Componente | Filtros conectados |
|----------|------------|-------------------|
| `GET /ia/generar_insights` | `InsightsCard.jsx` | ✅ |
| `GET /ia/inteligencia_operativa` | `Inteligencia.jsx` | ✅ |
| `GET /ia/analizar_asesor?asesor=X` | `Rendimiento.jsx` | ✅ |
| `GET /ia/analizar_llamada?llamada_id=X` | `MetricasGrid.jsx` | ✅ |
| `GET /ia/analisis_automatico?tipo_analisis=X` | `AnalisisAu.jsx` | revisar |
| `GET /ia/reporte_completo` | `ReporteCompleto.jsx` | revisar |
| `GET /ia/analisis_ranking` | `RankingIA.jsx` | revisar |

## Despliegue

```bash
# Backend
cd back/
gcloud run deploy cltiene-backend --source . --region us-central1 --project desarrollo-investigaciones --quiet

# Frontend
npm run build
firebase deploy --only hosting:cltiene-dashboard
```

## Fixes importantes ya aplicados

- `translate="no"` en `<html>` (evita barra de Google Translate que interfiere con React)
- `ErrorBoundary` en `App.jsx`
- `saludo_inicial` × 100 en `routes.py` (era 0.436% en vez de 43.6%)
- SALUDO OK filtra solo llamadas con transcripción (`kpi.py`)
- `hallazgos` en Reporte Completo debe ser array de strings (no objetos)
- `Resultado_Llamada = 'Venta'` (case-sensitive, verificado en BigQuery)
- Sidebar expande/contrae el contenido principal (estado en `Dashboard.jsx`)
- `Asistencia LIKE '%valor%'` en `utils.py` (antes usaba `LIKE 'valor%'`, fallaba si el item no era el primero en la lista separada por comas)
- `UNNEST(SPLIT(Asistencia, ', '))` en `asistencia_mencionada.py` para explotar valores múltiples del dropdown

## Cambios sesión 2026-06-19

### Pipeline V4 — `back/subir_datos.py`
- Integrado `estructurar_dialogo()` → genera `Transcripcion_V4` con turnos `[Asesor]` / `[Cliente]`
- Nuevo campo `Asistencia`: catálogo de 35+ servicios detectados por regex
- `detectar_duracion_estimada()` usa `Tiempo de Conversacion` (HH:MM:SS) en vez de longitud de texto
- `detectar_despedida_correcta()` analiza últimas 3 líneas de `Transcripcion_V4`
- 36,969 filas en BigQuery (`cltiene_llamadas_procesadas`)

### Frontend
- `IndicadoresTabla.jsx`: columna **Ventas** oculta cuando `tipo_llamada = 'servicio'` (mismo patrón `esServicio` que el resto del dashboard)
- `Dashboard.jsx`: **keep-alive ping** cada 9 min (evita cold start de Cloud Run mientras la pestaña está abierta) + **Page Visibility API** que muestra banner "Reconectando..." y recarga KPIs al volver a la pestaña tras 5+ min

---

## Cambios sesión 2026-06-23

### Pipeline — Detección de hablantes con OpenAI (`back/subir_datos.py`)
- **Reemplazado regex por OpenAI `gpt-4o-mini`** para separar `[Asesor]` / `[Cliente]` en `Transcripcion_V4`
- `estructurar_dialogos_ia()`: procesamiento async con `asyncio.gather`, 25–50 llamadas simultáneas
- `_PROMPT_HABLANTES` (v15): prompt con 15 ejemplos few-shot, señales inequívocas, REGLA CRÍTICA frase por frase
  - Pasa `[Tipo: saliente/entrante]` al prompt → resuelve ambigüedad del primer hablante
  - Detecta interjecciones cortas del cliente (`¿Cómo?`, `No, [corrección]`) dentro de bloques del asesor
  - Prohíbe inventar texto no presente en la transcripción
  - Maneja texto repetitivo por falla STT como un solo turno
- Fallback automático a regex si OpenAI falla
- **37,879 filas** en BigQuery (última actualización 2026-06-23)

### Cache incremental — `cargar_cache_bigquery()`
- Al arrancar, carga `{hash_md5(transcripcion): Transcripcion_V4}` de BigQuery
- Solo llama a OpenAI para transcripciones **nuevas o cambiadas**
- Costo: ~$20 primera vez → ~$0.50–1 en runs posteriores (solo registros nuevos)

### Soporte dos API keys — `.env`
```
OPENAI_API_MUNDIAL=sk-proj-...
OPENAI_API_MUNDIAL_2=sk-proj-...
```
- `_batch_ia()` rota entre ambas keys automáticamente
- Concurrencia: 25 por key → 50 total cuando hay dos keys activas
- Tiempo de run completo: ~65 min (1 key) → ~35 min (2 keys)

### Scripts de comparación (`back/`)
- `comparar_metodos.py`: compara regex vs OpenAI en muestra fija de 100 llamadas
  - Sección 1: acuerdo en primer hablante
  - Sección 2: acuerdo en `Resultado_Llamada` + ventas
  - Sección 3: concordancia vs BigQuery original (ground truth)
  - Sección 4: casos donde difieren (primeros 8)
- `muestra_fija.csv`: muestra fija de 100 llamadas para comparación reproducible
- Ejecutar: `$env:PYTHONIOENCODING="utf-8"; python comparar_metodos.py 100`

### Métricas del prompt v14 (muestra fija 100 llamadas)
| Métrica | Valor |
|---------|-------|
| Acuerdo hablantes (IA vs regex) | 60% |
| Acuerdo efectividad | 80% |
| Ventas detectadas | 100% ✅ |
| IA vs BigQuery | 76% |

> El 40% de "desacuerdo" en hablantes es en su mayoría **IA más correcta** que regex
> (regex asignaba Asesor en llamadas salientes donde el cliente contesta primero)

---

## TAREAS PENDIENTES

### Sesión 2026-06-19
- ✅ `Rendimiento.jsx`: `analizar_asesor` ahora pasa filtros del sidebar con `buildQuery()`
- ✅ `Rendimiento.jsx`: `estiloBadge` corregido
- ✅ Creado `CLAUDE.md`

### Sesión 2026-06-23
- ✅ Detección de hablantes reemplazada por OpenAI (prompt v14)
- ✅ Cache incremental implementado
- ✅ Soporte dos API keys con rotación automática
- ✅ Script `comparar_metodos.py` + `muestra_fija.csv`
- ✅ 37,879 filas actualizadas en BigQuery

### Sesión 2026-06-25
- ✅ Prompt v15: regla "CLIENTE nunca se llama a sí mismo por nombre" + ejemplo `Correcto, señora Rosalía → ASESOR`
- ✅ `metricas.py`: añade **Duración Real** (`Tiempo__de_Conversacion` HH:MM:SS) + **Turnos** (REGEXP desde V4) + ORDER BY
- ✅ Sincronización IDs: `llamadas.py`, `metricas.py`, `get_llamada_context` usan mismo WHERE → ROW_NUMBER coincide
- ✅ Dropdown `llamadas.py`: fecha + resultado + asesor + teléfono (en vez de `#id`)
- ✅ `llamada.py`: retorna `info.telefono` (campo real `Telefono` de SQL Server, no `Cuenta`)
- ✅ Nuevo `historial_telefono.py`: endpoint `/api/transcripcion/historial/{telefono}` con IDs globales
- ✅ `FiltrosLateral.jsx`: historial dinámico al seleccionar llamada o escribir teléfono; clic carga transcripción
- ✅ Creados `informe_sesion_2026-06-25.html` + `informe_tecnico.html` (v3.0 con secciones 10 y 11)

### Backlog
- [ ] **Re-procesar BigQuery con `--full`** (prompt v16 + `gpt-4o`) — LISTO PARA CORRER, esperando OK del usuario
  - Prompt **v16** aplicado (`subir_datos.py`): regla del vocativo como REGLA #1 al inicio ("el cliente jamás dice un nombre propio como vocativo → siempre ASESOR").
  - Modelo configurable: `MODELO_HABLANTES` (default **`gpt-4o`**; override a `gpt-4o-mini`). El pipeline diario y `--full` usan `gpt-4o`.
  - Flag `--full` (o env `REPROCESO_COMPLETO=1`) ignora el cache y reprocesa las ~38k con el prompt actual.
  - **Validación (banco de pruebas aislado, sin tocar prod):** `gpt-4o`+v16 = ~2% error de atribución vs `mini`+v15 (prod) = ~7%, sobre 85 transcripciones aleatorias. En 5 casos difíciles: 0 fallos en 14 corridas.
  - Costo estimado re-proceso completo con `gpt-4o`: **~$300** (una vez). Antes de correr: **backup de la tabla BigQuery**.
- ✅ Validado que `AnalisisAu`, `RankingIA`, `ReporteCompleto` (Agente IA PRO) pasan filtros sidebar (frontend `buildQuery()` → backend `FilterModel` → `filters.get_query()`; verificado en prod: reporte con filtro fecha 2026-06-16 mostró 245 llamadas, no los ~38k)
- ✅ Separar métricas Ventas vs Servicio en reportes (dashboard vía `esServicio` + reportes IA vía `contexto_tipo_llamada()` — ver patrón abajo)
- [ ] Pipeline V4: registrar tarea automática en PC con sesión CUN
- ✅ Aclarado qué mide `efectiva` vs `Resultado_Llamada = 'Venta'` (reunión BD 2026-07-01 — ver sección "Columnas de la CUN")

### Reunión pendiente 2026-07-07 (martes 9am — "Revisión de procesos de llamadas")
- [ ] Migración a Airflow: eliminar Excel intermedios, automatizar el proceso (lo desarrolla Santamaría)
- [ ] CL Tiene: renombrar carpetas de agentes a formato `agenteN` (caso Edwin Cendales sin datos desde 3-feb)
- [ ] CUN/Juan Manuel: corregir nomenclatura `Salientes` → `Saliente` en la BD
- [ ] Alinear formatos de Excel (entrante/saliente traen `Agente`/`Cuenta` con estructura distinta)
- [ ] **Calidad del STT (voz a texto) de la CUN** — tema aparte de la separación de hablantes
- [ ] **Duplicados en la tabla origen `coe.CLTIENE_LLAMADAS`** (verificado 2026-07-03): ~**5.321 filas (~10%)** son el **mismo audio cargado más de una vez** (misma `fecha+cuenta+telefono+transcripcion+archivo`). Inflaban los conteos del dashboard ~10%. El proceso de carga de la CUN debería **insertar con deduplicación** (Airflow). Nosotros ya blindamos el dashboard con dedup en `subir_datos.py` (ver abajo), pero la raíz está en la carga.
  - Nota: `IDENTIFICACION` NO es clave de fila — es el documento del agente (solo ~13 distintos) y tiene formato inconsistente (`...053.0` float vs `...053` int).

## Deduplicación en el pipeline (`subir_datos.py`, sesión 2026-07-03)
- `cargar_desde_sql()` aplica `drop_duplicates(subset=[Fecha, Cuenta, Telefono, transcripcion, archivo])` tras leer de SQL Server.
- **`archivo` es clave**: sin él se borraban por error llamadas distintas sin transcripción que comparten `fecha+cuenta+telefono` (el dedup de 4 columnas quitaba 7.863 en vez de 5.321). Con `archivo` solo se quitan audios idénticos repetidos.
- Loguea cuántos duplicados quitó en cada corrida.

## Dos tipos de error en las transcripciones (NO confundir)

Al revisar el ChatVisor pueden aparecer dos problemas distintos con causas y soluciones diferentes:

1. **Error de ATRIBUCIÓN de hablante** (quién habla) → lo genera nuestro pipeline con OpenAI.
   - Ejemplo: `[CLIENTE]: Correcto, señora Rosalía.` cuando debería ser `[ASESOR]` (el cliente no se dirige a sí mismo por su nombre).
   - **Solución:** prompt v16 (regla del vocativo como REGLA #1 en `_PROMPT_HABLANTES`) + modelo `gpt-4o`. Se corrige al **re-procesar BigQuery con `--full`**. Nota: incluso `gpt-4o`+v16 falla ~2% en llamadas con STT muy deforme (no es 100%).

2. **Error de STT (voz a texto)** (qué palabras) → lo genera el motor de transcripción de la CUN, upstream.
   - Ejemplos: "Celetines Aluciones"/"usted le tiene soluciones" → "CL Tiene Soluciones"; "Rodalia"/"DSLTN" → nombres deformados; "mi feliz tía" → "un feliz día".
   - **NO se corrige con ningún prompt** (el texto de origen ya viene deformado). Depende de mejorar el STT en la CUN → **tema para la reunión del martes**.

> Antes de reportar una transcripción "mal", distinguir cuál de los dos es: si quién habla está bien pero las palabras están deformes → es STT (no nuestro). Si quién habla está intercambiado → es atribución (v15).
