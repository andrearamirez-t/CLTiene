import React from 'react';

const AnalisisRechazosResult = () => {
    return (
        <div style={{
            marginTop: '20px',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            color: '#1e293b',
            lineHeight: '1.6'
        }}>
            <h3 style={{ color: '#e91e63', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                Distribución y Patrones de Rechazo ❌
            </h3>

            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', color: '#0f172a' }}>1. Motivos Principales de Rechazo:</p>
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>No Interesa:</strong> 119 casos (49.6%)</li>
                    <li><strong>Sin Motivo:</strong> 20 casos (26.4%)</li>
                    <li><strong>Otros motivos (Precio, Ya tiene servicio, Confusión):</strong> 44 casos (23.8%)</li>
                </ul>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ fontWeight: 'bold', color: '#0f172a' }}>Correlaciones detectadas:</p>
                <p style={{ fontSize: '14px' }}>
                    • Las llamadas de <strong>duración media</strong> tienden a producir menos rechazos debido a una mayor posibilidad de explicar beneficios.
                </p>
                <p style={{ fontSize: '14px' }}>
                    • Existe una falta de personalización: el motivo "No interesa" suele aparecer en los primeros 30 segundos.
                </p>
            </div>

            <h3 style={{ color: '#e91e63', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                Estrategias para Reducir Rechazos en un 20%
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1px 1fr', gap: '15px' }}>
                <div style={{ backgroundColor: '#e91e63' }}></div>
                <div>
                    <p style={{ margin: '5px 0' }}><strong>• Capacitación de Asesores:</strong> Enfoque en técnicas de venta consultiva para rebatir el "No interesa" rápido.</p>
                    <p style={{ margin: '5px 0' }}><strong>• Scripts Personalizados:</strong> Ajustar el saludo inicial para generar valor desde los primeros 5 segundos.</p>
                    <p style={{ margin: '5px 0' }}><strong>• Feedback Constante:</strong> Analizar grabaciones de rechazos específicos para identificar patrones de tono de voz.</p>
                </div>
            </div>
        </div>
    );
};

export default AnalisisRechazosResult;