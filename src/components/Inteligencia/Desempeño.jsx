import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Desempeño = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="n"
          interval={0}
          angle={-45}
          textAnchor="end"
          dy={40}
          height={120}
          fontSize={11}
        />

        <YAxis domain={[0, 100]} />

        <Tooltip />

        <Legend />

        <Bar dataKey="negativo" fill="#ef4444" barSize={20} radius={[4, 4, 0, 0]} />
        <Bar dataKey="neutro" fill="#f59e0b" barSize={20} radius={[4, 4, 0, 0]} />
        <Bar dataKey="positivo" fill="#22c55e" barSize={20} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Desempeño;