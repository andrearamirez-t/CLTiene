import React, { useState, useEffect } from 'react';


const RankingIA = () => {

    const [mostrarInforme, setMostrarInforme] = useState(false);
    const [asesores, setAsesores] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        obtenerRanking();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando ranking...
                </div>
            )}

            {Array.isArray(asesores) && asesores.map((asesor) => (
                <div key={asesor.posicion} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '13px'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>
                            #{asesor.posicion} {asesor.nombre}
                        </span>

                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                            📞 {asesor.llamadas} | 💰 {asesor.ventas} ventas | ⏳ {asesor.turnos} turnos
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#822BD2',
                        color: 'white',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {asesor.puntos}
                    </div>
                </div>
            ))}

            <button
                onClick={() => setMostrarInforme(!mostrarInforme)}
                style={{
                    width: '100%',
                    backgroundColor: '#FC3276',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontSize: '14px'
                }}
            >
                {mostrarInforme ? 'Cerrar Análisis' : 'Análisis Comparativo IA'}
            </button>

        </div>
    );
};

export default RankingIA;