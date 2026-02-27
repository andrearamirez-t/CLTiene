import React from 'react';

const ChatContenedor = ({ messages, inputValue, setInputValue, handleSend, setMessages }) => {
    return (
        <>
            {/* ÁREA DE MENSAJES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: msg.role === 'user' ? 'linear-gradient(90deg, #E8347E 0%, #634394 100%)' : '#f8fafc',
                        color: msg.role === 'user' ? 'white' : '#1e293b',
                        border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                        whiteSpace: 'pre-line'
                    }}>
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* INPUT Y BOTONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu pregunta aquí..."
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #e91e63', backgroundColor: '#1e293b', color: 'white' }}
                />
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => handleSend()} style={{ flex: 1, padding: '12px', backgroundColor: '#e91e63', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
                    <button onClick={() => setMessages([])} style={{ flex: 1, padding: '12px', backgroundColor: '#e91e63', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Limpiar</button>
                </div>
            </div>
        </>
    );
};

export default ChatContenedor;





            
