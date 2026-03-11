import React, { useState } from 'react';
import FiltrosLateral from '../components/Transcripciones/FiltrosLateral';
import ChatVisor from '../components/Transcripciones/ChatVisor';
import MetricasGrid from '../components/Transcripciones/MetricasGrid';

const Transcripciones = () => {
    const [score] = useState(87);
    const [clasificacion, setClasificacion] = useState('venta');
    const [filtroPalabra, setFiltroPalabra] = useState('');

    const [chatData] = useState([]);

 const metricas = [
    { label: 'Resultado', val: 'Contactado' },
    { label: 'Duración', val: 'Media' },
    { label: 'Plan', val: 'No Identificado' },
    { label: 'Turnos', val: '5' },
    { label: 'Saludo', val: 'Parcial' },
    { label: 'WhatsApp', val: 'Sí' },       
    { label: 'Mencionó Costo', val: 'Sí' }, 
    { label: 'Medios de Pago', val: 'No' }  
];

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
                <FiltrosLateral 
                    score={score} 
                    clasificacion={clasificacion} 
                    setClasificacion={setClasificacion}
                    setFiltroPalabra={setFiltroPalabra}
                />
                <ChatVisor chat={chatData} resaltar={filtroPalabra} />
            </div>

            
            <div style={{ 
                marginTop: '40px', 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ borderBottom: '2px solid #f1f5f9', marginBottom: '20px', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>📊 Análisis Detallado de Métricas Operativas e IA</h3>
                </div>
                
                <MetricasGrid data={metricas} />
            </div>
        </div>
    );
   
};

export default Transcripciones;