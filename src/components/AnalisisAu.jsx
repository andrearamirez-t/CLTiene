import React, { useState } from 'react';

import ResumenEjecutivoResult from './ResumenEjecutivoResult';
import OportunidadesMejoraResult from './OportunidadesMejoraResult';
import AnalisisRechazosResult from './AnalisisRechazosResult'; 
import MejoresPracticasResult from './MejoresPracticasResult';
import PatronesVentasResult from './PatronesVentasResult';
import PlanCoachingResult from './PlanCoachingResult';
import RecomendacionesSemanalesResult from './RecomendacionesSemanalesResult';
import PredicciontendenciasResult from './PredicciontendenciasResult';

const AnalisisAu = () => {
    const [tipo, setTipo] = useState('Resumen Ejecutivo');
    const [mostrarComponente, setMostrarComponente] = useState(null);
    const [cargando, setCargando] = useState(false);

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

    const handleGenerar = () => {
        setCargando(true);
        setMostrarComponente(null); 

        setTimeout(() => {
            setMostrarComponente(tipo);
            setCargando(false);
        }, 1000); 
    };

    return (
        <div style={{ padding: '20px', width: '100%' }}>
            {/* 1. SELECTOR Y BOTÓN */}
            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#475569' }}>Tipo:</p>
            
            <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
                <select 
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: '#1e293b', 
                        color: 'white',
                        border: '2px solid #e91e63', 
                        borderRadius: '10px',
                        appearance: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {opciones.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: '20px', top: '15px', color: 'white', pointerEvents: 'none' }}>▼</div>
            </div>

            <button 
                onClick={handleGenerar}
                style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#e91e63',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                {cargando ? 'Analizando...' : 'Generar'}
            </button>

            {/* 2. ZONA DE RESULTADOS */}
            <div style={{ marginTop: '20px' }}>
                {cargando && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#e91e63' }}>
                        <p>La IA está procesando los datos...</p>
                    </div>
                )}

               
                {!cargando && mostrarComponente === 'Resumen Ejecutivo' && (
                    <ResumenEjecutivoResult />
                )}

                {!cargando && mostrarComponente === 'Oportunidades de Mejora' && (
                    <OportunidadesMejoraResult />
                )}

                
                {!cargando && mostrarComponente === 'Análisis de Rechazos' && (
                    <AnalisisRechazosResult />
                )}

                {!cargando && mostrarComponente === 'Mejores Prácticas' && (
                    <MejoresPracticasResult />
                )}

                {!cargando && mostrarComponente === 'Patrones de Ventas' && (
                    <PatronesVentasResult />
                )}

                {!cargando && mostrarComponente === 'Plan de Coaching' && (
                    <PlanCoachingResult />
                )}

                {!cargando && mostrarComponente === 'Recomendaciones Semanales' && (
                    <RecomendacionesSemanalesResult />
                )}

                {!cargando && mostrarComponente === 'Predicción de Tendencias' && (
                    <PredicciontendenciasResult />
                )}

                

                {!cargando && mostrarComponente && !['Resumen Ejecutivo', 'Oportunidades de Mejora', 'Análisis de Rechazos', 'Mejores Prácticas', 'Patrones de Ventas', 'Plan de Coaching', 'Recomendaciones Semanales', 'Predicción de Tendencias'].includes(mostrarComponente) && (
                    <div style={{ padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '10px', textAlign: 'center' }}>
                        Análisis para <strong>{mostrarComponente}</strong> generado. (Pronto estará el diseño final aquí)
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalisisAu;