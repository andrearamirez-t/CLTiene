import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Duracion = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#64748b', fontSize: 10 }} 
          axisLine={false}
          tickLine={false}
        />
        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} unit="%" />
        
        <Tooltip contentStyle={{ fontSize: '12px' }} />
        <Legend verticalAlign="top" iconSize={10} wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
        
        <Bar 
          yAxisId="left" 
          dataKey="total" 
          name="Total" 
          fill="#e11d48" 
          radius={[4, 4, 0, 0]} 
          barSize={35} 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="efectividad" 
          name="% Efectivas" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Duracion;