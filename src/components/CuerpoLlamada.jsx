import React from 'react';

const CuerpoLlamada = ({ datos, transcripcion }) => (
    <div style={{ display: 'flex', gap: '40px', marginBottom: '25px' }}>
        {/* Datos de la Llamada */}
        <div style={{ width: '220px', flexShrink: 0, fontSize: '14px', color: '#1e293b' }}>
            <p style={{ margin: '6px 0' }}><strong>Resultado:</strong> {datos.resultado}</p>
            <p style={{ margin: '6px 0' }}><strong>Plan:</strong> {datos.plan}</p>
            <p style={{ margin: '6px 0' }}><strong>Duración:</strong> {datos.duracion}</p>
            <p style={{ margin: '6px 0' }}><strong>Turnos:</strong> {datos.turnos}</p>
            
            <div style={{ 
                padding: '10px', backgroundColor: '#fefce8', borderRadius: '8px', 
                marginTop: '20px', border: '1px solid #fef08a', color: '#854d0e', 
                textAlign: 'center', fontWeight: 'bold'
            }}>
                ⚠️ {datos.calificacion}/100 Regular
            </div>
        </div>

        {/* Transcripción */}
        <div style={{ flex: 1, borderLeft: '1px solid #f1f5f9', paddingLeft: '30px', fontSize: '14px' }}>
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>[Cliente]:</p>
                <p style={{ color: '#64748b', margin: 0 }}>{transcripcion.cliente}</p>
            </div>
            <div>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>[Asesor]:</p>
                <p style={{ color: '#1e293b', margin: 0 }}>{transcripcion.asesor}</p>
            </div>
        </div>
    </div>
);

export default CuerpoLlamada;