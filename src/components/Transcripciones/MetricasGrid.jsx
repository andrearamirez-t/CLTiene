import React, { useState } from 'react';

const MetricasGrid = ({ data }) => {
    console.log(data)
    const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

    const getStatusColor = (val) => {
        const lowerVal = val.toString().toLowerCase();
        if (['sí', 'venta', 'excelente'].some(k => lowerVal.includes(k))) return '#2ecc71';
        if (['no', 'bajo'].some(k => lowerVal.includes(k))) return '#FC3276';
        return '#1e293b';
    };

    const obtenerAnalisisIA = async () => {
        try {
            const response = await fetch("http://localhost:8000/analisis-llamada");
            const result = await response.json();

            console.log("Respuesta IA:", result);

        } catch (error) {
            console.error("Error consultando IA:", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ borderLeft: '4px solid #e2e8f0', paddingLeft: '15px' }}>
                        <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{item.label}</p>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: getStatusColor(item.val) }}>{item.val}</p>
                    </div>
                ))}
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    onClick={async () => {
                        const nuevoEstado = !mostrarAnalisis;
                        setMostrarAnalisis(nuevoEstado);

                        if (nuevoEstado) {
                            await obtenerAnalisisIA();
                        }
                    }}
                    style={{
                        padding: '14px 22px',
                        backgroundColor: '#db2777',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {mostrarAnalisis ? '✕ Ocultar Análisis' : 'Analizar llamada con IA'}
                </button>
            </div>

            {/* CUADRO DE ANÁLISIS */}
            {mostrarAnalisis && (
                <div style={{
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1.5px solid #fc3474',
                    borderRadius: '15px',
                    padding: '25px',
                    marginTop: '10px',
                    boxShadow: '0 4px 12px rgba(252, 52, 116, 0.05)'
                }}>


                </div>
            )}
        </div>
    );
};

export default MetricasGrid;