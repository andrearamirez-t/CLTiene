import React from 'react';

const PatronesVentasResult = () => {
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
                Análisis de Patrones de Ventas Exitosas 📊
            </h3>

            {/* Bloque 1: Duración */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', margin: '10px 0' }}>1. Duración Óptima de Llamadas 📞</p>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    Las llamadas con éxito tienen una media de <strong>510 segundos</strong>.
                </p>
                <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '10px', height: '10px', marginTop: '5px' }}>
                    <div style={{ width: '75%', backgroundColor: '#e91e63', height: '10px', borderRadius: '10px' }}></div>
                </div>
            </div>

            {/* Bloque 2: Turnos */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', margin: '10px 0' }}>2. Turnos con Mayor Conversión ⏰</p>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    El promedio de turnos es de <strong>4.6</strong>. Los turnos de la mañana presentan un 15% más de efectividad.
                </p>
            </div>

            {/* Bloque 3: Planes */}
            <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', margin: '10px 0' }}>3. Planes más Vendidos 🌟</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <span style={{ padding: '5px 15px', backgroundColor: '#fdf2f8', color: '#e91e63', borderRadius: '20px', fontSize: '12px', border: '1px solid #fbcfe8' }}>
                        Plan Mascotas
                    </span>
                    <span style={{ padding: '5px 15px', backgroundColor: '#fdf2f8', color: '#e91e63', borderRadius: '20px', fontSize: '12px', border: '1px solid #fbcfe8' }}>
                        Plan Hogar
                    </span>
                </div>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #e91e63' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Perfil de Llamada Exitosa:</p>
                <p style={{ fontSize: '14px', margin: 0 }}>
                    Asesores como Melany Ramirez y Marjorie Villadiego logran cierres efectivos mediante un saludo cordial y enfoque en beneficios desde el segundo 30.
                </p>
            </div>
        </div>
    );
};

export default PatronesVentasResult;