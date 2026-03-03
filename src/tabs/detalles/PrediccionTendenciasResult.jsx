import React from 'react';

const PrediccionTendenciasResult = () => {
    return (
        <div style={{
            marginTop: '20px',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            color: '#1e293b'
        }}>
            <h3 style={{ color: '#e91e63', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '20px' }}>
                Proyección de KPIs para el Próximo Mes 🔮
            </h3>

            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1, padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', fontWeight: 'bold' }}>META DE CONTACTO</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>+10-15%</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>Con ajuste de horarios</p>
                </div>
                <div style={{ flex: 1, padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>CONVERSIÓN ESPERADA</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>3.5%</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>Objetivo mensual</p>
                </div>
            </div>

            {/* Análisis de Riesgos Futuros */}
            <div style={{ marginBottom: '25px' }}>
                <p style={{ fontWeight: 'bold', color: '#e11d48' }}>⚠️ Radar de Riesgos Detectados:</p>
                <ul style={{ fontSize: '14px', lineHeight: '1.7' }}>
                    <li><strong>Volumen de "Sin Clasificar":</strong> 483 llamadas actuales podrían sesgar el análisis futuro si no se corrigen.</li>
                    <li><strong>Baja efectividad en planes específicos:</strong> Un 66% de las menciones de planes no están identificadas.</li>
                </ul>
            </div>

            {/* Acciones Preventivas Sugeridas por IA */}
            <div style={{ padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px', color: 'white' }}>
                <p style={{ fontWeight: 'bold', color: '#e91e63', marginBottom: '10px' }}>🛡️ Acciones Preventivas Recomendadas:</p>
                <div style={{ fontSize: '13px' }}>
                    <p>• <strong>Campañas de Reactivación:</strong> Contactar a usuarios en bucle de "Sin Clasificar" vía SMS o email.</p>
                    <p>• <strong>Auditorías de Calidad:</strong> Centrarse en puntos críticos como el saludo y beneficios para mejorar la retención.</p>
                    <p>• <strong>Ajuste de Propuesta:</strong> Alinear la oferta con los intereses reales detectados en las llamadas.</p>
                </div>
            </div>
        </div>
    );
};

export default PrediccionTendenciasResult;