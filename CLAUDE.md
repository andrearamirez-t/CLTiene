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

## BigQuery

- Tabla: `desarrollo-investigaciones.call_center.cltiene_llamadas_procesadas`
- `Fecha` es INTEGER en nanosegundos → `DATETIME(TIMESTAMP_MICROS(DIV(Fecha, 1000)))`
- `Resultado_Llamada = 'Venta'` (BigQuery es case-sensitive)
- `saludo_inicial` (CUN, 0/1) ≠ `Saludo_Completo` (pipeline, "Sí"/"Parcial"/"No")

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

### Problema identificado (pendiente de fix)
- `estructurar_dialogo()` en `subir_datos.py` detecta hablantes incorrectamente en algunas llamadas — Asesor y Cliente aparecen intercambiados en el ChatVisor de Transcripciones

---

## TAREAS PENDIENTES

### Sesión 2026-06-19 (este chat)
- ✅ `Rendimiento.jsx`: `analizar_asesor` ahora pasa filtros del sidebar con `buildQuery()`
- ✅ `Rendimiento.jsx`: `estiloBadge` corregido — antes pasaba número como color CSS (bug), ahora usa `colorBadge(val)`: gris=0%, rojo<2%, naranja<5%, verde≥5%
- ✅ Creado `CLAUDE.md` para mantener contexto entre sesiones (se actualiza automáticamente)

### Backlog
- [ ] **Corregir detección de hablantes** en `estructurar_dialogo()` — Asesor/Cliente a veces invertidos
- [ ] Validar que `AnalisisAu`, `RankingIA`, `ReporteCompleto` (en Agente IA PRO) pasen filtros sidebar
- [ ] Separar métricas Ventas vs Servicio en reportes
- [ ] Pipeline V4: registrar tarea automática en PC con sesión CUN
