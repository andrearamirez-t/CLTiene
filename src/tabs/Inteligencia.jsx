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

        const hora = await fetch(`http://localhost:8000/rendimiento-hora${query}`).then((r) => r.json());
        const dia = await fetch(`http://localhost:8000/rendimiento-dia${query}`).then((r) => r.json());
        const ventas = await fetch(`http://localhost:8000/ventas-vs-servicio${query}`).then((r) => r.json());
        const subjetividad = await fetch(`http://localhost:8000/subjetividad-confianza-modulo${query}`).then((r) => r.json());
        const desempeno = await fetch(`http://localhost:8000/desempeno-sentimiento-asesor${query}`).then((r) => r.json());
        const evolucion = await fetch(`http://localhost:8000/evolucion-ventas${query}`).then((r) => r.json());
        const scorecard = await fetch(`http://localhost:8000/scorecard-asesores${query}`).then((r) => r.json());
        const duracion = await fetch(`http://localhost:8000/duracion-vs-efectividad${query}`).then((r) => r.json());
        const sentimiento = await fetch(`http://localhost:8000/clasificacion-sentimiento${query}`).then((r) => r.json());

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

      const response = await fetch(`http://localhost:8000/analisis-ia${query}`);
      const data = await response.json();

      if (!response.ok) {
        setAnalisisIA(data?.detail || 'No fue posible cargar el análisis de IA.');
        return;
      }

      setAnalisisIA(data?.analisis || 'No se recibió análisis.');
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
          <Evolucion data={datosEvolucion} />
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
              backgroundColor: '#db2777',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span>{mostrarAnalisis ? 'Cerrar Análisis' : 'Análisis IA de Inteligencia Operativa'}</span>
          </button>
        </div>

        {mostrarAnalisis && (
          <div
            style={{
              gridColumn: '1 / span 2',
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #db2777',
              boxShadow: '0 4px 20px rgba(219, 39, 119, 0.1)',
            }}
          >
            <h3 style={{ color: '#db2777', marginTop: 0 }}>
              Análisis de Inteligencia Operativa del Call Center
            </h3>

            <div style={{ lineHeight: '1.8', color: '#334155' }}>
              {cargandoAnalisis ? (
                <p>Generando análisis con IA...</p>
              ) : (
                <p>{analisisIA || 'No hay análisis disponible.'}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}