import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const Subjetividad = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name="Confianza" domain={[-0.5, 1.5]} ticks={[-0.5, 0, 0.5, 1, 1.5]} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Confianza', position: 'bottom', offset: 0, fontSize: 12 }} />
        <YAxis type="number" dataKey="y" name="Polaridad" domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Polaridad', angle: -90, position: 'left', fontSize: 12 }} />
        <ZAxis type="number" range={[100, 100]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" align="right" />
        <ReferenceLine y={0} stroke="#1e293b" />
        {data.map((entry, index) => (
          <Scatter key={index} name={entry.name} data={[entry]} fill={entry.color} shape="circle" strokeWidth={2} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default Subjetividad;