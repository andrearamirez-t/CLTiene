import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const Ventas = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical" 
        margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        
        <XAxis type="number" hide />
        
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 'bold' }}
          width={80}
        />
        
        <Tooltip cursor={{ fill: '#f1f5f9' }} />
        
        <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ paddingBottom: '20px' }} />

        <Bar dataKey="total" fill="#e11d48" name="Total" barSize={18} radius={[0, 4, 4, 0]}>
          <LabelList dataKey="total" position="right" style={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} offset={10} />
        </Bar>

        <Bar dataKey="efectivas" fill="#10b981" name="Efectivas" barSize={18} radius={[0, 4, 4, 0]}>
          <LabelList dataKey="efectivas" position="right" style={{ fill: '#10b981', fontSize: 11, fontWeight: 'bold' }} offset={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Ventas;