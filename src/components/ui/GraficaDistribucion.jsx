import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const GraficaDistribucion = ({ datos = [] }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '380px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ borderTop: '2px solid #3b82f6', marginBottom: '24px', paddingTop: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Distribución de Turnos</h3>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={datos} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
          <XAxis 
            dataKey="turnos" 
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            label={{ value: 'Turnos', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
          />
          <Tooltip />
          <Area type="stepAfter" dataKey="frecuencia" stroke="#db2777" fill="#db2777" fillOpacity={0.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaDistribucion;