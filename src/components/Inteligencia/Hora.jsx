import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const Hora = ({ data }) => {
  return (
   <ResponsiveContainer width="100%" height={320}>
  <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
    
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

    <XAxis 
      dataKey="name" 
      axisLine={{ stroke: '#1e293b' }} 
      tickLine={{ stroke: '#1e293b' }} 
      tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 'bold', dy: 10 }}
    />

    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#10b981' }} />

    <Tooltip />
    
    <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ paddingBottom: '20px' }} />

    <Bar yAxisId="left" dataKey="t" fill="#e11d48" name="Total Llamadas" barSize={25} radius={[2, 2, 0, 0]}>
      <LabelList dataKey="t" position="center" fill="white" fontSize={10} fontWeight="bold" />
    </Bar>

    <Line yAxisId="right" type="monotone" dataKey="ef" stroke="#10b981" name="% Efectivas" strokeWidth={3} dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}>
      <LabelList dataKey="ef" position="top" offset={10} style={{ fill: '#10b981', fontSize: '11px', fontWeight: 'bold' }} formatter={(v) => `${v}%`} />
    </Line>

  </ComposedChart>
</ResponsiveContainer>
  );
};

export default Hora; 