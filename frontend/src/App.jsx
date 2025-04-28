import React, {useEffect, useState} from 'react';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);  // New state to track waiting status

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws');
        socket.onopen = () => {
            console.log('Connected to the WebSocket server');
        };
        socket.onmessage = (event) => {
            // Assuming event.data contains HTML-formatted string
            setMessages((prevMessages) => [
                ...prevMessages,
                {type: 'response', text: event.data},
            ]);
            setIsWaiting(false);  // Response received, re-enable the button
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleSend = () => {
        if (input.trim() && ws) {
            setMessages((prevMessages) => [
                ...prevMessages,
                {type: 'user', text: `You: ${input}`},
            ]);
            setIsWaiting(true);  // Disable button while waiting for response
            ws.send(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="h-screen flex bg-gray-100">

            {/* Right Half: Chat App (100% width since no PDF) */}
            <div className="w-full p-4 flex flex-col h-full">

                {/* Messages Area (scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-lg shadow-lg mb-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-lg ${
                                msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                            }`}
                        >
                            {msg.type === 'user' ? (
                                <div>{msg.text}</div>
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: msg.text, // Render HTML from WebSocket response
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Area (fixed at the bottom) */}
                <div className="p-4 bg-white border-t border-gray-200 rounded-lg">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            className="flex-grow p-2 border border-gray-300 rounded"
                            placeholder="Ask anything about my CV..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={isWaiting} // Disable button when waiting for a response
                        >
                            {isWaiting ? 'Processing...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
