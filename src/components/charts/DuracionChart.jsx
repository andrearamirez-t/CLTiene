import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useFilters } from '../../FiltersContext';

const DuracionChart = () => {
    const { filters, buildQuery } = useFilters();
    const [datos, setDatos] = useState([]);
    const params = buildQuery() || null

    useEffect(() => {

        fetch("http://localhost:8000/duracion_llamadas" + (params ? `?${params}` : ""))
            .then(res => res.json())
            .then(data => setDatos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, [filters]);

    return (
        <div className="card" style={{ height: '350px', padding: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '25px', paddingBottom: '10px' }}>
                Distribución por Duración
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={datos} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />

                    <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={120}>
                        {datos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList
                            dataKey="valor"
                            position="center"
                            content={(props) => (
                                <text x={props.x + props.width / 2} y={props.y + 20} fill="white" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                    {props.value}
                                </text>
                            )}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DuracionChart;