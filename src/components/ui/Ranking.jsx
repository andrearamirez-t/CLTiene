import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from "lucide-react";

const Ranking = ({ datos }) => {
    const [orden, setOrden] = useState({ columna: 'ex', direccion: 'desc' });

    const manejarOrden = (columna) => {
        const nuevaDireccion = orden.columna === columna && orden.direccion === 'desc' ? 'asc' : 'desc';
        setOrden({ columna, direccion: nuevaDireccion });
    };

    const datosOrdenados = [...datos].sort((a, b) => {
        let valA = a[orden.columna === 'Cuenta' ? 'n' : 
                     orden.columna === 'Llamadas' ? 'll' : 
                     orden.columna === 'Turnos_Prom' ? 't' : 
                     orden.columna === 'Efectivas' ? 'e' : 'ex'];
        let valB = b[orden.columna === 'Cuenta' ? 'n' : 
                     orden.columna === 'Llamadas' ? 'll' : 
                     orden.columna === 'Turnos' ? 't' : 
                     orden.columna === 'Efectivas' ? 'e' : 'ex'];

        if (typeof valA === 'string' && valA.includes('%')) valA = parseFloat(valA);
        if (typeof valB === 'string' && valB.includes('%')) valB = parseFloat(valB);

        if (valA < valB) return orden.direccion === 'asc' ? -1 : 1;
        if (valA > valB) return orden.direccion === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="dark-table-card">
            <table className="dark-table">
                <thead>
                    <tr>
                        <th className="id-col">#</th>
                        {['Cuenta', 'Llamadas', 'Turnos_Prom', 'Palabras_Prom', 'Efectivas', 'Exito_%', 'Calidad_IA'].map((col) => (
                            <th key={col} onClick={() => manejarOrden(col)} className="sortable-header">
                                {col} {orden.columna === col && (orden.direccion === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datosOrdenados.map((row, i) => (
                        <tr key={i}>
                            <td className="id-cell">{i}</td>
                            <td className="text-white">{row.n}</td>
                            <td>{row.ll}</td>
                            <td>{row.t}</td>
                            <td>{row.e}</td>
                            <td className="status-cell" style={{ 
                                background: parseFloat(row.ex) > 3 ? '#065f46' : 
                                            parseFloat(row.ex) > 1.5 ? '#f59e0b' : '#9f1239' 
                            }}>
                                {row.ex}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ranking;