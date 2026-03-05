import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line
} from 'recharts';

const Evolucion = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
      >
        <defs>
          <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        
        <XAxis 
          dataKey="fecha" 
          fontSize={11}
          tick={{ fill: '#64748b' }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
          dy={10}
        />
        
        <YAxis 
          fontSize={12}
          tick={{ fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 1200]}
        />
        
        <Tooltip />
        
        <Legend 
          verticalAlign="top" 
          align="left" 
          height={36}
          iconType="circle"
        />

        <Area
          type="monotone"
          dataKey="ingresos"
          name="Ingresos"
          stroke="#ec4899"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorIngresos)"
          dot={{ r: 4, fill: '#ec4899' }}
          activeDot={{ r: 6 }}
        />

        <Area
          type="monotone"
          dataKey="ventas"
          name="Ventas"
          stroke="#10b981"
          strokeWidth={3}
          fill="transparent" // Solo queremos la línea
          dot={{ r: 4, fill: '#10b981' }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Evolucion;