const ChatVisor = ({ chat, resaltar }) => {
    const destacarTexto = (texto, palabra) => {
        if (!palabra.trim()) return texto;
        const regex = new RegExp(`(${palabra})`, 'gi');
        const partes = texto.split(regex);
        return partes.map((parte, i) => 
            parte.toLowerCase() === palabra.toLowerCase() 
                ? <span key={i} style={{ backgroundColor: '#fde047', color: 'black', fontWeight: 'bold', padding: '0 2px' }}>{parte}</span> 
                : parte
        );
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', minHeight: '550px' }}>
            {chat.map((msg, index) => (
                <div key={index} style={{
                    alignSelf: msg.role === 'cliente' ? 'flex-start' : 'flex-end',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    backgroundColor: msg.role === 'cliente' ? '#FD7751' : '#999999',
                    color: msg.role === 'cliente' ? 'white' : '#ffffff',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordWrap: "break-word",
                    maxWidth: "50rem"
                }}>
                    <b style={{ display: 'block', marginBottom: '5px', fontSize: '11px', textTransform: 'uppercase' }}>
                        {msg.role}
                    </b>
                    {destacarTexto(msg.text, resaltar)}
                </div>
            ))}
        </div>
    );
};

export default ChatVisor;