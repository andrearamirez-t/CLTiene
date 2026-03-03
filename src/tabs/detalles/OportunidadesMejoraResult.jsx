import React from 'react';

const OportunidadesMejoraResult = () => {
    const oportunidades = [
        {
            titulo: "1. Optimización de la Tasa de Contacto 📞",
            descripcion: "Ninguna de las 2,556 soluciones ha sido contactada. Las oportunidades perdidas son significativas.",
            impacto: "Muy alto. Incrementar incluso una pequeña proporción de contactos podría aumentar las ventas.",
            esfuerzo: "Alto. Requiere revisión de estrategias de llamada y horarios.",
            prioridad: 1
        },
        {
            titulo: "2. Mejorar el Nivel de Capacitación del Personal 🎓",
            descripcion: "Las tasas de convertibilidad de los asesores son bajas, ninguna supera el 5% de éxito.",
            impacto: "Alto. Mejores habilidades podrían traducirse en mayores ventas.",
            esfuerzo: "Medio. Implementación de programas de capacitación.",
            prioridad: 2
        },
        {
            titulo: "3. Reducción de Llamadas No Clasificadas 📈",
            descripcion: "El 31% de las llamadas totales no están clasificadas, dificultando el análisis de resultados.",
            impacto: "Medio. Ayuda a la precisión de los análisis y seguimiento.",
            esfuerzo: "Medio. Revisar y mejorar los procedimientos de clasificación.",
            prioridad: 3
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
            <h3 style={{ color: '#e91e63', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                Oportunidades de Mejora Identificadas por IA
            </h3>
            
            {oportunidades.map((item, index) => (
                <div key={index} style={{ marginBottom: '25px', padding: '15px', borderLeft: '4px solid #e91e63', backgroundColor: '#f8fafc' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{item.titulo}</h4>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Descripción:</strong> {item.descripcion}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Impacto Estimado:</strong> {item.impacto}</p>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}><strong>Esfuerzo:</strong> {item.esfuerzo}</p>
                    <span style={{ 
                        display: 'inline-block', 
                        marginTop: '10px', 
                        padding: '4px 12px', 
                        backgroundColor: '#ffe4e6', 
                        color: '#e91e63', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                    }}>
                        Prioridad: {item.prioridad}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default OportunidadesMejoraResult;