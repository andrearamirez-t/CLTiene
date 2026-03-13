import React, { useState, useEffect } from 'react';
import CuerpoLlamada from './CuerpoLlamada';
import BotonAnalisis from './ui/BotonAnalisis';
import Select from './Select';

const ResumirLlamadas = () => {
    const [llamadasLista, setLlamadasLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState("");
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
            alert("Selecciona primero una llamada");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/resumir_llamada/${idSeleccionado}`);
            const data = await response.json();
            setLlamadaAnalizada(data);
        } catch (error) {
            console.error("Error al analizar:", error);
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>

            <Select
                endPoint="/api/transcripcion/llamadas"
                value={idSeleccionado}
                onChange={(e) => setIdSeleccionado(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #FC3276',
                    backgroundColor: '#1a202e',
                    color: 'white',
                    width: '100%'
                }}
            />

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

        </div>
    );
};

export default ResumirLlamadas;