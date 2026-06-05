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
| IA / LLM | OpenAI (gpt-4o-mini) |
| Despliegue backend | Google Cloud Run + Cloud Build |
| Despliegue frontend | Firebase Hosting |
| Fuente de datos | SQL Server (CUN) → BigQuery |

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
│   │   ├── AnalisisAu.jsx      # 8 tipos de análisis automático (Agente IA PRO)
│   │   ├── RankingIA.jsx       # Ranking de asesores + análisis comparativo completo
│   │   ├── ReporteCompleto.jsx # Reporte ejecutivo en 9 secciones con descarga PDF
│   │   └── ui/InsightsCard.jsx # Insights rápidos del período
│   ├── FiltersContext.jsx      # Estado global de filtros (Context API)
│   └── layout/Sidebar.jsx      # Barra lateral de filtros
│
├── back/                       # Backend FastAPI
│   ├── main.py                 # App principal
│   ├── api/
│   │   ├── routes.py           # ~50 endpoints GET /api/ y /ia/ con FilterModel
│   │   ├── routes_new.py       # Endpoints de rankings (también con FilterModel)
│   │   ├── models.py           # FilterModel — construye WHERE para BigQuery
│   │   ├── charts/             # Queries BigQuery por gráfica
│   │   ├── ia/                 # Módulos de IA — todos usan call() + prompt_html()
│   │   ├── filters/            # Opciones de filtros del sidebar
│   │   └── upload/             # Pipeline SQL Server → BigQuery (solo local)
│   ├── IA/Open_AI.py           # call(system, user) → (content, error)  |  prompt_html()
│   ├── helpers/utils.py        # Contextos de datos para IA (general, asesor, llamada, ranking)
│   ├── subir_datos.py          # Script autónomo de carga de datos
│   └── registrar_tarea.ps1     # Registra tarea automática en Windows
│
├── cloudbuild.yaml             # Pipeline CI/CD — solo despliega el backend
└── firebase.json               # Configuración Firebase Hosting
```

## KPIs del dashboard

| KPI | Campo BigQuery | Descripción |
|-----|---------------|-------------|
| TOTAL LLAMADAS | `COUNT(*)` | Todas las llamadas en el período |
| LLAMADAS EFECTIVAS | `SUM(efectiva)` | Campo `efectiva` de la CUN (0 o 1) |
| VENTAS CERRADAS | `COUNT(Resultado_Llamada = 'Venta')` | Ventas detectadas por transcripción |
| HORA PICO | `AVG(timestamp)` | Hora promedio de mayor actividad |
| DÍA PICO | `GROUP BY día` | Día con más llamadas |
| ASESOR TOP | `ORDER BY COUNT DESC` | Asesor con más llamadas |
| SALUDO OK | `AVG(saludo_inicial)` | % de llamadas con `saludo_inicial = 1` (dato CUN) |
| CALIDAD LLAMADA IA | Promedio 7 métricas | Score 0–100 calculado sobre métricas de calidad |

> **Nota:** `saludo_inicial` (CUN) y `Saludo_Completo` (pipeline) son campos distintos.
> El KPI y el embudo usan `saludo_inicial` para ser coherentes entre sí.

## Pestañas del dashboard

1. **Resumen Ejecutivo** — KPIs, embudo de conversión, distribución de resultados, insights IA
2. **Rendimiento Asesores** — Tabla de asesores con filtros, análisis IA individual por asesor
3. **Análisis Detallado** — Planes mencionados, motivos de rechazo, tipo de cliente + análisis IA de patrones
4. **Inteligencia Operativa** — Gráficas de horas/días/sentimiento/scorecard + análisis IA operativo
5. **Transcripciones** — Visor de llamadas con chat, búsqueda inteligente y análisis IA por llamada
6. **Agente IA PRO** — Chat + 8 análisis automáticos + ranking comparativo + reporte completo PDF

## Embudo de conversión

| Paso | Campo BigQuery | Descripción |
|------|---------------|-------------|
| Total llamadas | `COUNT(*)` | Todas las llamadas |
| Efectivas (contacto) | `efectiva = 1.0` | Llamadas con contacto real (campo CUN) |
| Conv > 30s | `Duracion_Estimada IN ('Corta','Media','Larga')` | Conversaciones con duración real |
| Con Saludo | `saludo_inicial = 1.0` | Saludos correctos según la CUN |
| Ventas Cerradas | `Resultado_Llamada = 'Venta'` | Ventas detectadas por transcripción |

## Módulos de IA disponibles

| Endpoint | Usado en | Descripción |
|----------|----------|-------------|
| `GET /ia/generar_insights` | Resumen | Insights rápidos del período |
| `GET /ia/analisis_automatico?tipo_analisis=X` | Agente IA PRO | 8 tipos de análisis profundo |
| `GET /ia/inteligencia_operativa` | Inteligencia | Patrones operativos de horas/días/rendimiento |
| `GET /ia/analizar_asesor?asesor=X` | Rendimiento | Diagnóstico individual con fortalezas y coaching |
| `GET /ia/analizar_llamada?llamada_id=X` | Transcripciones | Análisis de llamada específica: resumen, scorecard, coaching |
| `GET /ia/reporte_completo` | Agente IA PRO | Reporte ejecutivo de 9 secciones descargable en PDF |
| `GET /ia/analisis_ranking` | Agente IA PRO | Comparativo de TODOS los asesores con plan de mentoría |

> Todos los módulos usan `prompt_html()` → retornan HTML renderizable directamente.
> `call()` siempre retorna tupla `(content, error)` — siempre desempaquetar: `content, error = call(...)`.
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

Todos los endpoints aceptan `FilterModel` como query params:

| Filtro | Campo BigQuery |
|--------|---------------|
| Fecha desde / hasta | `Fecha` |
| Resultado llamada | `Resultado_Llamada` (muestra "Venta Cerrada", envía "Venta" al backend) |
| Plan mencionado | `Plan_Mencionado` |
| Duración | `Duracion_Estimada` |
| Saludo asesor | `Saludo_Completo` |
| Nombre asesor | `Cuenta` |
| Módulo de atención | `Nombre_del_Modulo` |
| Clasificación sentimiento | `clasificacion` |
| Tipo llamada | `tipo` |
| Asistencia mencionada | `asistencia_mencionada` |

## Campos calculados por el pipeline vs campos de la CUN

| Campo | Origen | Cómo se calcula |
|-------|--------|-----------------|
| `Resultado_Llamada` | Pipeline | Regex sobre transcripción |
| `Plan_Mencionado` | Pipeline | Regex sobre transcripción |
| `Duracion_Estimada` | Pipeline | Longitud de transcripción |
| `Saludo_Completo` | Pipeline | 3/4 frases específicas detectadas |
| `Motivo_Rechazo` | Pipeline | Basado en Resultado_Llamada |
| `efectiva` | CUN | Campo directo del SQL Server |
| `saludo_inicial` | CUN | Campo directo del SQL Server |
| `clasificacion` | CUN | Campo directo del SQL Server (⚠️ mayoría neutro) |
| `subjectivity` / `confianza` | CUN | Campos directos del SQL Server |

> ⚠️ `clasificacion`, `subjectivity` y `confianza` vienen del SQL Server de la CUN.
> Si estos campos no se llenan correctamente en la fuente, las gráficas de sentimiento y subjetividad mostrarán datos incompletos.

## Pipeline de datos

```
SQL Server CUN (172.16.1.33)
        ↓  (Windows Auth — cuenta CUN)
subir_datos.py  ←  Programador de Tareas Windows (diario 7:00 AM)
        ↓
Procesamiento: Resultado_Llamada, Plan_Mencionado, Duracion_Estimada,
               Saludo_Completo, Motivo_Rechazo (basados en transcripción)
        ↓
BigQuery: desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas
        ↓
Backend FastAPI (Cloud Run) → Frontend React (Firebase Hosting)
```

### Categorías de duración (basadas en longitud de transcripción)

| Categoría | Caracteres | Duración aprox. |
|-----------|-----------|-----------------|
| Buzón | < 50 | < 30 seg |
| Muy Corta | 50 – 199 | 30 seg – 1 min |
| Corta | 200 – 499 | 1 – 2 min |
| Media | 500 – 1499 | 2 – 5 min |
| Larga | 1500+ | 5+ min |

## Cambiar la URL del backend

La URL del backend está centralizada en `src/config.js`:

```js
export const API_BASE = "https://cltiene-backend-293865702055.us-central1.run.app";
```

Editar ese archivo es suficiente — todos los componentes la importan desde ahí.

## Despliegue

### Backend (Cloud Run)

```bash
# Desde la raíz del proyecto
gcloud builds submit --config cloudbuild.yaml --project desarrollo-investigaciones
```

### Frontend (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting:cltiene-dashboard
```

## Variables de entorno en Cloud Run

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_MUNDIAL` | API key de OpenAI (configurada como secret) |
| `GOOGLE_CLOUD_PROJECT` | ID del proyecto GCP |
| `MAX_TOKENS` | Máximo de tokens por respuesta IA (default: 4000) |
| `MODEL` | Modelo OpenAI a usar (default: gpt-4o-mini) |

## Automatización de carga de datos

Para programar la carga automática desde un PC con sesión CUN activa:

```powershell
# Ejecutar una sola vez como Administrador
.\back\registrar_tarea.ps1
```

Crea una tarea en el Programador de Windows que corre `back/subir_datos.py` diariamente a las 7:00 AM. Los logs quedan en `back/subir_datos.log`.

## Contacto

**DivergencyAI SAS** — contacto@divergencyai.com
