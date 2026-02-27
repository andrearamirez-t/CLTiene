import React from 'react';
import Chat from './Chat';
import SenMessage from './SenMessage';

function ChatIn({ messages, inputValue, setInputValue, handleSend, setMessages }) {
    return (
        <div>
            <Chat messages={messages} />
            <SenMessage 
                inputValue={inputValue} 
                setInputValue={setInputValue} 
                onSend={handleSend} 
                onClear={() => setMessages([])} 
            />
        </div>
    );
}

export default ChatIn;