import React from 'react';

const PlanCoachingResult = () => {
    const fases = [
        {
            semana: "Semana 1: Diagnóstico y Evaluación 🔍",
            objetivo: "Analizar el estado actual de las habilidades del asesor.",
            acciones: ["Monitoreo de 5 llamadas grabadas", "Identificación de muletillas", "Evaluación de tono de voz"]
        },
        {
            semana: "Semana 2: Entrenamiento y Simulación 🎓",
            objetivo: "Reforzar el discurso de ventas y manejo de objeciones.",
            acciones: ["Role-play de situaciones difíciles", "Taller de escucha activa", "Ajuste de guion personalizado"]
        },
        {
            semana: "Semana 3: Implementación y Ajuste ⚙️",
            objetivo: "Aplicar lo aprendido en llamadas reales con feedback inmediato.",
            acciones: ["Acompañamiento en tiempo real", "Feedback post-llamada", "Refuerzo de cierre de ventas"]
        },
        {
            semana: "Semana 4: Evaluación de Resultados y Revisión 📈",
            objetivo: "Medir la mejora en los KPIs del asesor.",
            acciones: ["Comparativa de tasa de conversión", "Certificación de habilidades", "Definición de nuevos objetivos"]
        }
    ];

    return (
        <div style={{
            marginTop: '20px',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            color: '#1e293b'
        }}>
            <h3 style={{ color: '#e91e63', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '20px' }}>
                Plan de Acción de Coaching Mensual
            </h3>

            {fases.map((fase, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>{fase.semana}</h4>
                    <p style={{ fontSize: '14px', margin: '0 0 10px 0', fontStyle: 'italic' }}><strong>Objetivo:</strong> {fase.objetivo}</p>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                        {fase.acciones.map((accion, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{accion}</li>
                        ))}
                    </ul>
                    {index !== fases.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginTop: '15px' }} />}
                </div>
            ))}

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
                    <strong>Nota:</strong> Este plan está basado en el rendimiento actual de los asesores con tasas de conversión inferiores al promedio general del 2.15%.
                </p>
            </div>
        </div>
    );
};

export default PlanCoachingResult;