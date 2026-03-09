import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';

const GraficaBarrasAnalisis = ({ titulo, datos, colorBarra, icono }) => {

  console.log("Resultado grafica barras analisis:", datos)

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      height: '400px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>

      <div style={{ borderTop: '1px solid #3b82f6', marginBottom: '20px', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>{icono}</span>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h3>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          layout="vertical"
          data={datos}
          margin={{ top: 5, right: 30, left: 40, bottom: 20 }}
        >

          <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="#f1f5f9" />

          <XAxis type="number" hide={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />

          <YAxis
            dataKey="n"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            width={110}
          />

          <Bar
            dataKey="valorReal"
            fill={colorBarra}
            barSize={22}
            radius={0}
          >

            <LabelList
              dataKey="v"
              position="insideRight"
              style={{ fill: 'white', fontSize: '10px', fontWeight: '500' }}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaBarrasAnalisis;