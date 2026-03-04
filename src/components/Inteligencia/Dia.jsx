import React from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LabelList 
} from 'recharts';

const Dia = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 'bold' }}
          axisLine={{ stroke: '#1e293b' }}
          dy={10}
        />
        
        <YAxis 
          yAxisId="left" 
          orientation="left" 
          stroke="#64748b"
          tick={{ fontSize: 12 }}
        />
       
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke="#10b981"
          domain={[0, 12]} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
        
        
        <Bar 
          yAxisId="left" 
          dataKey="t" 
          fill="#e11d48" 
          barSize={40} 
          radius={[4, 4, 0, 0]}
          name="Total Llamadas"
        >
          <LabelList dataKey="t" position="center" fill="white" fontSize={10} fontWeight="bold" />
        </Bar>

       
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="ef" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          name="% Efectivas"
        >
          <LabelList 
            dataKey="ef" 
            position="top" 
            offset={10}
            style={{ fill: '#10b981', fontSize: '11px', fontWeight: 'bold' }}
            formatter={(v) => `${v}%`}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Dia;