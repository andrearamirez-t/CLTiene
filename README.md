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
| Despliegue | Google Cloud Run + Cloud Build |
| Fuente de datos | SQL Server (CUN) → BigQuery |

## Estructura del proyecto

```
CLTiene/
├── src/                        # Frontend React
│   ├── pages/Dashboard.jsx     # Página principal con tabs y KPIs
│   ├── tabs/                   # Un componente por pestaña
│   │   ├── Resumen.jsx
│   │   ├── Rendimiento.jsx
│   │   ├── Analisis.jsx
│   │   ├── Inteligencia.jsx
│   │   ├── Transcripciones.jsx
│   │   └── Agente.jsx
│   ├── components/             # Gráficas, IA, UI reutilizable
│   ├── FiltersContext.jsx      # Contexto global de filtros
│   └── layout/Sidebar.jsx     # Barra lateral de filtros
│
├── back/                       # Backend FastAPI
│   ├── main.py                 # App principal
│   ├── api/
│   │   ├── routes.py           # Endpoints de charts, filtros e IA
│   │   ├── charts/             # Queries BigQuery por gráfica
│   │   ├── ia/                 # Módulos de IA (insights, análisis, chat)
│   │   ├── filters/            # Lógica de filtros
│   │   └── upload/             # Pipeline SQL Server → BigQuery
│   └── helpers/utils.py        # Filtros y contexto para IA
│
├── back/subir_datos.py         # Script autónomo de carga de datos
├── back/registrar_tarea.ps1    # Registra tarea automática en Windows
├── cloudbuild.yaml             # Pipeline CI/CD Cloud Build
└── Dockerfile                  # Imagen del frontend
```

## Pestañas del dashboard

1. **Resumen Ejecutivo** — KPIs generales, distribución de resultados y duraciones
2. **Rendimiento Asesores** — Scorecard individual, ranking y métricas de calidad
3. **Análisis Detallado** — Gráficas de sentimiento, planes, horas y días de mayor efectividad
4. **Inteligencia Operativa** — Análisis automático con IA sobre patrones y tendencias
5. **Transcripciones** — Visor de llamadas con búsqueda inteligente
6. **Agente IA PRO** — Chat interactivo con contexto del call center

## Pipeline de datos

```
SQL Server CUN (172.16.1.33)
        ↓  (Windows Auth — cuenta CUN)
subir_datos.py  ←  Programador de Tareas Windows (diario 7:00 AM)
        ↓
Procesamiento: categorización, plan mencionado, duración, calidad del asesor
        ↓
BigQuery: desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas
        ↓
Backend FastAPI (Cloud Run) → Frontend React (Cloud Run)
```

### Categorías de duración (basadas en longitud de transcripción)

| Categoría | Caracteres | Duración aprox. |
|-----------|-----------|-----------------|
| Buzón | < 50 | < 30 seg |
| Muy Corta | 50 – 199 | 30 seg – 1 min |
| Corta | 200 – 499 | 1 – 2 min |
| Media | 500 – 1499 | 2 – 5 min |
| Larga | 1500+ | 5+ min |

## Despliegue

```bash
# Backend + Frontend en Cloud Run (desde la raíz del proyecto)
gcloud builds submit --config cloudbuild.yaml --project desarrollo-investigaciones
```

## Automatización de carga de datos

Para programar la carga automática desde un PC con sesión CUN activa:

```powershell
# Ejecutar una sola vez como Administrador
.\back\registrar_tarea.ps1
```

Crea una tarea en el Programador de Windows que corre `back/subir_datos.py` diariamente a las 7:00 AM. Los logs quedan en `back/subir_datos.log`.

## Contacto

**DivergencyAI SAS** — contacto@divergencyai.com