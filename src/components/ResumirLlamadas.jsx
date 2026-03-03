import React, { useState } from 'react';
import CuerpoLlamada from './CuerpoLlamada';
import BotonAnalisis from './ui/BotonAnalisis';

const ResumirLlamadas = () => {
    const [isOpen, setIsOpen] = useState(true);

    const llamadaData = {
        info: { resultado: "Contactado", plan: "Plan Mascotas", duracion: "Media", turnos: "12", calificacion: 50 },
        chat: { cliente: "Aló, buenos días. Muy buenos días. ¿Si me escuchan?", asesor: "Tengo el gusto de comunicarme con Luz Torres..." }
    };

    return (
        <div style={{ padding: '20px' }}>
            
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: '#e91e63', color: 'white', padding: '12px 25px',
                    borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                    display: 'flex', justifyContent: 'space-between', cursor: 'pointer'
                }}
            >
                <span>#15555 | Contactado | Plan Mascotas | Cal:50</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {/* Contenedor */}
            {isOpen && (
                <div style={{ 
                    backgroundColor: 'white', border: '1px solid #e2e8f0', borderTop: 'none', 
                    borderRadius: '0 0 12px 12px', padding: '30px' 
                }}>
                    <CuerpoLlamada datos={llamadaData.info} transcripcion={llamadaData.chat} />
                    <BotonAnalisis onAnalizar={() => alert('Analizando...')} />
                </div>
            )}
        </div>
    );
};

export default ResumirLlamadas;