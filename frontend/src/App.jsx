import React, {useEffect, useState} from 'react';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws'); // Replace with your backend WebSocket URL
        socket.onopen = () => {
            console.log('Connected to the WebSocket server');
        };
        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, {type: 'response', text: event.data}]);
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleSend = () => {
        if (input.trim() && ws) {
            setMessages((prevMessages) => [...prevMessages, {type: 'user', text: input}]);
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
        <div className="min-h-screen flex flex-col bg-gray-100">

            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded"
                        placeholder="Ask me anything about my CV..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Send
                    </button>
                </div>
            </div>


            <div className="flex-grow p-8">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index}
                             className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
