import React from 'react';

const BotonAnalisis = ({ onAnalizar }) => (
    <div style={{  display: 'flex' }}>
        <button 
            onClick={onAnalizar}
            style={{
                backgroundColor: '#FC3276',
                color: 'white',
                padding: '10px 25px',
                borderRadius: '25px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
                width:'100%'
            }}
        >
            📊 Analizar resultados con IA
        </button>
    </div>
);

export default BotonAnalisis;