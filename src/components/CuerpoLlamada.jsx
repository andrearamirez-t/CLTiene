import React from 'react';

const CuerpoLlamada = ({ datos, transcripcion }) => {
    if (!datos) return null;

    const scorecard = datos.scorecard || {};
    const valores = Object.values(scorecard).filter(v => typeof v === 'number');
    const calificacion = valores.length
        ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
        : 0;

    const chat = Array.isArray(transcripcion) ? transcripcion : [];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '40px', marginBottom: '25px' }}>

                {/* Info izquierda */}
                <div style={{ width: '220px', flexShrink: 0, fontSize: '14px', color: '#1e293b' }}>
                    <p><strong>Resultado:</strong> {datos.resultado || 'N/A'}</p>
                    <p><strong>Plan:</strong> {datos.plan || 'N/A'}</p>

                    <div style={{
                        padding: '10px', backgroundColor: '#fefce8', borderRadius: '8px',
                        marginTop: '20px', border: '1px solid #fef08a', color: '#854d0e',
                        textAlign: 'center', fontWeight: 'bold'
                    }}>
                        {calificacion}/100 — {calificacion >= 80 ? 'Excelente' : calificacion >= 60 ? 'Bueno' : 'Regular'}
                    </div>

                    {Object.keys(scorecard).length > 0 && (
                        <div style={{ marginTop: '15px', fontSize: '12px' }}>
                            {Object.entries(scorecard).map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>{k}</span>
                                    <span style={{ fontWeight: 'bold', color: v >= 80 ? '#16a34a' : '#dc2626' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transcripción */}
                <div style={{ flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '30px', maxHeight: '300px', overflowY: 'auto' }}>
                    {chat.length > 0 ? chat.map((msg, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <span style={{
                                fontWeight: 'bold',
                                color: msg.role === 'Cliente' ? '#FC3276' : '#1e293b',
                                fontSize: '12px'
                            }}>
                                [{msg.role}]:
                            </span>
                            <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '6px' }}>{msg.text}</span>
                        </div>
                    )) : (
                        <p style={{ color: '#94a3b8', fontSize: '13px' }}>Sin transcripción disponible.</p>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, backgroundColor: '#dcfce7', padding: '15px', borderRadius: '10px', color: '#166534' }}>
                    <strong>✅ Aciertos:</strong>
                    <ul style={{ fontSize: '12px', marginTop: '5px' }}>
                        {(datos.aciertos || []).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>
                <div style={{ flex: 1, backgroundColor: '#fee2e2', padding: '15px', borderRadius: '10px', color: '#991b1b' }}>
                    <strong>❌ Errores:</strong>
                    <ul style={{ fontSize: '12px', marginTop: '5px' }}>
                        {(datos.errores || []).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CuerpoLlamada;