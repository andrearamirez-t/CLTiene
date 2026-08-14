import { API_BASE } from '../../config';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useFilters } from '../../FiltersContext';

// Estatus de Llamadas del marcador (Contestada / No Contestada / Ocupada).
// Es lo que pide la plantilla del contact center (ContactVox). Respeta los filtros.
const EstatusChart = () => {
    const { filters, buildQuery } = useFilters();
    const [datos, setDatos] = useState([]);
    const params = buildQuery() || null;

    useEffect(() => {
        fetch(`${API_BASE}/api/estatus_llamadas` + (params ? `?${params}` : ""))
            .then(res => res.json())
            .then(data => setDatos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, [filters]);

    return (
        <div className="card" style={{ height: '370px', padding: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '25px', paddingBottom: '10px' }}>
                Estatus de Llamadas
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={datos} margin={{ top: 20, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} height={40} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            return (
                                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.label}</div>
                                    <div>Llamadas: <b>{d.valor?.toLocaleString('es-CO')}</b> ({d.porcentaje})</div>
                                </div>
                            );
                        }}
                    />

                    <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={110}>
                        {datos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList
                            dataKey="porcentaje"
                            position="top"
                            style={{ fontSize: '11px', fill: '#334155', fontWeight: 'bold' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EstatusChart;
