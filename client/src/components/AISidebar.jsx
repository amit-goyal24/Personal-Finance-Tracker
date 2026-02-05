import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const AISidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! Ask me about your finances.", sender: "ai" }]);
    const [input, setInput] = useState('');

    const { transactions } = useContext(GlobalContext);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMsg]);

        // Process AI response
        setTimeout(() => {
            const responseText = processQuery(input.toLowerCase());
            setMessages(prev => [...prev, { text: responseText, sender: "ai" }]);
        }, 500);

        setInput('');
    };

    const processQuery = (query) => {
        if (query.includes('balance')) {
            const amounts = transactions.map(t => t.amount);
            const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
            return `Your current balance is $${total}.`;
        }
        if (query.includes('spent')) {
            const totalSpent = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0).toFixed(2);
            return `You have spent a total of $${totalSpent}.`;
        }
        return "I can tell you your balance or total spending. Just ask!";
    };

    return (
        <>
            <button className="ai-float-btn" onClick={toggleSidebar}>🤖 Ask AI</button>

            <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="ai-header">
                    <h3>Finance AI</h3>
                    <button onClick={toggleSidebar}>×</button>
                </div>
                <div className="chat-output">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={msg.sender === 'user' ? 'user-msg' : 'ai-msg'}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <form className="chat-input-area" onSubmit={handleSend}>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask something..." />
                    <button type="submit">➤</button>
                </form>
            </div>
        </>
    );
};
