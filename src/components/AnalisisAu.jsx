import { API_BASE } from '../config';
import React, { useState } from 'react';
import { useFilters } from '../FiltersContext';

const AnalisisAu = () => {

    const { buildQuery } = useFilters();

    const [tipo, setTipo] = useState('Resumen Ejecutivo');
    const [cargando, setCargando] = useState(false);
    const [resultado, setResultado] = useState("");

    const params = buildQuery() || null;

    const opciones = [
        "Resumen Ejecutivo",
        "Oportunidades de Mejora",
        "Análisis de Rechazos",
        "Mejores Prácticas",
        "Patrones de Ventas",
        "Plan de Coaching",
        "Recomendaciones Semanales",
        "Predicción de Tendencias"
    ];

    const handleGenerar = async () => {

        setCargando(true);
        setResultado("");

        const mapTipos = {
            "Resumen Ejecutivo": "resumen_ejecutivo",
            "Oportunidades de Mejora": "oportunidades_mejora",
            "Análisis de Rechazos": "analisis_rechazos",
            "Mejores Prácticas": "mejores_practicas",
            "Patrones de Ventas": "patrones_ventas",
            "Plan de Coaching": "plan_coaching",
            "Recomendaciones Semanales": "recomendaciones_semanales",
            "Predicción de Tendencias": "prediccion_tendencias"
        };

        try {

            const response = await fetch(
                `${API_BASE}/ia/analisis_automatico` +
                (params
                    ? `?${params}&tipo_analisis=${mapTipos[tipo]}`
                    : `?tipo_analisis=${mapTipos[tipo]}`)
            );

            const data = await response.json();

            setResultado(data.result || "No se recibió respuesta de la IA.");

        } catch (error) {

            console.error("Error llamando a la IA:", error);
            setResultado("No fue posible generar el análisis.");

        }

        setCargando(false);

    };


    return (

        <div style={{ padding: '20px', width: '100%' }}>

            {/* SELECTOR */}
            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#475569' }}>
                Tipo:
            </p>

            <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: '#1e293b',
                        color: 'white',
                        border: '2px solid #FC3276',
                        borderRadius: '10px',
                        appearance: 'none',
                        cursor: 'pointer'
                    }}
                >

                    {opciones.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}

                </select>

                <div
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '15px',
                        color: 'white',
                        pointerEvents: 'none'
                    }}
                >
                    ▼
                </div>

            </div>


            {/* BOTÓN */}
            <button
                onClick={handleGenerar}
                disabled={cargando}
                style={{
                    width: '100%',
                    padding: '15px',
                    background: cargando
                        ? '#cbd5e0'
                        : 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    boxShadow: cargando ? 'none' : '0 4px 18px rgba(252,50,118,0.35)',
                }}
            >
                {cargando ? '⌛ Analizando...' : 'Generar'}
            </button>


            {/* RESULTADO IA */}
            <div style={{ marginTop: '20px' }}>

                {cargando && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#e91e63' }}>
                        <p>La IA está procesando los datos...</p>
                    </div>
                )}

                {!cargando && resultado && (

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        padding: '36px 40px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    }}>
                        <div style={{
                            borderLeft: '5px solid #FC3276',
                            background: 'linear-gradient(90deg, #fff5f9 0%, transparent 80%)',
                            borderRadius: '0 10px 10px 0',
                            padding: '14px 20px',
                            marginBottom: '28px',
                        }}>
                            <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#FC3276', marginBottom: '4px' }}>
                                🤖 {tipo}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Generado con los filtros activos del dashboard
                            </span>
                        </div>
                        <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '14px' }}
                            dangerouslySetInnerHTML={{ __html: resultado }} />
                    </div>

                )}

            </div>

        </div>

    );

};

export default AnalisisAu;