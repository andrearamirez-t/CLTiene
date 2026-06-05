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
│   ├── styles/theme.js         # Tokens de diseño: colores, gradientes, sombras
│   ├── pages/Dashboard.jsx     # Shell principal: sidebar + KPIs + navegación de tabs
│   ├── tabs/                   # Un componente por pestaña
│   │   ├── Resumen.jsx
│   │   ├── Rendimiento.jsx
│   │   ├── Analisis.jsx
│   │   ├── Inteligencia.jsx
│   │   ├── Transcripciones.jsx
│   │   └── Agente.jsx
│   ├── components/             # Gráficas, botones IA, UI reutilizable
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
│   ├── helpers/utils.py        # get_data_context() — contexto de datos para la IA
│   ├── subir_datos.py          # Script autónomo de carga de datos
│   └── registrar_tarea.ps1     # Registra tarea automática en Windows
│
├── cloudbuild.yaml             # Pipeline CI/CD — solo despliega el backend
└── firebase.json               # Configuración Firebase Hosting
```

## KPIs del dashboard

| KPI | Fuente | Descripción |
|-----|--------|-------------|
| TOTAL LLAMADAS | `COUNT(*)` | Todas las llamadas en el período |
| LLAMADAS EFECTIVAS | `SUM(efectiva)` | Llamadas marcadas como efectivas en la CUN |
| VENTAS CERRADAS | `COUNT(resultado_llamada = 'Venta')` | Ventas detectadas por transcripción |
| HORA PICO | `AVG(timestamp)` | Hora promedio de mayor actividad |
| DÍA PICO | `GROUP BY día` | Día con más llamadas |
| ASESOR TOP | `ORDER BY total DESC` | Asesor con más llamadas |
| SALUDO OK | `AVG(saludo_inicial)` | % de llamadas con saludo completo |
| CALIDAD LLAMADA IA | Promedio 7 métricas | Score 0–100 de calidad del asesor |

## Pestañas del dashboard

1. **Resumen Ejecutivo** — KPIs, embudo de conversión, distribución de resultados, insights IA
2. **Rendimiento Asesores** — Scorecard individual, ranking con filtros, análisis IA por asesor
3. **Análisis Detallado** — Planes mencionados, motivos de rechazo, tipo de cliente
4. **Inteligencia Operativa** — Gráficas de horas/días/sentimiento + análisis IA operativo
5. **Transcripciones** — Visor de llamadas con búsqueda inteligente y análisis por llamada
6. **Agente IA PRO** — Chat interactivo + 8 tipos de análisis automático con filtros activos

## Filtros del dashboard

Todos los endpoints aceptan `FilterModel` como query params. Los filtros disponibles son:

| Filtro | Campo BigQuery |
|--------|---------------|
| Fecha desde / hasta | `Fecha` |
| Resultado llamada | `Resultado_Llamada` |
| Plan mencionado | `Plan_Mencionado` |
| Duración | `Duracion_Estimada` |
| Saludo asesor | `Saludo_Completo` |
| Nombre asesor | `Cuenta` |
| Módulo de atención | `Nombre_del_Modulo` |
| Clasificación sentimiento | `clasificacion` |
| Tipo llamada | `tipo` |
| Asistencia mencionada | `asistencia_mencionada` |

## Módulos de IA disponibles

| Endpoint | Descripción |
|----------|-------------|
| `GET /ia/generar_insights` | Insights rápidos del período |
| `GET /ia/analisis_automatico?tipo_analisis=X` | 8 tipos de análisis (resumen, coaching, rechazos…) |
| `GET /ia/inteligencia_operativa` | Análisis profundo de patrones operativos |
| `GET /ia/analizar_asesor?asesor=X` | Diagnóstico individual de asesor |
| `GET /ia/reporte_completo` | Reporte ejecutivo completo (9 secciones) en HTML |
| `GET /ia/analisis_ranking` | Comparativo de rankings con recomendaciones |

> Todos los módulos usan `prompt_html()` para retornar HTML renderizable directamente.
> `call()` siempre retorna tupla `(content, error)` — siempre desempaquetar con `content, error = call(...)`.

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

## Automatización de carga de datos

Para programar la carga automática desde un PC con sesión CUN activa:

```powershell
# Ejecutar una sola vez como Administrador
.\back\registrar_tarea.ps1
```

Crea una tarea en el Programador de Windows que corre `back/subir_datos.py` diariamente a las 7:00 AM. Los logs quedan en `back/subir_datos.log`.

## Contacto

**DivergencyAI SAS** — contacto@divergencyai.com
