import React, { useState } from 'react';

const RankingIA = () => {
    
    const [mostrarInforme, setMostrarInforme] = useState(false);

    const asesores = [
        { posicion: 1, nombre: "Dayana Alexandra Marulanda Feo", llamadas: 338, ventas: 7, porcentaje: 2.3, turnos: 4.5, puntos: 28 },
        { posicion: 2, nombre: "Jenifer Andrea Rodriguez Cespedes", llamadas: 435, ventas: 8, porcentaje: 1.8, turnos: 3.2, puntos: 26 },
        { posicion: 3, nombre: "Jimmy Alexander Rusinque Poveda", llamadas: 455, ventas: 2, porcentaje: 0.4, turnos: 4.2, puntos: 24 },
        { posicion: 4, nombre: "Melany Camila Ramirez", llamadas: 388, ventas: 21, porcentaje: 5.4, turnos: 5.1, puntos: 23 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* LISTA DE ASESORES */}
            {asesores.map((asesor) => (
                <div key={asesor.posicion} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
                    padding: '12px 20px', fontSize: '13px'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>#{asesor.posicion} {asesor.nombre}</span>
                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                            📞 {asesor.llamadas} | 💰 {asesor.ventas} ventas | ⏳ {asesor.turnos} turnos
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: '#822BD2', color: 'white', width: '35px', height: '35px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                        {asesor.puntos}
                    </div>
                </div>
            ))}

            {/* BOTÓN DE ACCIÓN */}
            <button 
                onClick={() => setMostrarInforme(!mostrarInforme)}
                style={{
                    width: '100%', backgroundColor: '#FC3276', color: 'white', padding: '12px',
                    borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                    marginTop: '10px', fontSize: '14px'
                }}
            >
                {mostrarInforme ? 'Cerrar Análisis' : ' Análisis Comparativo IA'}
            </button>

            {/* SECCIÓN DEL INFORME */}
            {mostrarInforme && (
                <div style={{
                    marginTop: '20px', padding: '30px', backgroundColor: 'white',
                    border: '1px solid #e2e8f0', borderRadius: '15px', textAlign: 'left',
                    fontSize: '14px', color: '#1e293b', lineHeight: '1.6'
                }}>
                    <h2 style={{ fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                        📊 Informe de Operaciones del Call Center
                    </h2>

                    {/* TOP 3 ASESORES */}
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#FC3276' }}>1. 🏆 TOP 3 ASESORES</h3>
                        <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>1. Dayana Alexandra Marulanda Feo</strong>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#475569' }}>
                                    <span style={{ color: '#FC3276' }}>●</span> <strong>Por qué es la mejor:</strong> Tiene un excelente balance entre alta carga de llamadas y ventas.
                                </p>
                            </li>
                            <li>
                                <strong>2. Jenifer Andrea Rodriguez Cespedes</strong>
                                <p style={{ margin: '5px 0', fontSize: '13px', color: '#475569' }}>
                                    <span style={{ color: '#FC3276' }}>●</span> <strong>Qué hace bien:</strong> Sobresale en el ofrecimiento de soluciones y cierre de servicio.
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* OPORTUNIDADES DE MEJORA */}
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ color: '#FC3276' }}>2. 📈 OPORTUNIDADES DE MEJORA</h3>
                        <div style={{ padding: '15px', backgroundColor: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                            <p><strong>Jimmy Alexander Rusinque:</strong> Bajo éxito en ventas (0.44%). Necesita mejorar en manejo de objeciones y cierre.</p>
                        </div>
                    </div>

                    {/* ANÁLISIS INDIVIDUAL */}
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ color: '#FC3276' }}>3. 🧬 ANÁLISIS INDIVIDUAL POR ASESOR</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <strong>Dayana Alexandra Marulanda Feo</strong>
                            <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                <p style={{ color: '#059669', margin: '2px 0' }}>✅ Fortalezas: Alta cantidad de llamadas y buen manejo de duración.</p>
                                <p style={{ color: '#FC3276', margin: '2px 0' }}>❌ Debilidades: Baja índice en la explicación de beneficios (2%).</p>
                            </div>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '40px' }}>
                        Generado por Agente IA PRO • {new Date().toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RankingIA;