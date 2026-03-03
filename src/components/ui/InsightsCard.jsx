import React, { useState } from 'react';

const InsightsCard = () => {
    const [estado, setEstado] = useState('reposo'); 

    const manejarClicIA = () => {
        if (estado === 'completado') {
            
            setEstado('reposo');
        } else {
           
            setEstado('cargando');
            setTimeout(() => {
                setEstado('completado');
            }, 1500);
        }
    };

    return (
        <div className="card-container" style={{ marginTop: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '15px' }}>
                Insights
            </div>

            {/* RECUADRO SUPERIOR */}
            <div style={{ 
                background: '#f8f9fa', 
                border: '2px solid #FC3276', 
                borderRadius: '16px', 
                padding: '20px',
                marginBottom: '20px'
            }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1e293b' }}>
                    Para aumentar el éxito
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#334155' }}>
                    <li style={{ marginBottom: '8px' }}>• 3,298 contestadas de 3,299 (100%)</li>
                    <li style={{ marginBottom: '8px' }}>• 185 efectivas (5.6% de contestadas)</li>
                    <li style={{ marginBottom: '8px' }}>• 62 ventas cerradas (1.9%)</li>
                    <li>• Calidad promedio: <strong>12/100</strong></li>
                </ul>
            </div>

            {/*  BOTÓN DINÁMICO */}
            <button 
                onClick={manejarClicIA}
                disabled={estado === 'cargando'}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: estado === 'completado' ? '#FD7751' : '#FC3276', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: estado === 'cargando' ? 'not-allowed' : 'pointer',
                    marginBottom: '20px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
            >
                {estado === 'reposo' && "Generar Insights con IA"}
                {estado === 'cargando' && "Analizando datos..."}
                {estado === 'completado' && "Limpiar Análisis"}
            </button>

            {/* RECUADRO INFERIOR */}
            {estado === 'completado' && (
                <div style={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '25px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                        <p><strong>1. Optimización del Tiempo de Llamada ⏰:</strong> Duración media de 1017s.</p>
                        <p><strong>2. Aumento de Asignaciones 💡:</strong> 2118 planes no identificados (64%).</p>
                        <p><strong>3. Sistemas Automáticos 📞:</strong> 205 casos de buzón de voz detectados.</p>
                        <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                            Análisis completado para CALL CENTER CL TIENE SOLUCIONES.
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default InsightsCard;