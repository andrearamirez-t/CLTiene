import React, { useState } from 'react';
import { PROMPTS_IA } from '../config/promptsConfig';

const AgenteIADemo = ({ dataActual }) => {
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviarABackend = async (promptSeleccionado) => {
    setCargando(true);
    
    const payload = {
      system_prompt: promptSeleccionado.prompt,
      user_data: dataActual 
    };

    console.log("🚀 Enviando al Backend:", payload);

    try {
      
      const response = await fetch('http://localhost:5000/api/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const res = await response.json();
      setMensaje(res.resultado);
    } catch (error) {
      setMensaje("❌ Error de conexión: El Backend aún no está activo o faltan credenciales.");
      console.error("Error detallado:", error);
    }
    setCargando(false);
  };

  return (
    <div style={{ padding: '20px', background: '#1e293b', borderRadius: '10px', color: 'white' }}>
      <h2>🤖 Panel de Agente IA (Pruebas)</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {PROMPTS_IA.map((p) => (
          <button 
            key={p.id} 
            onClick={() => enviarABackend(p)}
            style={{ padding: '10px', cursor: 'pointer', borderRadius: '5px' }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #475569', paddingTop: '10px' }}>
        {cargando ? <p>⏳ Procesando con IA...</p> : <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default AgenteIADemo;