import React, { useState } from 'react';

const AnalisisAu = () => {
    const [tipoAnalisis, setTipoAnalisis] = useState('Resumen Ejecutivo');

    const handleGenerar = () => {
        console.log("Generando análisis para:", tipoAnalisis);
        
    };

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#ffffff', 
            borderRadius: '15px',
            animation: 'fadeIn 0.5s'
        }}>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '10px' }}>Tipo:</p>
            
           
            <select 
                value={tipoAnalisis}
                onChange={(e) => setTipoAnalisis(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#e91e63', 
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '20px',
                    appearance: 'none', 
                    cursor: 'pointer'
                }}
            >
                <option value="Resumen Ejecutivo">Resumen Ejecutivo</option>
                <option value="Oportunidades de Mejora">Oportunidades de Mejora</option>
                <option value="Análisis de Rechazos">Análisis de Rechazos</option>
                <option value="Mejores Prácticas">Mejores Prácticas</option>
                <option value="Patrones de Ventas">Patrones de Ventas</option>
                <option value="Plan de Coaching">Plan de Coaching</option>
                <option value="Recomendaciones Semanales">Recomendaciones Semanales</option>
                <option value="Predicción de Tendencias">Predicción de Tendencias</option>
            </select>

            
            <button
                onClick={handleGenerar}
                style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#e91e63',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
                Generar
            </button>
        </div>
    );
};

export default AnalisisAu;