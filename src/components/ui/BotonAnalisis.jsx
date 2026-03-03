import React from 'react';

const BotonAnalisis = ({ onAnalizar }) => (
    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex' }}>
        <button 
            onClick={onAnalizar}
            style={{
                backgroundColor: '#e91e63',
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
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)'
            }}
        >
            📊 Analizar resultados con IA
        </button>
    </div>
);

export default BotonAnalisis;