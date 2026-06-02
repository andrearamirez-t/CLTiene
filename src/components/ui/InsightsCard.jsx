import React, { useState, useRef, useEffect } from 'react';

const InsightsCard = () => {
    const [estado, setEstado] = useState('reposo');
    const [insights, setInsights] = useState('');
    const [error, setError] = useState('');
    const contenedorRef = useRef(null);

    useEffect(() => {
        if (contenedorRef.current) {
            contenedorRef.current.innerHTML = estado === 'completado' ? insights : '';
        }
    }, [estado, insights]);

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

            <div
                style={{
                    display: estado === 'completado' ? 'block' : 'none',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#334155'
                }}
                ref={contenedorRef}
            />

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