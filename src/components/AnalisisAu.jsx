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
                "http://localhost:8000/ia/analisis_automatico" +
                (params
                    ? `?${params}&tipo_analisis=${mapTipos[tipo]}`
                    : `?tipo_analisis=${mapTipos[tipo]}`)
            );

            const data = await response.json();

            setResultado(data.result[0] || "No se recibió respuesta de la IA.");

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
                style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#FC3276',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >

                {cargando ? 'Analizando...' : 'Generar'}

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
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        lineHeight: '1.7',
                        color: '#334155'
                    }}>

                        <h3 style={{ color: '#FC3276', marginTop: 0 }}>
                            Análisis IA
                        </h3>

                        {/* <p>{resultado}</p> */}
                        <div dangerouslySetInnerHTML={{ __html: resultado }} />

                    </div>

                )}

            </div>

        </div>

    );

};

export default AnalisisAu;