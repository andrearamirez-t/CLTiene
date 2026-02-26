import React, { useState } from 'react';

const Transcripciones = () => {

  const [score] = useState(30); 

  const getQualityStyle = (val) => {
    if (val <= 40) return { bg: '#ff4d4d', text: 'Bajo - Necesita mejorar' };
    if (val <= 75) return { bg: '#3498db', text: 'Intermedio - En proceso' };
    return { bg: '#2ecc71', text: 'Bueno - Venta Exitosa' };
  };

  const quality = getQualityStyle(score);

  return (
    <div style={{ width: '100%', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 1. BARRA SUPERIOR DE INDICADORES */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        gap: '10px', 
        padding: '15px', 
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd'
      }}>
        {[
          { label: 'Total', val: '3,299', color: '#e91e63' },
          { label: 'Contestadas', val: '3,298', color: '#e91e63' },
          { label: 'Efectivas', val: '185', color: '#e91e63' },
          { label: 'Ventas', val: '62', color: '#e91e63' },
          { label: 'Hora', val: '9:00', color: '#e91e63' },
          { label: 'Día', val: 'Viernes', color: '#e91e63' },
          { label: 'Top', val: 'Jennifer', color: '#e91e63' },
          { label: 'Calidad', val: '12/100', color: '#e91e63' },
        ].map((kpi, i) => (
          <div key={i} style={{ textAlign: 'center', borderRight: i < 7 ? '1px solid #eee' : 'none' }}>
            <p style={{ fontSize: '10px', margin: 0, color: '#888', fontWeight: 'bold' }}>{kpi.label.toUpperCase()}</p>
            <p style={{ fontSize: '14px', margin: 0, color: kpi.color, fontWeight: 'bold' }}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', padding: '20px', gap: '30px' }}>
        
        {/* 2. COLUMNA IZQUIERDA */}
        <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <h4 style={{ fontSize: '14px', color: '#444', margin: 0 }}>Visor de Transcripciones AI</h4>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>** Buscar por teléfono o asesor **</p>
            <input 
              type="text" 
              value="Angie"
              readOnly
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#1e293b', color: 'white' }} 
            />
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>Seleccionar llamada:</p>
            <select style={{ width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#e91e63', color: 'white', fontWeight: 'bold' }}>
              <option>#3317 | Conectada | 3136437775 | Angie</option>
            </select>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>** Score de Calidad **</p>
            <div style={{ 
              backgroundColor: quality.bg, 
              color: 'white', 
              padding: '8px 15px', 
              borderRadius: '20px', 
              fontSize: '11px', 
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              {score}/100 {quality.text}
            </div>
          </div>

          {/* CUADRO DE MÉTRICAS GRIS */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>** Métricas **</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '11px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#94a3b8' }}>Asesor:</span>
                <p style={{ fontWeight: 'bold', margin: '2px 0' }}>Angie Daniela Lancheros</p>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Cliente:</span>
                <p style={{ fontWeight: 'bold', margin: '2px 0' }}>No Identificado</p>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Duración:</span>
                <p style={{ fontWeight: 'bold', margin: '2px 0' }}>Media</p>
              </div>
            </div>
          </div>

          <button style={{ width: '100%', padding: '15px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Analizar llamada con IA
          </button>
        </div>

        {/* 3. COLUMNA DERECHA (Transcripción Completa) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ backgroundColor: '#6cc071', color: 'white', padding: '12px 20px', borderRadius: '5px', fontSize: '13px' }}>
            <b>[Cliente]:</b> Hola, Daniela, ¿cómo estás? Bien, sí, señora.
          </div>

          <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '12px 20px', borderRadius: '5px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
            <b>[Asesor]:</b> Me estoy comunicando con usted con respecto a una orientación médica telefónica brindada el día de ayer.
          </div>

          <div style={{ backgroundColor: '#6cc071', color: 'white', padding: '12px 20px', borderRadius: '5px', fontSize: '13px' }}>
            <b>[Cliente]:</b> Queríamos verificar cómo continuaba, si ha podido seguir las recomendaciones. Sí, sí, señora. Todo muy bien.
          </div>

          <div style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '12px 20px', borderRadius: '5px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
            <b>[Asesor]:</b> Igualmente queríamos recordarles que la línea queda habilitada 24/7.
          </div>
          
          <div style={{ backgroundColor: '#6cc071', color: 'white', padding: '12px 20px', borderRadius: '5px', fontSize: '13px' }}>
            <b>[Cliente]:</b> Vale, muchísimas gracias. Bueno, que estés muy bien. Hasta luego.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Transcripciones;