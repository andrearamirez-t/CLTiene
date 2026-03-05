import React from 'react';

function SenMessage({ inputValue, setInputValue, onSend, onClear }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Tu pregunta:</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSend()}
                    placeholder="Ej: ¿Qué asesor rinde mejor?"
                    style={{
                        width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #FC3276',
                        backgroundColor: '#1e293b', color: 'white', outline: 'none', boxSizing: 'border-box'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => onSend()} style={{ flex: 1, padding: '12px', backgroundColor: '#FC3276', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Enviar
                </button>
                <button onClick={onClear} style={{ flex: 1, padding: '12px', backgroundColor: '#FC3276', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Limpiar
                </button>
            </div>
        </div>
    );
}

export default SenMessage;