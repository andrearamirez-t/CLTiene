import React from 'react';

const MejoresPracticasResult = () => {
    const asesoresTop = [
        { nombre: "Melany Camila Ramirez", tasa: "4.99%", vsPromedio: "+2.84%" },
        { nombre: "Marjorie Villadiego", tasa: "4.10%", vsPromedio: "+1.95%" }
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
                Análisis de Desempeño de Top Performers 🏆
            </h3>

            {/* Sección de Asesores Estrella */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                {asesoresTop.map((asesor, index) => (
                    <div key={index} style={{ 
                        flex: 1, 
                        padding: '15px', 
                        backgroundColor: '#f8fafc', 
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Asesor Elite</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{asesor.nombre}</p>
                        <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>{asesor.tasa} Éxito</p>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '25px' }}>
                <p style={{ fontWeight: 'bold', color: '#e91e63' }}>🚀 Claves del Éxito Detectadas:</p>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>Técnicas de Apertura:</strong> Saludos personalizados que generan confianza inmediata.</li>
                    <li><strong>Uso de Canales:</strong> Integración efectiva de WhatsApp para cerrar ventas.</li>
                    <li><strong>Manejo de Tiempos:</strong> Llamadas de duración media (entre 2 y 4 minutos).</li>
                </ul>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#fff1f2', borderRadius: '10px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>💡 Recomendación para el Equipo:</p>
                <p style={{ fontSize: '14px', margin: 0 }}>
                    Asignar a los Top Performers como mentores de asesores con tasas menores al 1% para estandarizar el discurso de ventas.
                </p>
            </div>
        </div>
    );
};

export default MejoresPracticasResult;