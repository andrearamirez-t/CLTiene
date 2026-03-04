import React, { useState } from 'react';
import ControlesAnalisis from '../components/ui/ControlesAnalisis';

const Rendimiento = () => {
    const [asesorSeleccionado, setAsesorSeleccionado] = useState("");


    const datosAsesores = [
        { n: "Melany Camila Ramirez", llamadas: 422, turnos: 5.6, palabras: 21, efectividad: "4.99%", color: "#22c55e" },
        { n: "Maria de Villadiego", llamadas: 412, turnos: 5.4, palabras: 14, efectividad: "3.41%", color: "#22c55e" },
        { n: "Jenifer Andrea Rodriguez", llamadas: 651, turnos: 5.1, palabras: 11, efectividad: "1.69%", color: "#eab308" },
        { n: "Dayana Alexandra Marulanda", llamadas: 593, turnos: 4.4, palabras: 8, efectividad: "1.35%", color: "#ef4444" }
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
                Rendimiento por Agente
            </h2>


            <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                marginBottom: '24px'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', fontSize: '13px' }}>

                    <thead>
                        <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left' }}>
                            <th style={{ padding: '16px', color: '#64748b', fontSize: '12px' }}>#</th>


                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Cuenta</span>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Filtrar..."
                                            style={{
                                                width: '100%',
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '4px',
                                                color: 'white',
                                                padding: '4px 8px 4px 24px', 
                                                fontSize: '11px',
                                                outline: 'none'
                                            }}
                                        />

                                        <span style={{ position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '12px' }}>🔍</span>
                                    </div>
                                </div>
                            </th>


                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Llamadas</span>
                                    <input
                                        type="number"
                                        style={{
                                            width: '60px',
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '4px',
                                            color: 'white',
                                            padding: '4px',
                                            fontSize: '11px'
                                        }}
                                    />
                                </div>
                            </th>


                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Turnos_Prom</span>
                                    <input
                                        type="number"
                                        style={{
                                            width: '60px',
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '4px',
                                            color: 'white',
                                            padding: '4px',
                                            fontSize: '11px'
                                        }}
                                    />
                                </div>
                            </th>

                            <th style={{ padding: '16px', fontSize: '12px' }}>Palabras_Prom</th>
                            <th style={{ padding: '16px', fontSize: '12px' }}>Efectivas</th>


                            <th style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Éxito_%</span>
                                    <select style={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '4px',
                                        color: 'white',
                                        padding: '3px',
                                        fontSize: '10px'
                                    }}>
                                        <option>Todos</option>
                                        <option>Alto</option>
                                        <option>Bajo</option>
                                    </select>
                                </div>
                            </th>

                            <th style={{ padding: '16px', fontSize: '12px' }}>Calidad_IA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {datosAsesores.map((agente, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
                                <td style={{ padding: '16px', color: '#64748b' }}>{index}</td>
                                <td style={{ padding: '16px', fontWeight: '500' }}>{agente.n}</td>
                                <td style={{ padding: '16px' }}>{agente.llamadas}</td>
                                <td style={{ padding: '16px' }}>{agente.turnos}</td>
                                <td style={{ padding: '16px' }}>{agente.palabras}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{
                                        backgroundColor: agente.color,
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        fontWeight: 'bold',
                                        fontSize: '11px'
                                    }}>
                                        {agente.efectividad}
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}></td>
                                <td style={{ padding: '16px' }}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <ControlesAnalisis
                asesores={datosAsesores}
                seleccionado={asesorSeleccionado}
                onSeleccionar={setAsesorSeleccionado}
            />


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>Calidad del Asesor</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        [Espacio para Gráfica de Barras]
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>Distribución de Turnos</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        [Espacio para Histograma]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rendimiento;