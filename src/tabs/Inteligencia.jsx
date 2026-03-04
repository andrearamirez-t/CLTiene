import React from 'react';
import Hora from '../components/Inteligencia/Hora';
import Dia from '../components/Inteligencia/Dia';
import Ventas from '../components/Inteligencia/Ventas';
import Subjetividad from '../components/Inteligencia/Subjetividad';
import Desempeño from '../components/Inteligencia/Desempeño';

const CardGrafica = ({ titulo, children }) => (
  <div style={{ 
    flex: '1 1 calc(50% - 20px)', 
    backgroundColor: 'white', 
    padding: '24px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    minWidth: '450px' 
  }}>
    <div style={{ borderBottom: '2px solid #3b82f6', marginBottom: '20px', paddingBottom: '10px' }}>
      <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: 'bold' }}>{titulo}</h4>
    </div>
    {children}
  </div>
);

export default function Inteligencia() {
  
  const datosHoras = [
    { name: '08', t: 215, ef: 10.1 }, { name: '09', t: 413, ef: 15.4 },
    { name: '10', t: 317, ef: 7.1 }, { name: '11', t: 487, ef: 6.5 },
    { name: '12', t: 361, ef: 5.3 }, { name: '13', t: 139, ef: 4.8 },
    { name: '14', t: 321, ef: 8.3 }, { name: '15', t: 370, ef: 6.2 }
  ];

  const datosDias = [
    { name: 'Lunes', t: 528, ef: 3.4 }, { name: 'Martes', t: 558, ef: 5.4 },
    { name: 'Miércoles', t: 411, ef: 6.6 }, { name: 'Jueves', t: 462, ef: 7.1 },
    { name: 'Viernes', t: 831, ef: 6.0 }, { name: 'Sábado', t: 425, ef: 4.7 },
    { name: 'Domingo', t: 84,  ef: 8.3 }
  ];

  const datosVentas = [
    { name: 'ventas', total: 813, efectivas: 53 },
    { name: 'servicio', total: 706, efectivas: 38 },
    { name: 'mixto', total: 1780, efectivas: 94 }
  ];

  const datosSubjetividad = [
    { x: 0.5, y: 0, name: 'CRM', color: '#10b981' },
    { x: 0.5, y: 0, name: 'ASISTENCIA', color: '#e11d48' }
  ];

  const datosDesempeño = [
    { n: 'Angie Daniela Lancheros', s: 100 },
    { n: 'Dayana Alexandra Marulanda', s: 100 },
    { n: 'Edwin Cendales', s: 100 },
    { n: 'Jenifer Andrea Rodriguez', s: 100 },
    { n: 'Jimmy Alexander Rusinque', s: 100 },
    { n: 'Johan Casallas', s: 100 },
    { n: 'Marjorie Villadiego', s: 100 },
    { n: 'Melany Camila Ramirez', s: 100 },
    { n: 'Nicolas Steven Tovar', s: 100 }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* FILA 1: OPERATIVO */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <CardGrafica titulo="Rendimiento por Hora">
            <Hora data={datosHoras} />
          </CardGrafica>
          <CardGrafica titulo="Rendimiento por Día">
            <Dia data={datosDias} />
          </CardGrafica>
        </div>

        {/* NEGOCIO Y SUBJETIVIDAD */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <CardGrafica titulo="Ventas vs Servicio (Efectividad)">
            <Ventas data={datosVentas} />
          </CardGrafica>
          <CardGrafica titulo="Subjetividad vs Confianza por Módulo">
            <Subjetividad data={datosSubjetividad} />
          </CardGrafica>
        </div>

        {/* ASESORES */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <CardGrafica titulo="Desempeño y Sentimiento por Asesor" fullWidth>
            <Desempeño data={datosDesempeño} />
          </CardGrafica>
        </div>

      </div>
    </div>
  );
}