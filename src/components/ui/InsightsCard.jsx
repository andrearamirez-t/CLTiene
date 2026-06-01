import React, { useState } from 'react';

const InsightsCard = () => {
    const [estado, setEstado] = useState('reposo');
    const [insights, setInsights] = useState('');
    const [error, setError] = useState('');

    const manejarClicIA = async () => {
        if (estado === 'completado') {
            setEstado('reposo');
            setInsights('');
            setError('');
            return;
        }

        setEstado('cargando');
        setError('');

        try {
            const response = await fetch("https://cltiene-backend-293865702055.us-central1.run.app/ia/generar_insights");
            const data = await response.json();

            if (!response.ok || !data.result) {
                setError('No fue posible generar el análisis. Intenta de nuevo.');
                setEstado('reposo');
                return;
            }

            const htmlLimpio = data.result
                .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
                .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
                .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0');
            setInsights(htmlLimpio);
            setEstado('completado');
        } catch (err) {
            setError('Error de conexión con el servidor. Intenta de nuevo.');
            setEstado('reposo');
        }
    };

    return (
        <div className="card-container" style={{ marginTop: '20px' }}>
            <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '15px' }}>
                Insights
            </div>

            {/* <div style={{
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
            </div> */}

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

            {error && (
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#be123c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    ⚠️ {error}
                </div>
            )}

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
                        <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, "<br/>") }} />
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
