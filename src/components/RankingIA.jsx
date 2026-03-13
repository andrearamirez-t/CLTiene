import React, { useState, useEffect } from 'react';

const RankingIA = () => {
    const [mostrarInforme, setMostrarInforme] = useState(false);
    const [asesores, setAsesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analisisData, setAnalisisData] = useState(null);
    const [loadingIA, setLoadingIA] = useState(false);

    const obtenerRanking = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/ranking_asesores");
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
            return;
        }

        setLoadingIA(true);
        try {
            const response = await fetch("http://localhost:8000/api/analisis_ranking_ia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ asesores: asesores })
            });
            const data = await response.json();
            setAnalisisData(data.resultado);
            setMostrarInforme(true);
        } catch (error) {
            console.error("Error en análisis IA:", error);
        }
        setLoadingIA(false);
    };

    useEffect(() => {
        obtenerRanking();
    }, []);

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
                    width: '100%', backgroundColor: loadingIA ? '#ccc' : '#FC3276',
                    color: 'white', padding: '12px', borderRadius: '10px', border: 'none',
                    fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
                }}
            >
                {loadingIA ? '⌛ Analizando...' : mostrarInforme ? 'Cerrar Análisis' : 'Análisis Comparativo IA'}
            </button>

            {/* INFORME DE IA (Aparece al dar clic) */}
            {mostrarInforme && analisisData && (
                <div style={{
                    marginTop: '20px', padding: '30px', backgroundColor: 'white',
                    borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ color: '#FC3276', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        🏆 Top Desempeño
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334' }}>
                        {analisisData.analisis_top}
                    </p>

                    <h4 style={{ marginTop: '20px', color: '#1e293b' }}>🔍 Oportunidades de Mejora</h4>
                    <ul style={{ fontSize: '13px', color: '#475569' }}>
                        {analisisData.mejoras?.map((m, i) => <li key={i} style={{ marginBottom: '5px' }}>{m}</li>)}
                    </ul>

                    <div style={{
                        marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc',
                        borderRadius: '10px', borderLeft: '4px solid #FC3276'
                    }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>🚀 Plan de Mentoría</h4>
                        <p style={{ fontSize: '13px', margin: 0 }}>{analisisData.mentoria}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RankingIA;