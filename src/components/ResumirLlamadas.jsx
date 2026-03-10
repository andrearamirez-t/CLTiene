import React, { useState } from 'react';
import CuerpoLlamada from './CuerpoLlamada';

const ResumirLlamadas = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [llamadaData, setLlamadaData] = useState(null);
    const [loading, setLoading] = useState(false);

    const obtenerLlamada = async () => {

        setLoading(true);

        try {

            const response = await fetch("http://localhost:8000/api/resumir_llamada");

            const data = await response.json();

            setLlamadaData(data);

        } catch (error) {

            console.error("Error obteniendo llamada:", error);

        }

        setLoading(false);

    };

    return (

        <div style={{ padding: '20px' }}>

            <div
                onClick={() => {

                    setIsOpen(!isOpen);

                    if (!llamadaData) {
                        obtenerLlamada();
                    }

                }}
                style={{
                    backgroundColor: '#FC3276',
                    color: 'white',
                    padding: '12px 25px',
                    borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>Resumen de llamada</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {loading && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    Generando resumen...
                </div>
            )}

            {isOpen && !llamadaData && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    Esperando datos del backend...
                </div>
            )}

            {isOpen && llamadaData?.info && (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    padding: '30px'
                }}>
                    <CuerpoLlamada
                        datos={llamadaData.info}
                        transcripcion={llamadaData.chat}
                    />
                </div>
            )}

        </div>

    );
};

export default ResumirLlamadas;