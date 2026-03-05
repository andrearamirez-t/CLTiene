import React, { useState } from 'react';

const MetricasGrid = ({ data }) => {
    const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

    const getStatusColor = (val) => {
        const lowerVal = val.toString().toLowerCase();
        if (['sí', 'venta', 'excelente'].some(k => lowerVal.includes(k))) return '#2ecc71';
        if (['no', 'bajo'].some(k => lowerVal.includes(k))) return '#FC3276';
        return '#1e293b';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ borderLeft: '4px solid #e2e8f0', paddingLeft: '15px' }}>
                        <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: getStatusColor(item.val) }}>{item.val}</p>
                    </div>
                ))}
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button 
                    onClick={() => setMostrarAnalisis(!mostrarAnalisis)}
                    style={{ 
                        padding: '12px 25px', 
                        backgroundColor: '#FC3276', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '10px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                    }}
                >
                    {mostrarAnalisis ? "✖ Ocultar Análisis" : "⚙️ Analizar llamada con IA"}
                </button>
            </div>

            {/* CUADRO DE ANÁLISIS */}
            {mostrarAnalisis && (
                <div style={{ 
                    width: '100%', 
                    backgroundColor: 'white', 
                    border: '1.5px solid #fc3474', 
                    borderRadius: '15px',
                    padding: '25px',
                    marginTop: '10px',
                    boxShadow: '0 4px 12px rgba(252, 52, 116, 0.05)'
                }}>
                    <h3 style={{ fontSize: '14px', color: '#fc3474', marginBottom: '20px', fontWeight: '800' }}>📊 ANÁLISIS DETALLADO IA</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', fontSize: '12px', color: '#334155' }}>
                        
                        
                        <div>
                            <p><b>1. RESUMEN:</b> La llamada se realizó pero no se estableció contacto directo con el cliente, terminando en el buzón de voz.</p>
                            <p><b style={{ color: '#FC3276' }}>2. RESULTADO:</b> Sin contacto con el cliente; la llamada culminó en el buzón de voz.</p>
                        </div>

                     
                        <div>
                            <p><b style={{ color: '#2ecc71' }}>3. ACIERTOS:</b></p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Intento de llamada realizado.</li>
                                <li>Registro de contacto exitoso.</li>
                            </ul>
                            <p><b style={{ color: '#FC3276' }}>4. ERRORES:</b></p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>No se ofreció saludo apropiado.</li>
                                <li>Falta de identificación del plan o servicio.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricasGrid;