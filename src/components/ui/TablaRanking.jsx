import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from "lucide-react";

const TablaRanking = ({ datos }) => {
    const [orden, setOrden] = useState({ columna: 'ex', direccion: 'desc' });

    
    const manejarOrden = (columna) => {
        const nuevaDireccion = orden.columna === columna && orden.direccion === 'desc' ? 'asc' : 'desc';
        setOrden({ columna, direccion: nuevaDireccion });
    };

    
    const datosOrdenados = [...datos].sort((a, b) => {
        let valA = a[orden.columna];
        let valB = b[orden.columna];

        
        if (typeof valA === 'string' && valA.includes('%')) valA = parseFloat(valA);
        if (typeof valB === 'string' && valB.includes('%')) valB = parseFloat(valB);

        if (valA < valB) return orden.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return orden.direccion === 'asc' ? 1 : -1;
        return 0;
    });

    const getColorExito = (valorStr) => {
        const valor = parseFloat(valorStr);
        if (valor >= 4) return '#10b981';
        if (valor >= 2) return '#f59e0b';
        return '#ef4444';
    };


    return (
        <div className="dark-table-card">
            <table className="dark-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>ID</th>
                        <th onClick={() => manejarOrden('n')} className="sortable">Cuenta {orden.columna === 'n' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('ll')} className="sortable">Llamadas {orden.columna === 'll' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('t')} className="sortable">Turnos_Prom {orden.columna === 't' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('p')} className="sortable">Palabras_Prom {orden.columna === 'p' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('e')} className="sortable">Efectivas {orden.columna === 'e' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('ex')} className="sortable">Éxito_% {orden.columna === 'ex' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                        <th onClick={() => manejarOrden('c')} className="sortable">Calidad_IA {orden.columna === 'c' && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</th>
                    </tr>
                </thead>
                <tbody>
                    {datosOrdenados.map((row, i) => (
                        <tr key={i}>
                            <td style={{ color: '#64748b', fontSize: '11px' }}>{i + 1}</td>
                            <td><strong>{row.n}</strong></td>
                            <td>{row.ll}</td>
                            <td>{row.t}</td>
                            <td>{row.p}</td>
                            <td>{row.e}</td>
                            <td>
                                <span className="status-cell" style={{ background: getColorExito(row.ex) }}>
                                    {row.ex}
                                </span>
                            </td>
                            <td>
                                <span className="status-cell" style={{ 
                                    background: row.c > 20 ? '#10b981' : row.c > 10 ? '#f59e0b' : '#ef4444' 
                                }}>
                                    {row.c}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaRanking;