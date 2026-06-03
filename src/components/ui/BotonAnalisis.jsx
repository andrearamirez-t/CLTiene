import React from 'react';

const BotonAnalisis = ({ onAnalizar }) => (
    <div style={{  display: 'flex' }}>
        <button
            onClick={onAnalizar}
            style={{
                background: 'linear-gradient(135deg, #FC3276 0%, #db2777 100%)',
                color: 'white',
                padding: '13px 25px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(252,50,118,0.35)',
                width: '100%',
                justifyContent: 'center',
            }}
        >
            📊 Analizar resultados con IA
        </button>
    </div>
);

export default BotonAnalisis;