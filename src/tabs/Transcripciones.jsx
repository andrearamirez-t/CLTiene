import React, { useEffect, useState } from 'react';
import FiltrosLateral from '../components/Transcripciones/FiltrosLateral';
import ChatVisor from '../components/Transcripciones/ChatVisor';
import MetricasGrid from '../components/Transcripciones/MetricasGrid';
import { useFilters } from '../FiltersContext';

const Transcripciones = () => {
    const { buildQuery } = useFilters();
    const params = buildQuery() || null;

    const [score] = useState(87);
    const [clasificacion, setClasificacion] = useState('venta');
    const [filtroPalabra, setFiltroPalabra] = useState('');

    const [agentID, setAgent] = useState(0)
    const [inputValue, setInputValue] = useState("");

    const [chatData, setChatData] = useState([]);

    const [metricas, setMetricas] = useState([])
    const [llamada, setLlamada] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8000/api/transcripcion/metricas/${agentID}`)
            .then(res => res.json())
            .then(data => setMetricas(Array.isArray(data) ? data : []))

        fetch(`http://localhost:8000/api/transcripcion/llamada/${agentID}/${inputValue}`)
            .then(res => res.json())
            .then(data => {
                setLlamada(Array.isArray(data) ? data : [])
                setChatData(Array.isArray(data?.mensajes) ? data.mensajes : [])
            })
    }, [agentID]);

    // const metricas = [
    //     // { label: 'Resultado', val: 'Contactado' },
    //     { label: 'Resultado', val: '-' },
    //     // { label: 'Duración', val: 'Media' },
    //     { label: 'Duración', val: '-' },
    //     // { label: 'Plan', val: 'No Identificado' },
    //     { label: 'Plan', val: '-' },
    //     // { label: 'Turnos', val: '5' },
    //     { label: 'Turnos', val: '-' },
    //     // { label: 'Saludo', val: 'Parcial' },
    //     { label: 'Saludo', val: '-' },
    //     // { label: 'WhatsApp', val: 'Sí' },
    //     { label: 'WhatsApp', val: '-' },
    //     // { label: 'Mencionó Costo', val: 'Sí' },
    //     { label: 'Mencionó Costo', val: '-' },
    //     // { label: 'Medios de Pago', val: 'No' }
    //     { label: 'Medios de Pago', val: '-' }
    // ];

    // const [asesorCargado, setAsesorCargado] = useState({
    //     // nombre: "Angie Daniela Lancheros",
    //     nombre: "",
    //     // cc: "1233907519",
    //     cc: "",
    //     // total: 6,
    //     total: 0,
    //     // contactado: 1,
    //     contactado: 0,
    //     busquedaRealizada: false,
    //     llamadas: []
    // });

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
                <FiltrosLateral
                    score={score}
                    clasificacion={clasificacion}
                    changeAgent={setAgent}
                    inputValue={inputValue}
                    changeFilter={setInputValue}
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