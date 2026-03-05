import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, LabelList 
} from 'recharts';

const ResultadosChart = ({ datos }) => {
    const dataFormateada = datos.map(item => ({
        name: item.nombre,
        valor: parseInt(item.valor.split(' ')[0].replace('.', '')),
        etiquetaCompleta: item.valor // Guardamos "1.322 (40.1%)" para mostrarlo
    }));

    return (
        <div className="card" style={{ height: '500px', padding: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '25px', paddingBottom: '10px' }}>
                Distribución de Resultados
            </div>
            
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    layout="vertical"
                    data={dataFormateada}
                    margin={{ top: 5, right: 80, left: 40, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="colorRes" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#FC3276" stopOpacity={1}/>
                            <stop offset="95%" stopColor="#FD7751" stopOpacity={1}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f1f5f9" />
                    
                    <XAxis 
                        type="number" 
                        domain={[0, 'dataMax + 200']} 
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 11, fill: '#64748b' }} 
                        width={120}
                        axisLine={false}
                        tickLine={false}
                    />
                    
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    
                    <Bar 
                        dataKey="valor" 
                        fill="url(#colorRes)" 
                        radius={[0, 4, 4, 0]} 
                        barSize={20}
                    >
                        <LabelList 
                            dataKey="etiquetaCompleta" 
                            position="right" 
                            style={{ fontSize: '10px', fill: '#64748b', fontWeight: '500' }} 
                            offset={10}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '11px', color: '#94a3b8' }}>
                Cantidad
            </div>
        </div>
    );
};

export default ResultadosChart;