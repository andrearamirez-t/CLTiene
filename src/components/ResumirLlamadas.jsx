import React, { useState, useEffect } from 'react';
import CuerpoLlamada from './CuerpoLlamada';
import BotonAnalisis from './ui/BotonAnalisis';

const ResumirLlamadas = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [llamadasLista, setLlamadasLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState(null); 
    const [llamadaAnalizada, setLlamadaAnalizada] = useState(null); 

    useEffect(() => {
        const cargarLista = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/obtener_lista_llamadas`);
                const data = await response.json();
                setLlamadasLista(data);
            } catch (error) {
                console.error("Error cargando lista:", error);
            }
        };
        cargarLista();
    }, []);

    const manejarAnalisis = async () => {
        if (!idSeleccionado) {
            alert("Selecciona primero una llamada de la lista rosa");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/resumir_llamada?id=${idSeleccionado}`);
            const data = await response.json();
            setLlamadaAnalizada(data);
        } catch (error) {
            console.error("Error al analizar:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: '#FC3276', color: 'white', padding: '12px',
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between'
                }}
            >
                <span>{idSeleccionado ? `Llamada #${idSeleccionado} lista para analizar` : "Seleccione una llamada"}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div style={{ backgroundColor: '#1a202e', color: 'white', border: '1px solid #FC3276', maxHeight: '200px', overflowY: 'auto' }}>
                    {Array.isArray(llamadasLista) && llamadasLista.length > 0 ? (
                        llamadasLista.map((llamada) => (
                            <div
                                key={llamada.id}
                                onClick={() => {
                                    setIdSeleccionado(llamada.id);
                                    setIsOpen(false);
                                }}
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333' }}
                            >
                                #{llamada.id} | {llamada.cuenta}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#888' }}>
                            {loading ? "Cargando datos..." : "No se encontraron llamadas"}
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <BotonAnalisis onAnalizar={manejarAnalisis} />
            </div>

            {loading && <p style={{ color: '#FC3276' }}>🤖 Analizando con IA...</p>}

            {
                llamadaAnalizada && !loading && (
                    <CuerpoLlamada
                        datos={llamadaAnalizada.info}
                        transcripcion={llamadaAnalizada.chat}
                    />
                )
            }
        </div >
    );
};

export default ResumirLlamadas;