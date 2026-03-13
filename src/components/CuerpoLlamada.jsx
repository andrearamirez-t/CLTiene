import React from 'react';

const CuerpoLlamada = ({ datos, transcripcion }) => {
    if (!datos || !transcripcion) return null;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '25px' }}>
                <div style={{ width: '220px', flexShrink: 0, fontSize: '14px', color: '#1e293b' }}>
                    <p><strong>Resultado:</strong> {datos.resultado || 'N/A'}</p>
                    <p><strong>Plan:</strong> {datos.plan || 'N/A'}</p>
                    <p><strong>Duración:</strong> {datos.duracion || '0 min'}</p>
                    
                    <div style={{ 
                        padding: '10px', backgroundColor: '#fefce8', borderRadius: '8px', 
                        marginTop: '20px', border: '1px solid #fef08a', color: '#854d0e', 
                        textAlign: 'center', fontWeight: 'bold'
                    }}>
                        {datos.calificacion}/100 - {datos.calificacion > 80 ? 'Excelente' : 'Regular'}
                    </div>
                </div>

                <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '30px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontWeight: 'bold', color: '#FC3276', margin: '0' }}>[Cliente]:</p>
                        <p style={{ color: '#64748b' }}>{transcripcion.cliente}</p>
                    </div>
                    <div>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', margin: '0' }}>[Asesor]:</p>
                        <p style={{ color: '#1e293b' }}>{transcripcion.asesor}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, backgroundColor: '#dcfce7', padding: '15px', borderRadius: '10px', color: '#166534' }}>
                    <strong>✅ Aciertos:</strong>
                    <ul style={{ fontSize: '12px', marginTop: '5px' }}>
                        {datos.aciertos?.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>
                <div style={{ flex: 1, backgroundColor: '#fee2e2', padding: '15px', borderRadius: '10px', color: '#991b1b' }}>
                    <strong>❌ Errores:</strong>
                    <ul style={{ fontSize: '12px', marginTop: '5px' }}>
                        {datos.errores?.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CuerpoLlamada;