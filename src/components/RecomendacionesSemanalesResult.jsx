import React from 'react';

const RecomendacionesSemanalesResult = () => {
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
                Prioridades Semanales de la IA 📅
            </h3>

            {/* Bloque de Alertas Críticas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div style={{ padding: '15px', backgroundColor: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#e11d48' }}>🚨 Alerta de Contactabilidad</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>Tasa actual: 0.0%. Es crítico revisar las bases de datos de inmediato.</p>
                </div>
                <div style={{ padding: '15px', backgroundColor: '#fefce8', borderRadius: '10px', border: '1px solid #fef08a' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#a16207' }}>⚠️ Riesgo de Desmotivación</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>Asesores con baja tasa de éxito requieren feedback positivo urgente.</p>
                </div>
            </div>

            {/* Objetivos por Asesor */}
            <div style={{ marginBottom: '25px' }}>
                <p style={{ fontWeight: 'bold', borderLeft: '4px solid #e91e63', paddingLeft: '10px' }}>Objetivos por Asesor Estrella:</p>
                <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}>• <strong>Melany Ramirez:</strong> Mantener ritmo y buscar incrementar conversión en un 1-2%.</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}>• <strong>Marjorie Villadiego:</strong> Revisar casos específicos para entender fugas de venta.</p>
                </div>
            </div>

            {/* Recomendaciones Concretas */}
            <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>💡 Acciones Recomendadas:</p>
                <ul style={{ fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                    <li>Depurar bases de datos para evitar intentos fallidos.</li>
                    <li>Talleres de objeciones enfocados en el "No interesa".</li>
                    <li>Diversificar ventas promocionando el "Plan Mascotas".</li>
                </ul>
            </div>
        </div>
    );
};

export default RecomendacionesSemanalesResult;