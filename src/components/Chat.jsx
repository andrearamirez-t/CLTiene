function Chat({ messages }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            {messages.map((msg, index) => (
                <div key={index} style={{
                    padding: '15px 25px',
                    borderRadius: '15px',
                    marginBottom: '10px', 
                    background: msg.role === 'user' ? 'linear-gradient(90deg, #FD7751 0%, #FD7751 100%)' : '#f8fafc',
                    color: msg.role === 'user' ? 'white' : '#1e293b',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%' ,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    whiteSpace: 'pre-line'
                }}>
                    {msg.content}
                </div>
            ))}
        </div>
    )
}

export default Chat