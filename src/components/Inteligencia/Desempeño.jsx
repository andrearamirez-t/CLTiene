import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const Desempeño = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        
        margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        
        <XAxis 
          dataKey="n" 
          fontSize={10}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
          interval={0} 
          angle={-45}  
          textAnchor="end"
          dy={35}
          dx={-10}
          height={120} 
        />
        
        <YAxis 
          domain={[0, 100]} 
          fontSize={12}
          tick={{ fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        
        <Tooltip cursor={{ fill: '#f8fafc' }} />

        <Bar 
          dataKey="s" 
          fill="#f59e0b" 
          barSize={40}
          radius={[4, 4, 0, 0]}
        >
          <LabelList 
            dataKey="s" 
            position="center" 
            fill="white" 
            style={{ fontWeight: 'bold', fontSize: '11px' }}
            formatter={(v) => `${v}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Desempeño;