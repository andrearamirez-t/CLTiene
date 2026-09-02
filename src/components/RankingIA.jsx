import { API_BASE, apiFetch } from '../config';
import React, { useState, useEffect } from 'react';
import { useFilters } from '../FiltersContext';

const RankingIA = () => {
    const { filters, buildQuery } = useFilters();
    const [mostrarInforme, setMostrarInforme] = useState(false);
    const [asesores, setAsesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analisisHtml, setAnalisisHtml] = useState('');
    const [loadingIA, setLoadingIA] = useState(false);

    const obtenerRanking = async () => {
        setLoading(true);
        try {
            const params = buildQuery();
            const response = await apiFetch(`${API_BASE}/api/ranking_asesores${params ? `?${params}` : ''}`);
            const data = await response.json();
            setAsesores(data || []);
        } catch (error) {
            console.error("Error obteniendo ranking:", error);
            setAsesores([]);
        }
        setLoading(false);
    };

    const generarAnalisisIA = async () => {
        if (mostrarInforme) {
            setMostrarInforme(false);
            setAnalisisHtml('');
            return;
        }

        setLoadingIA(true);
        setMostrarInforme(true);
        try {
            const params = buildQuery();
            const query = params ? `?${params}` : '';
            const response = await apiFetch(`${API_BASE}/ia/analisis_ranking${query}`);
            const data = await response.json();
            const raw = data.result || 'No se obtuvo análisis.';
            setAnalisisHtml(raw
                .replace(/background-color\s*:\s*rgb\(15,\s*23,\s*42\)[^;"']*/g, 'background-color: #f8fafc')
                .replace(/color\s*:\s*rgb\(203,\s*213,\s*225\)[^;"']*/g, 'color: #334155')
                .replace(/border-bottom\s*:\s*1px solid rgb\(30,\s*41,\s*59\)[^;"']*/g, 'border-bottom: 1px solid #e2e8f0'));
        } catch (error) {
            console.error("Error en análisis IA:", error);
            setAnalisisHtml('Error al conectar con la IA.');
        }
        setLoadingIA(false);
    };

    useEffect(() => {
        obtenerRanking();
    }, [filters]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'sans-serif' }}>
            
            {loading && <div style={{ textAlign: 'center' }}>Cargando ranking...</div>}

            {Array.isArray(asesores) && asesores.map((asesor) => (
                <div key={asesor.posicion} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: 'white', border: '1px solid #e2e8f0',
                    borderRadius: '10px', padding: '12px 20px', fontSize: '13px'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>#{asesor.posicion} {asesor.nombre}</span>
                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                            📞 {asesor.llamadas} llamadas | 💰 {asesor.ventas} ventas
                        </div>
                    </div>
                    <div style={{
                        backgroundColor: '#FC3276', color: 'white', width: '35px', height: '35px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 'bold'
                    }}>
                        {asesor.puntos}
                    </div>
                </div>
            ))}

            <button
                onClick={generarAnalisisIA}
                disabled={loadingIA}
                style={{
                    width: '100%',
                    background: loadingIA
                        ? '#cbd5e0'
                        : mostrarInforme
                            ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                            : 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    cursor: loadingIA ? 'not-allowed' : 'pointer',
                    marginTop: '10px',
                    boxShadow: loadingIA ? 'none' : mostrarInforme
                        ? '0 4px 18px rgba(100,116,139,0.25)'
                        : '0 4px 18px rgba(252,50,118,0.35)',
                }}
            >
                {loadingIA ? '⌛ Analizando...' : mostrarInforme ? 'Cerrar Análisis' : 'Análisis Comparativo IA'}
            </button>

            {/* INFORME DE IA */}
            {mostrarInforme && (
                <div style={{
                    backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 40px',
                    border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                    <div style={{
                        borderLeft: '5px solid #FC3276',
                        background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
                        borderRadius: '0 10px 10px 0', padding: '14px 20px', marginBottom: '28px',
                    }}>
                        <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#FC3276', marginBottom: '4px' }}>
                            🏆 Análisis Comparativo de Asesores
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Comparación completa con los filtros activos del dashboard
                        </span>
                    </div>
                    {loadingIA ? (
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>⌛ Generando análisis con IA...</p>
                    ) : (
                        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}
                            dangerouslySetInnerHTML={{ __html: analisisHtml }} />
                    )}
                </div>
            )}
        </div>
    );
};

export default RankingIA;