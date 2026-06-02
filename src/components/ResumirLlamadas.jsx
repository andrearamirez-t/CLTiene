import React, { useState } from 'react';
import CuerpoLlamada from './CuerpoLlamada';
import BotonAnalisis from './ui/BotonAnalisis';
import Select from './Select';

const ResumirLlamadas = () => {
    const [loading, setLoading] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState("");
    const [llamadaAnalizada, setLlamadaAnalizada] = useState(null);
    const [error, setError] = useState('');

    const manejarAnalisis = async () => {
        if (!idSeleccionado) {
            alert("Selecciona primero una llamada");
            return;
        }

        setLoading(true);
        setError('');
        setLlamadaAnalizada(null);

        try {
            const response = await fetch(`https://cltiene-backend-293865702055.us-central1.run.app/ia/resumir_llamada/${idSeleccionado}`);
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setLlamadaAnalizada(data);
            }
        } catch (err) {
            setError('Error al analizar la llamada. Intenta de nuevo.');
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

            {loading && <p style={{ color: '#FC3276', marginTop: '15px' }}>🤖 Analizando con IA...</p>}

            {error && (
                <div style={{ marginTop: '15px', padding: '12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', color: '#be123c', fontSize: '13px' }}>
                    ⚠️ {error}
                </div>
            )}

            {llamadaAnalizada && !loading && (
                <CuerpoLlamada
                    datos={llamadaAnalizada.info}
                    transcripcion={llamadaAnalizada.chat}
                />
            )}

        </div>
    );
};

export default ResumirLlamadas;