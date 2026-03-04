import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';

const GraficaCalidadIA = ({ datos = [] }) => {
  
  const colores = ['#db2777', '#f43f5e', '#ef4444', '#fb923c'];

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      height: '380px' 
    }}>

      <div style={{ borderTop: '2px solid #3b82f6', marginBottom: '24px', paddingTop: '10px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
          Calidad del Asesor
        </h3>
      </div>
      

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          layout="vertical" 
          data={datos}
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }} 
        >

          <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e2e8f0" />
          
          <XAxis 
            type="number" 
            axisLine={{ stroke: '#cbd5e1' }} 
            tickLine={{ stroke: '#cbd5e1' }} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            domain={[0, 368]} 
          />
          
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#1e293b', fontSize: 14, fontWeight: '500' }} 
            width={100} 
          />
          
          <Bar dataKey="valor" radius={[0, 6, 6, 0]} barSize={40}>
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
            ))}
            
            <LabelList 
              dataKey="etiqueta" 
              offset={15} 
              style={{ fill: 'white', fontWeight: 'bold', fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaCalidadIA;