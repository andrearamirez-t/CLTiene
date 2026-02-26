import React, { useState } from 'react';

const Transcripciones = () => {
  // Score de ejemplo: 87 (Verde)
  const [score] = useState(87); 

  const getQualityStyle = (val) => {
    if (val <= 40) return { bg: '#ff4d4d', text: 'Bajo - Necesita mejorar' };
    if (val <= 75) return { bg: '#3498db', text: 'Intermedio - Aceptable' };
    return { bg: '#2ecc71', text: 'Bueno - Excelente desempeño' };
  };

  const quality = getQualityStyle(score);

  return (
    <div style={{ padding: '40px', backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      
      {/* SECCIÓN SUPERIOR: FILTROS + TRANSCRIPCIÓN */}
      <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
        
        {/* COLUMNA IZQUIERDA: CONTROLES */}
        <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <h2 style={{ fontSize: '16px', color: '#475569', margin: 0 }}>Visor de Transcripciones AI</h2>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>** Buscar por teléfono o asesor **</label>
            <input 
              type="text" 
              placeholder="Teléfono o nombre asesor..." 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontSize: '13px' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Seleccionar llamada:</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#e91e63', color: 'white', fontWeight: 'bold', fontSize: '13px' }}>
              <option>#3317 | Conectada | 3136437775 | Angie</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>** Score de Calidad **</label>
            <div style={{ backgroundColor: quality.bg, color: 'white', padding: '10px 20px', borderRadius: '25px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
              {score}/100 {quality.text}
            </div>
          </div>

          {/* CUADRO DE MÉTRICAS PRINCIPALES */}
          <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>** Métricas **</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Asesor:</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Angie Daniela Lancheros</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Cliente:</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>No Identificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: BURBUJAS DE TEXTO (ALARGADAS) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ backgroundColor: '#6cc071', color: 'white', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5' }}>
            <b>[Cliente]:</b> Hola, Daniela, ¿cómo estás? Bien, sí, señora.
          </div>
          <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
            <b>[Asesor]:</b> Me estoy comunicando con usted con respecto a una orientación médica telefónica brindada el día de ayer.
          </div>
          <div style={{ backgroundColor: '#6cc071', color: 'white', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', lineHeight: '1.5' }}>
            <b>[Cliente]:</b> Queríamos verificar cómo continuaba, si ha podido seguir las recomendaciones. Sí, sí, señora. Todo muy bien.
          </div>
          <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '15px 25px', borderRadius: '10px', fontSize: '14px', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
            <b>[Asesor]:</b> Igualmente queríamos recordarles que la línea queda habilitada 24/7.
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: REJILLA DE RESULTADOS (DATOS TÉCNICOS) */}
      <div style={{ marginTop: '50px', borderTop: '2px solid #f1f5f9', paddingTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px 60px' }}>
          
          {[
            { label: 'Resultado', val: 'Contactado' },
            { label: 'Duración', val: 'Media' },
            { label: 'Plan', val: 'No Identificado' },
            { label: 'Sentimiento', val: 'Neutral' },
            { label: 'Turnos', val: '4' },
            { label: 'Grabación', val: 'Sí' },
            { label: 'Módulo', val: 'Ventas' },
            { label: 'WhatsApp', val: 'No' }
          ].map((item, index) => (
            <div key={index}>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{item.val}</p>
            </div>
          ))}

        </div>

        {/* BOTÓN DE ACCIÓN FINAL */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
          <button style={{ 
            backgroundColor: '#e91e63', 
            color: 'white', 
            border: 'none', 
            padding: '14px 45px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: '13px',
            boxShadow: '0 4px 6px -1px rgba(233, 30, 99, 0.2)'
          }}>
            Analizar llamada con IA
          </button>
        </div>
      </div>

    </div>
  );
};

export default Transcripciones;