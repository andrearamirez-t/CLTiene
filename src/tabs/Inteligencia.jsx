import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import Hora from '../components/Inteligencia/Hora';
import Dia from '../components/Inteligencia/Dia';
import Ventas from '../components/Inteligencia/Ventas';
import Subjetividad from '../components/Inteligencia/Subjetividad';
import Desempeño from '../components/Inteligencia/Desempeño';
import Evolucion from '../components/Inteligencia/Evolucion';
import IndicadoresTabla from '../components/Inteligencia/IndicadoresTabla';
import Duracion from '../components/Inteligencia/Duracion';
import GraficaCircular from '../components/Inteligencia/GraficaCircular';
import { useFilters } from '../FiltersContext';

function CardGrafica({ titulo, children, height = '500px' }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: height,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          borderBottom: '2px solid #3b82f6',
          marginBottom: '20px',
          paddingBottom: '10px',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '15px',
            color: '#1e293b',
            fontWeight: 'bold',
          }}
        >
          {titulo}
        </h4>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

export default function Inteligencia() {
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);
  const [analisisIA, setAnalisisIA] = useState('');
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  const { filters, buildQuery } = useFilters();
  const esServicio = filters.tipo_llamada?.toLowerCase() === 'servicio';

  const [f_datosHoras, setDatosHoras] = useState([]);
  const [f_datosDias, setDatosDias] = useState([]);
  const [f_datosVentas, setDatosVentas] = useState([]);
  const [f_datosSubjetividad, setDatosSubjetividad] = useState([]);
  const [f_datosDesempeño, setDatosDesempeño] = useState([]);
  const [f_datosEvolucion, setDatosEvolucion] = useState([]);
  const [f_datosDuracion, setDatosDuracion] = useState([]);
  const [f_datosSentimiento, setDatosSentimiento] = useState([]);
  const [f_datosCompletosTabla, setDatosCompletosTabla] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = buildQuery();
        const query = params ? `?${params}` : '';

        const safe = (url) => fetch(url).then((r) => r.ok ? r.json() : []).catch(() => []);

        const [hora, dia, ventas, subjetividad, desempeno, evolucion, scorecard, duracion, sentimiento] =
          await Promise.all([
            safe(`${API_BASE}/rendimiento-hora${query}`),
            safe(`${API_BASE}/rendimiento-dia${query}`),
            safe(`${API_BASE}/ventas-vs-servicio${query}`),
            safe(`${API_BASE}/subjetividad-confianza-modulo${query}`),
            safe(`${API_BASE}/desempeno-sentimiento-asesor${query}`),
            safe(`${API_BASE}/evolucion-ventas${query}`),
            safe(`${API_BASE}/scorecard-asesores${query}`),
            safe(`${API_BASE}/duracion-vs-efectividad${query}`),
            safe(`${API_BASE}/clasificacion-sentimiento${query}`),
          ]);

        setDatosHoras(Array.isArray(hora) ? hora : []);
        setDatosDias(Array.isArray(dia) ? dia : []);
        setDatosVentas(Array.isArray(ventas) ? ventas : []);
        setDatosSubjetividad(Array.isArray(subjetividad) ? subjetividad : []);
        setDatosDesempeño(Array.isArray(desempeno) ? desempeno : []);
        setDatosEvolucion(Array.isArray(evolucion) ? evolucion : []);
        setDatosCompletosTabla(Array.isArray(scorecard) ? scorecard : []);
        setDatosDuracion(Array.isArray(duracion) ? duracion : []);
        setDatosSentimiento(Array.isArray(sentimiento) ? sentimiento : []);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      }
    };

    fetchData();
  }, [filters, buildQuery]);

  const obtenerAnalisisIA = async () => {
    try {
      setCargandoAnalisis(true);
      setAnalisisIA('');

      const params = buildQuery();
      const query = params ? `?${params}` : '';

      // const response = await fetch(`${API_BASE}/analisis-ia${query}`);
      const response = await fetch(`${API_BASE}/ia/inteligencia_operativa${query}`);
      const result = await response.json();
      const data = result.result

      if (!response.ok) {
        setAnalisisIA('No fue posible cargar el análisis de IA.');
        return;
      }

      const raw = data || 'No se recibió análisis.';
      setAnalisisIA(raw
        .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
        .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
        .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0'));
    } catch (error) {
      console.error('Error obteniendo análisis IA:', error);
      setAnalisisIA('No fue posible cargar el análisis de IA.');
    } finally {
      setCargandoAnalisis(false);
    }
  };

  const datosHoras = f_datosHoras;
  const datosDias = f_datosDias;
  const datosVentas = f_datosVentas;
  const datosSubjetividad = f_datosSubjetividad;
  const datosDesempeño = f_datosDesempeño;
  const datosEvolucion = f_datosEvolucion;
  const datosDuracion = f_datosDuracion;
  const datosSentimiento = f_datosSentimiento;
  const datosCompletosTabla = f_datosCompletosTabla;

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '100%',
        }}
      >
        <CardGrafica titulo="Rendimiento por Hora">
          <Hora data={datosHoras} />
        </CardGrafica>

        <CardGrafica titulo="Rendimiento por Día">
          <Dia data={datosDias} />
        </CardGrafica>

        <CardGrafica titulo="Ventas vs Servicio">
          <Ventas data={datosVentas} />
        </CardGrafica>

        <CardGrafica titulo="Subjetividad vs Confianza por Módulo">
          <Subjetividad data={datosSubjetividad} />
        </CardGrafica>

        <CardGrafica titulo="Desempeño y Sentimiento por Asesor">
          <Desempeño data={datosDesempeño} />
        </CardGrafica>

        <CardGrafica titulo="Evolución de Ventas en el Tiempo">
          <Evolucion data={datosEvolucion} ocultarVentas={esServicio} />
        </CardGrafica>

        <div style={{ gridColumn: '1 / span 2', margin: '10px 0' }}>
          <CardGrafica titulo="Indicadores Clave por Asesor (Scorecard)" height="auto">
            <IndicadoresTabla data={datosCompletosTabla} />
          </CardGrafica>
        </div>

        <CardGrafica titulo="Duración vs Efectividad">
          <Duracion data={datosDuracion} />
        </CardGrafica>

        <CardGrafica titulo="Clasificación de Sentimiento">
          <GraficaCircular data={datosSentimiento} />
        </CardGrafica>

        <div style={{ gridColumn: '1 / span 2', marginTop: '20px' }}>
          <button
            onClick={async () => {
              const nuevoEstado = !mostrarAnalisis;
              setMostrarAnalisis(nuevoEstado);

              if (nuevoEstado) {
                await obtenerAnalisisIA();
              }
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: mostrarAnalisis
                ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                : 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: mostrarAnalisis
                ? '0 4px 18px rgba(100,116,139,0.25)'
                : '0 4px 18px rgba(252,50,118,0.35)',
            }}
          >
            <span>{mostrarAnalisis ? 'Cerrar Análisis' : 'Análisis IA de Inteligencia Operativa'}</span>
          </button>
        </div>

        {mostrarAnalisis && (
          <div
            style={{
              gridColumn: '1 / span 2',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '36px 40px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{
              borderLeft: '5px solid #FC3276',
              background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
              borderRadius: '0 10px 10px 0',
              padding: '14px 20px',
              marginBottom: '28px',
            }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#FC3276', marginBottom: '4px' }}>
                🧠 Análisis de Inteligencia Operativa
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Generado con los filtros activos del dashboard
              </span>
            </div>

            <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}>
              {cargandoAnalisis ? (
                <p style={{ color: '#94a3b8' }}>⌛ Generando análisis con IA...</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: analisisIA }} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}