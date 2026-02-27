function Chat({ messages }) {
    return (
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
    )
}

export default Chat