import React, { useState } from 'react';
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
  const { filters, buildQuery } = useFilters();

  // const [rendimientoHora, setRendimientoHora] = useState([])
  // const [rendimientoDia, setRendimientoHora] = useState([])
  // const [ventas_servicio, setRendimientoHora] = useState([])
  // const [Subjetividad_confianza, setRendimientoHora] = useState([])
  // const [desempeño_sentiento, setRendimientoHora] = useState([])
  // const [evolucion_, setRendimientoHora] = useState([])
  // const [rendimientoHora, setRendimientoHora] = useState([])
  // const [rendimientoHora, setRendimientoHora] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const params = buildQuery() || null

  //       const rendimientoHoraRes = await fetch(`http://localhost:8000/api/planes_mencionados${params ? `?${params}` : ""}`);

  //       const rendimientoJSON = await rendimientoHoraRes.json();

  //       setRendimientoHora(rendimientoJSON);

  //     } catch (error) {
  //       console.error("Error cargando datos:", error);
  //     }
  //   };

  //   fetchData();
  // }, [filters]);


  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: height,
      boxSizing: 'border-box'
    }}>
      <div style={{ borderBottom: '2px solid #3b82f6', marginBottom: '20px', paddingBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>{titulo}</h4>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}

export default function Inteligencia() {
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);


  const datosHoras = [{ name: '08', t: 215, ef: 10.1 }, { name: '09', t: 413, ef: 15.4 }, { name: '10', t: 317, ef: 7.1 }, { name: '11', t: 487, ef: 6.5 }];
  const datosDias = [{ name: 'Lunes', t: 528, ef: 3.4 }, { name: 'Martes', t: 558, ef: 5.4 }, { name: 'Miércoles', t: 411, ef: 6.6 }];
  const datosVentas = [{ name: 'ventas', total: 813, efectivas: 53 }, { name: 'servicio', total: 706, efectivas: 38 }, { name: 'mixto', total: 1780, efectivas: 94 }];
  const datosSubjetividad = [{ x: 0.5, y: 0, name: 'CRM', color: '#10b981' }, { x: 0.5, y: 0, name: 'ASISTENCIA', color: '#e11d48' }];
  const datosDesempeño = [{ n: 'Angie Daniela', s: 100 }, { n: 'Edwin Cendales', s: 100 }, { n: 'Jenifer Andrea', s: 100 }, { n: 'Jimmy Alexander', s: 100 }, { n: 'Johan Casallas', s: 100 }, { n: 'Marjorie Villadiego', s: 100 }, { n: 'Melany Camila', s: 100 }];
  const datosEvolucion = [{ fecha: 'Jan 12', ingresos: 600, ventas: 40 }, { fecha: 'Jan 18', ingresos: 1180, ventas: 60 }, { fecha: 'Jan 24', ingresos: 720, ventas: 50 }, { fecha: 'Feb 2', ingresos: 810, ventas: 55 }];
  const datosDuracion = [{ name: 'Buzón', total: 753, efectividad: 0.0 }, { name: 'Muy Corta', total: 490, efectividad: 0.0 }, { name: 'Corta', total: 733, efectividad: 0.0 }, { name: 'Media', total: 1017, efectividad: 3.3 }, { name: 'Larga', total: 306, efectividad: 49.4 }];
  const datosSentimiento = [{ name: 'neutro', value: 3299 }];
  const datosCompletosTabla = [{ nombre: 'Melany Camila Ramirez', total: 421, ventas: 37, efectividad: 8.8, turnosAsesor: 2.6, turnosCliente: 2.4, palabras: 137, saludo: 49, identificacion: 32, comprension: 22, ofrecimiento: 15, manejo: 17, cierre: 60, paso: 25 }, { nombre: 'Marjorie Villadiego Ballesteros', total: 432, ventas: 34, efectividad: 7.9, turnosAsesor: 2.6, turnosCliente: 2.5, palabras: 135, saludo: 48, identificacion: 17, comprension: 13, ofrecimiento: 26, manejo: 16, cierre: 31, paso: 13 }];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}>

        <CardGrafica titulo="Rendimiento por Hora"><Hora data={datosHoras} /></CardGrafica>
        <CardGrafica titulo="Rendimiento por Día"><Dia data={datosDias} /></CardGrafica>
        <CardGrafica titulo="Ventas vs Servicio"><Ventas data={datosVentas} /></CardGrafica>
        <CardGrafica titulo="Subjetividad vs Confianza por Módulo"><Subjetividad data={datosSubjetividad} /></CardGrafica>
        <CardGrafica titulo="Desempeño y Sentimiento por Asesor"><Desempeño data={datosDesempeño} /></CardGrafica>
        <CardGrafica titulo="Evolución de Ventas en el Tiempo"><Evolucion data={datosEvolucion} /></CardGrafica>

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

        {/* BOTON IA */}
        <div style={{ gridColumn: '1 / span 2', marginTop: '20px' }}>
          <button
            onClick={() => setMostrarAnalisis(!mostrarAnalisis)}
            style={{
              width: '100%', padding: '16px', backgroundColor: '#db2777', color: 'white',
              border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <span>{mostrarAnalisis ? 'Cerrar Análisis' : ' Análisis IA de Inteligencia Operativa'}</span>
          </button>
        </div>


        {mostrarAnalisis && (
          <div style={{
            gridColumn: '1 / span 2',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #db2777',
            boxShadow: '0 4px 20px rgba(219, 39, 119, 0.1)'
          }}>
            <h3 style={{ color: '#db2777', marginTop: 0 }}>**Análisis de Inteligencia Operativa del Call Center**</h3>
            <div style={{ lineHeight: '1.8', color: '#334155' }}>
              <p><strong>1. Mejores Horarios:</strong> Evaluar la segmentación horaria para identificar picos de contacto...</p>
              <p><strong>2. Mejores Días:</strong> Días laborales suelen mostrar mayores tasas de contacto efectivo...</p>
              <p><strong>3. Ventas vs Servicio:</strong> Con una tasa de conversión al 1.85%, incrementar el enfoque en cierre...</p>
              <p><strong>4. Sentimiento:</strong> Los motivos de rechazo principales incluyen "No Interesa" (61.31%)...</p>
              <p><strong>5. Scorecard Asesores:</strong> La efectividad varía considerablemente, Melany tiene la tasa más alta...</p>
              <hr style={{ margin: '20px 0', border: '0.5px solid #f1f5f9' }} />
              <p style={{ fontWeight: 'bold' }}>Recomendaciones (5) :</p>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Capacitación Focalizada en técnicas de ventas.</li>
                <li>Optimización de Horarios según picos identificados.</li>
                <li>Segmentación de Base de Datos para reducir contactos no calificados.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}