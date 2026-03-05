import React, { useState } from 'react';

const ReporteCompleto = () => {
    const [mostrarResumen, setMostrarResumen] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            
            <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '15px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📄</span>
                    <h2 style={{ fontSize: '18px', color: '#1e293b', margin: 0, fontWeight: '600' }}>
                        Reporte Ejecutivo Completo
                    </h2>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Incluye: KPIs • Rendimiento por asesor • Patrones • Rechazos • Calidad • Recomendaciones • Plan de acción
                </p>
                <button 
                    onClick={() => setMostrarResumen(!mostrarResumen)}
                    style={{
                        width: '100%', backgroundColor: '#FC3276', color: 'white', padding: '12px',
                        borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    {mostrarResumen ? ' Ocultar Reporte' : ' Generar Reporte'}
                </button>
            </div>

            {/* CONTENIDO DEL REPORTE */}
            {mostrarResumen && (
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '15px',
                    padding: '40px',
                    color: '#1e293b',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>
                        # REPORTE EJECUTIVO CALL CENTER CL TIENE SOLUCIONES
                    </span>

                    {/*  RESUMEN EJECUTIVO */}
                    <section style={{ marginTop: '20px' }}>
                        <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>1. Resumen Ejecutivo</h3>
                        <p style={{ color: '#475569', textAlign: 'justify' }}>
                            En el último periodo, "CL Tiene Soluciones" ha enfrentado varios desafíos en su operación de call center, 
                            reflejados en una tasa de contacto del 0.0% y una tasa de conversión baja del 2.19%. Esto indica un área 
                            significativa de mejora en la gestión de contactos pertinentes y la optimización de procesos para cerrar ventas.
                        </p>
                    </section>

                    {/*  KPIs */}
                    <section style={{ marginTop: '30px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>2. KPIs Principales</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left', color: '#64748b' }}>
                                    <th style={{ padding: '10px' }}>KPI</th>
                                    <th style={{ padding: '10px' }}>Valor</th>
                                    <th style={{ padding: '10px' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px' }}>Total Llamadas</td>
                                    <td style={{ padding: '10px' }}>2,556</td>
                                    <td style={{ padding: '10px', color: '#FC3276' }}>🚨 Baja Gestión</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px' }}>% Ventas</td>
                                    <td style={{ padding: '10px' }}>2.19%</td>
                                    <td style={{ padding: '10px', color: '#FC3276' }}>⚠️ Bajo</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px' }}>Clasificación Completa</td>
                                    <td style={{ padding: '10px' }}>❌ Parcial</td>
                                    <td style={{ padding: '10px', color: '#eab308' }}>🛠️ Mejorar</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* RENDIMIENTO POR ASESOR */}
                    <section style={{ marginTop: '30px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>3. Rendimiento por Asesor</h3>
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #e2e8f0', pb: '5px' }}>
                                <span>Asesor</span>
                                <span>Éxito %</span>
                            </div>
                            {[
                                { n: "Melany Camila Ramirez", e: "5.41%" },
                                { n: "Marjorie Villadiego", e: "4.15%" },
                                { n: "Dayana Marulanda", e: "1.76%" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span>{item.n}</span>
                                    <span style={{ fontWeight: 'bold', color: '#FC3276' }}>{item.e}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default ReporteCompleto;