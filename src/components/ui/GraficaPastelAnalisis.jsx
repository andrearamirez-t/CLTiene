import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GraficaPastelAnalisis = ({ titulo, datos, colores }) => {

  console.log("Resultado grafica pastel analisis:", datos)

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '11px' }}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ borderTop: '2px solid #3b82f6', paddingTop: '10px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
        {titulo}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datos}
            innerRadius={0} 
            outerRadius={80}
            dataKey="value"
            label={renderLabel}
          >
            {datos.map((entry, index) => (
              <Cell key={index} fill={colores[index % colores.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaPastelAnalisis;