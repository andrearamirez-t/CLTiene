import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useFilters } from '../../FiltersContext';

const DuracionChart = () => {
    const { filters, buildQuery } = useFilters();
    const [datos, setDatos] = useState([]);
    const params = buildQuery() || null

    useEffect(() => {

        fetch("https://cltiene-backend-293865702055.us-central1.run.app/duracion_llamadas" + (params ? `?${params}` : ""))
            .then(res => res.json())
            .then(data => setDatos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, [filters]);

    const rangos = {
        'Buzón':     '< 30 seg',
        'Muy Corta': '30s – 1 min',
        'Corta':     '1 – 2 min',
        'Media':     '2 – 5 min',
        'Larga':     '5+ min',
        'Sin Datos': 'Sin transcript.',
    };

    const TickPersonalizado = ({ x, y, payload }) => {
        const rango = rangos[payload.value] || '';
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={12} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight="bold">
                    {payload.value}
                </text>
                <text x={0} y={0} dy={26} textAnchor="middle" fill="#94a3b8" fontSize={9}>
                    {rango}
                </text>
            </g>
        );
    };

    return (
        <div className="card" style={{ height: '370px', padding: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '25px', paddingBottom: '10px' }}>
                Distribución por Duración
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={datos} margin={{ top: 20, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={<TickPersonalizado />} height={45} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            const rangos = {
                                'Buzón':     '< 30 seg',
                                'Muy Corta': '30 seg – 1 min',
                                'Corta':     '1 – 2 min',
                                'Media':     '2 – 5 min',
                                'Larga':     '5+ min',
                                'Sin Datos': 'Sin transcripción',
                            };
                            const tiempo = d.tiempo_promedio || rangos[d.label];
                            return (
                                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.label}</div>
                                    <div>Llamadas: <b>{d.valor}</b> ({d.porcentaje})</div>
                                    {tiempo && <div style={{ color: '#be123c', marginTop: 2 }}>⏱ {d.tiempo_promedio ? 'Promedio real' : 'Duración'}: <b>{tiempo}</b></div>}
                                </div>
                            );
                        }}
                    />

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