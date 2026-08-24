# CL Tiene Soluciones — Dashboard Analytics

Panel de análisis de llamadas de call center con inteligencia artificial, desarrollado por **DivergencyAI SAS**.

## Descripción

Dashboard web que procesa, analiza y visualiza el rendimiento de los asesores de call center de CL Tiene Soluciones. Incluye análisis automático con IA, transcripciones estructuradas y métricas en tiempo real.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 7 |
| Backend | Python 3.11 + FastAPI |
| Base de datos | Google BigQuery |
| IA / LLM | OpenAI `gpt-4o` — detección de hablantes (pipeline) y los 12 endpoints de IA/reportes. 2 API keys con balanceo + failover |
| Despliegue backend | Google Cloud Run + Cloud Build |
| Despliegue frontend | Firebase Hosting |
| Fuente de datos | FTP (audio) → CUN (STT + Ollama) → SQL Server → BigQuery |

## URLs de producción

| Servicio | URL |
|---------|-----|
| Frontend | https://cltiene-dashboard.web.app |
| Backend | https://cltiene-backend-293865702055.us-central1.run.app |

## Estructura del proyecto

```
CLTiene/
├── src/                        # Frontend React
│   ├── config.js               # URL base del backend (cambiar aquí para todos los fetch)
│   ├── styles/theme.js         # Tokens de diseño: colores, gradientes, sombras, botones IA
│   ├── utils/cleanHtml.js      # Limpia estilos oscuros del prompt_html() antes de renderizar
│   ├── pages/Dashboard.jsx     # Shell principal: sidebar + KPIs + navegación de tabs
│   ├── tabs/                   # Un componente por pestaña
│   │   ├── Resumen.jsx
│   │   ├── Rendimiento.jsx
│   │   ├── Analisis.jsx
│   │   ├── Inteligencia.jsx
│   │   ├── Transcripciones.jsx
│   │   └── Agente.jsx
│   ├── components/             # Gráficas, botones IA, UI reutilizable
│   │   ├── Select.jsx          # Excluye su propio filtro al cargar opciones
│   │   ├── AnalisisAu.jsx      # 8 tipos de análisis automático (Agente IA PRO)
│   │   ├── RankingIA.jsx       # Ranking de asesores + análisis comparativo completo
│   │   ├── ReporteCompleto.jsx # Reporte ejecutivo (comité) con descarga PDF
│   │   └── ui/InsightsCard.jsx # Insights rápidos del período
│   ├── FiltersContext.jsx      # Estado global de filtros (Context API)
│   └── layout/Sidebar.jsx      # Barra lateral con 11 filtros + botón "Borrar filtros"
│
├── back/                       # Backend FastAPI
│   ├── main.py                 # App principal
│   ├── api/
│   │   ├── routes.py           # ~50 endpoints GET /api/ y /ia/ con FilterModel
│   │   ├── routes_new.py       # Endpoints de rankings (también con FilterModel)
│   │   ├── models.py           # FilterModel — construye WHERE para BigQuery
│   │   ├── charts/             # Queries BigQuery por gráfica
│   │   ├── ia/                 # Módulos de IA — todos usan call() + prompt_html()
│   │   └── filters/            # Opciones de filtros del sidebar
│   ├── IA/Open_AI.py           # call(system, user) → (content, error)  |  prompt_html()
│   ├── helpers/utils.py        # Contextos de datos para IA (general, asesor, llamada, ranking)
│   ├── subir_datos.py          # Pipeline V4 autónomo: SQL Server → procesamiento → BigQuery
│   └── registrar_tarea.ps1     # Registra tarea automática en Windows (semanal)
│
├── informe_tecnico.html        # Informe técnico del proyecto (abrir en navegador → imprimir PDF)
├── cloudbuild.yaml             # Pipeline CI/CD — solo despliega el backend
└── firebase.json               # Configuración Firebase Hosting
```

## KPIs del dashboard

| KPI | Campo BigQuery | Descripción |
|-----|---------------|-------------|
| TOTAL LLAMADAS | `COUNT(*)` | Todas las llamadas en el período |
| LLAMADAS DE CALIDAD | `SUM(efectiva)` | `efectiva` = score de calidad ≥80% de la CUN (⚠️ NO es venta). Antes "Llamadas Efectivas" |
| POSIBLES VENTAS | `COUNT(Resultado_Llamada = 'Venta')` | Inferido por transcripción → **inflado** (fuente real pendiente: Zoho). Antes "Ventas Cerradas". Se oculta con filtro Servicio |
| HORA PICO | `moda (hora con más llamadas)` | Hora de mayor actividad. Excluye registros con `00:00:00` exacto (fecha sin hora) |
| DÍA PICO | `GROUP BY día` | Día con más llamadas |
| ASESOR TOP | `ORDER BY COUNT DESC` | Asesor con más llamadas |
| SALUDO OK | `AVG(saludo_inicial)` | % de llamadas con `saludo_inicial = 1` (dato CUN) |
| CALIDAD PROMEDIO | Promedio 7 métricas | Score 0–100 sobre las llamadas evaluadas (antes "Calidad Llamada IA") |
| TMO | `AVG(Tiempo de Conversacion)` | Tiempo hablado promedio (H:MM:SS) |
| PARTICIPACIÓN CLIENTE | % turnos del cliente en V4 | Si se deja hablar al cliente |

> **Nota:** `saludo_inicial` (CUN) y `Saludo_Completo` (pipeline) son campos distintos.
> El KPI y el embudo usan `saludo_inicial` para ser coherentes entre sí.

## Pestañas del dashboard

1. **Resumen Ejecutivo** — KPIs, embudo de conversión, distribución de resultados, insights IA
2. **Rendimiento Asesores** — Tabla de asesores con filtros, análisis IA individual por asesor
3. **Análisis Detallado** — Planes mencionados, motivos de rechazo, tipo de cliente + análisis IA de patrones
4. **Inteligencia Operativa** — Gráficas de horas/días/scorecard + análisis IA operativo
5. **Transcripciones** — Visor de llamadas con chat, historial de llamadas por teléfono del cliente, búsqueda/resaltado de palabras y análisis IA por llamada
6. **Agente IA PRO** — Chat + 8 análisis automáticos + ranking comparativo + reporte ejecutivo (comité) descargable en PDF
7. **Prueba de Saludos** — pestaña estática con el análisis A/B de 5 saludos comerciales (reporte puntual, no viene del pipeline)

## Embudo de conversión

| Paso | Campo BigQuery | Descripción |
|------|---------------|-------------|
| Total llamadas | `COUNT(*)` | Todas las llamadas |
| Conv > 30s | `Duracion_Estimada IN ('Muy Corta','Corta','Media','Larga')` | Conversaciones con duración real (no buzón) |
| Con Saludo | `saludo_inicial = 1.0` | Saludos detectados por la CUN |
| Contactado | `Resultado_Llamada IN ('Contactado','Rechazado','Venta')` | Se habló con la persona — misma partición que la gráfica "Contacto Efectivo" |
| Posibles ventas | `Resultado_Llamada = 'Venta'` | Ventas inferidas por transcripción (Ventas ⊂ Contactado). Oculto con filtro Servicio |

> El paso "Contactado" usa la **partición de Contacto Efectivo** (Contactado + Rechazado + Venta), coherente con la gráfica y el reporte. Antes usaba `efectiva` (score de calidad), que no descendía y confundía calidad con contacto.

## Módulos de IA disponibles

| Endpoint | Usado en | Descripción |
|----------|----------|-------------|
| `GET /ia/generar_insights` | Resumen | Insights rápidos del período |
| `GET /ia/analisis_automatico?tipo_analisis=X` | Agente IA PRO | 8 tipos de análisis profundo |
| `GET /ia/inteligencia_operativa` | Inteligencia | Patrones operativos de horas/días/rendimiento |
| `GET /ia/analizar_asesor?asesor=X` | Rendimiento | Diagnóstico individual con fortalezas y coaching |
| `GET /ia/analizar_llamada?llamada_id=X` | Transcripciones | Análisis de llamada específica: resumen, scorecard, coaching |
| `GET /ia/reporte_completo` | Agente IA PRO | Reporte ejecutivo (estructura de comité: tablero con semáforo, estatus, productividad, metas SMART) descargable en PDF |
| `GET /ia/analisis_ranking` | Agente IA PRO | Comparativo de TODOS los asesores con plan de mentoría |

> Todos los módulos usan `prompt_html()` → retornan HTML renderizable directamente.
> `call()` siempre retorna tupla `(content, error)` — siempre desempaquetar: `content, error = call(...)`.
> `call()` **balancea el consumo entre las 2 API keys (~50/50) y hace failover** si una topa cupo.
> Con el filtro **Tipo de Llamada = Servicio**, los reportes se adaptan (vía `contexto_tipo_llamada()`): la IA no habla de ventas/conversión y se enfoca en calidad de atención.
> `MAX_TOKENS` default: **4000** (configurable via variable de entorno en Cloud Run).
> El HTML de los resultados pasa por `src/utils/cleanHtml.js` para convertir fondos oscuros a claros.

## Tipos de análisis automático (Agente IA PRO)

| Tipo | `tipo_analisis` | Prompt objetivo |
|------|----------------|-----------------|
| Resumen Ejecutivo | `resumen_ejecutivo` | KPIs, tendencias, fortalezas, debilidades, recomendaciones |
| Oportunidades de Mejora | `oportunidades_mejora` | 10 oportunidades con impacto y prioridad |
| Análisis de Rechazos | `analisis_rechazos` | Distribución, patrones y estrategias para reducir rechazos |
| Mejores Prácticas | `mejores_practicas` | Benchmark de top performers y cómo replicarlo |
| Patrones de Ventas | `patrones_ventas` | Duración óptima, turnos ideales, perfil de llamada exitosa |
| Plan de Coaching | `plan_coaching` | Diagnóstico por asesor, ejercicios, cronograma 4 semanas |
| Recomendaciones Semanales | `recomendaciones_semanales` | 3 prioridades, métricas diarias, alertas |
| Predicción de Tendencias | `prediccion_tendencias` | Proyección del próximo mes, riesgos y acciones preventivas |

## Filtros del dashboard

Todos los endpoints aceptan `FilterModel` como query params. El componente `Select.jsx` excluye su propio filtro al consultar opciones, de modo que cambiar un valor siempre muestra todas las alternativas.

| Filtro en UI | Parámetro | Campo BigQuery |
|--------------|-----------|---------------|
| Fecha desde / hasta | `fecha_desde`, `fecha_hasta` | `Fecha` |
| Resultado de la Llamada | `resultado_llamada` | `Resultado_Llamada` |
| Plan Mencionado | `plan_mencionado` | `Plan_Mencionado` |
| Duración de la Llamada | `duracion_llamada` | `Duracion_Estimada` |
| Saludo del Asesor | `saludo_asesor` | `Saludo_Completo` |
| Nombre del Asesor | `nombre_asesor` | `Cuenta LIKE` |
| Módulo de Atención | `modulo_atencion` | `Nombre_del_Modulo` |
| Tipo de Llamada | `tipo_llamada` | `tipo` |
| Seguimiento de Llamada | `seguimiento_llamada` | `Tipo_Llamada` (Entrante / Saliente) |
| Asistencia Mencionada | `asistencia_mencionada` | `Asistencia LIKE '%valor%'` |
| Solo con transcripción | `transcripcion` | `transcripcion IS NOT NULL` |

> **Comportamiento especial — filtro Tipo de Llamada = "Servicio":** oculta automáticamente el KPI "Posibles ventas", el paso de posibles ventas del embudo, la columna "% Posibles ventas" en Rendimiento y la línea de posibles ventas en evolución temporal. Los títulos de las gráficas también se adaptan.

## Flujo de datos completo

El dato pasa por **dos procesos distintos** antes de llegar al dashboard: el de la **CUN** (upstream, no es nuestro) y el nuestro (**Pipeline V4**).

```
CL Tiene
  ├── FTP (SFTP): AUDIO de las llamadas, en carpetas por agente (ContactVox)
  └── Excel: metadata (Tiempo de Conversacion, agente, fecha)
        ↓
Código de la CUN (Juan Manuel) — notebook "Proceso llamadas CL Tiene.ipynb":
  · STT (audio → texto) con faster-whisper (modelo "medium")   ← aquí se pierden/entrecortan textos
  · cruce con el Excel por fecha + agente
  · Ollama qwen2.5 → 7 categorías de calidad + efectiva (score, no venta)
        ↓
SQL Server CUN (172.16.1.33)
        ↓  (Windows Auth — cuenta CUN)
```

### Pipeline V4 — `subir_datos.py` (nuestro)

```
subir_datos.py  ←  ejecución semanal (manual o programada) DENTRO de la red CUN
        ↓
Procesamiento V4:
  · estructurar_dialogos_ia()  → Transcripcion_V4 (turnos [Asesor]/[Cliente])
                                  con OpenAI gpt-4o + prompt v16 y cache incremental
  · detectar_plan()            → Plan_Mencionado
  · detectar_asistencia()      → Asistencia (catálogo 35+ servicios)
  · detectar_resultado_llamada() → Resultado_Llamada
  · detectar_motivo_rechazo()  → Motivo_Rechazo
  · detectar_duracion_estimada() → Duracion_Estimada (desde Tiempo de Conversación)
  · detectar_saludo_completo() → Saludo_Completo
  · detectar_ofrecio_whatsapp() → Ofrecio_WhatsApp
  · detectar_despedida_correcta() → Despedida_Correcta
  · contar_objeciones()        → Num_Objeciones
        ↓
BigQuery: desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas
        ↓
Backend FastAPI (Cloud Run) → Frontend React (Firebase Hosting)
```

- **Frecuencia:** semanal (la fuente se actualiza cada semana). Debe correr **dentro de la red privada de la CUN** (el SQL Server 172.16.1.33 no es accesible desde fuera).
- **Cache incremental:** al arrancar carga de BigQuery las transcripciones ya procesadas; solo pasa por OpenAI las nuevas/cambiadas. Costo típico: ~$3–7 por corrida con `gpt-4o` (solo las transcripciones nuevas de la semana).
- **Re-proceso completo:** `python subir_datos.py --full` (o env `REPROCESO_COMPLETO=1`) ignora el cache y vuelve a procesar TODAS las transcripciones con el prompt actual.
- **Modelo de detección de hablantes:** configurable con env `MODELO_HABLANTES` (default `gpt-4o`).
- ⚠️ **La separación [Asesor]/[Cliente] solo puede ser tan buena como el texto del STT.** Si el STT de la CUN llega deforme o entrecortado, ningún prompt lo recupera — eso es upstream (audio del FTP + config de faster-whisper).

## Campos calculados por el pipeline vs campos de la CUN

| Campo | Origen | Cómo se calcula |
|-------|--------|-----------------|
| `Transcripcion_V4` | Pipeline V4 | `estructurar_dialogos_ia()` — separación [Asesor]/[Cliente] con OpenAI `gpt-4o` + prompt v16 (con cache incremental; ya no usa regex) |
| `Resultado_Llamada` | Pipeline V4 | Regex sobre transcripción + conteo de turnos V4 |
| `Plan_Mencionado` | Pipeline V4 | Regex con catálogo de planes |
| `Asistencia` | Pipeline V4 | Catálogo de 35+ asistencias específicas |
| `Duracion_Estimada` | Pipeline V4 | `Tiempo de Conversación` (HH:MM:SS) del SQL Server |
| `Saludo_Completo` | Pipeline V4 | 3 de 4 frases clave detectadas (Sí / Parcial / No) |
| `Motivo_Rechazo` | Pipeline V4 | Basado en Resultado_Llamada = 'Rechazado' |
| `Tipo_Mascota` | Pipeline V4 | Regex (Perro / Gato / Ambos) — solo para Plan Mascotas |
| `Tipo_Vehiculo` | Pipeline V4 | Regex (Carro / Moto / Ambos) — solo para Plan Movilidad |
| `Explico_Beneficios` | Pipeline V4 | Regex sobre beneficios mencionados (Sí / Parcial / No) |
| `Ofrecio_WhatsApp` | Pipeline V4 | Regex sobre oferta de WhatsApp |
| `Despedida_Correcta` | Pipeline V4 | Regex sobre últimas 3 líneas de Transcripcion_V4 |
| `Num_Objeciones` | Pipeline V4 | Conteo de patrones de objeción del cliente |
| `Tipo_Llamada` | CUN | Campo directo del SQL Server (normalizado: Salientes → Saliente) |
| `efectiva` | CUN (Ollama) | ⚠️ **NO es venta.** Score de calidad: `sum(7 categorías)/7 ≥ 0.8`. Lo calcula Ollama `qwen2.5` en el proceso de la CUN |
| `saludo_inicial` | CUN (Ollama) | 0/1 — el LLM de la CUN detecta saludo/presentación (≠ `Saludo_Completo` del pipeline) |
| `palabras` | CUN | Conteo regex de palabras de la transcripción |
| `clasificacion` | CUN (TextBlob) | positivo/negativo/neutro por polaridad — ⚠️ 97.5% neutro, no se usa en gráficas |

### Categorías de duración (tiempo real de conversación)

| Categoría | Segundos | Duración |
|-----------|---------|----------|
| Buzón | ≤ 30 s | Menos de 30 segundos |
| Muy Corta | 31 – 60 s | 30 segundos a 1 minuto |
| Corta | 61 – 120 s | 1 a 2 minutos |
| Media | 121 – 300 s | 2 a 5 minutos |
| Larga | > 300 s | Más de 5 minutos |

> **Cambio desde V3:** antes se calculaba por longitud de texto de la transcripción. Ahora usa el campo `Tiempo  de Conversacion` (HH:MM:SS) del SQL Server para mayor precisión.

## Cambiar la URL del backend

La URL del backend está centralizada en `src/config.js`:

```js
export const API_BASE = "https://cltiene-backend-293865702055.us-central1.run.app";
```

Editar ese archivo es suficiente — todos los componentes la importan desde ahí.

## Despliegue

### Backend (Cloud Run)

```bash
cd back/
gcloud run deploy cltiene-backend \
  --source . \
  --region us-central1 \
  --project desarrollo-investigaciones \
  --quiet
```

### Frontend (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting:cltiene-dashboard
```

## Variables de entorno en Cloud Run

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_MUNDIAL` | API key de OpenAI (secret) — key 1 |
| `OPENAI_API_MUNDIAL_2` | Segunda API key (secret) — `call()` balancea el consumo ~50/50 y hace failover si una topa cupo |
| `GOOGLE_CLOUD_PROJECT` | ID del proyecto GCP |
| `MAX_TOKENS` | Máximo de tokens por respuesta IA (default: 4000) |
| `MODEL` | Modelo OpenAI para los endpoints de IA/reportes (default en código: gpt-4o-mini; **en producción está en `gpt-4o`**) |
| `MODELO_HABLANTES` | Modelo para separar [Asesor]/[Cliente] en el pipeline (default: gpt-4o) |

## Automatización de carga de datos

Para programar la carga automática desde un PC con sesión CUN activa:

```powershell
# Ejecutar una sola vez como Administrador
.\back\registrar_tarea.ps1
```

Crea una tarea en el Programador de Windows que corre `back/subir_datos.py` **semanalmente** (la fuente se actualiza cada semana). Los logs quedan en `back/subir_datos.log`. Vía preferida a futuro: **Airflow** dentro de la red CUN.

## Contacto

**DivergencyAI SAS** — contacto@divergencyai.com
