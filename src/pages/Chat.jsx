import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Chat.css';

const CONVERSATIONS = [
    {
        id: 1,
        name: 'Elena Vance',
        lastMsg: "That jazz bar sounds perfect for Saturday.",
        time: '12:45 PM',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        online: true,
        unread: 0
    },
    {
        id: 2,
        name: 'Sophia Reeves',
        lastMsg: "I really loved the design exhibition!",
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
        online: false,
        unread: 2
    },
    {
        id: 3,
        name: 'Isabelle Chen',
        lastMsg: "When are you planning to visit SF?",
        time: 'Tuesday',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
        online: true,
        unread: 0
    }
];

const MESSAGES = [
    { id: 1, text: "Hey! I saw your profile and loved your interest in jazz.", sent: false },
    { id: 2, text: "Thanks Elena! I've been getting into it recently. Any recommendations?", sent: true },
    { id: 3, text: "There's this tiny spot in the Village called Blue Note. It's legendary.", sent: false },
    { id: 4, text: "Wait, I've heard of that! Is it the one with the blue neon sign?", sent: true },
    { id: 5, text: "Exactly! That jazz bar sounds perfect for Saturday.", sent: false },
];

const Chat = () => {
    const [selected, setSelected] = useState(CONVERSATIONS[0]);
    const [messages, setMessages] = useState(MESSAGES);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sent: true }]);
        setInput('');
    };

    return (
        <div className="chat-page">
            <Navbar />
            
            <aside className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h1>Messages</h1>
                    <input type="text" className="chat-search" placeholder="Search matches..." />
                </div>
                
                <div className="conversation-list">
                    {CONVERSATIONS.map(conv => (
                        <div 
                            key={conv.id} 
                            className={`conversation-item ${selected.id === conv.id ? 'active' : ''}`}
                            onClick={() => setSelected(conv)}
                        >
                            <img src={conv.avatar} alt={conv.name} className="conversation-avatar" />
                            <div className="conversation-info">
                                <div className="conversation-name-row">
                                    <h3>{conv.name}</h3>
                                    <span className="conversation-time">{conv.time}</span>
                                </div>
                                <p className="conversation-last-msg">{conv.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="chat-main">
                <header className="chat-header">
                    <div className="chat-user-info">
                        <img src={selected.avatar} alt={selected.name} className="conversation-avatar" style={{ width: 45, height: 45 }} />
                        <div>
                            <h2>{selected.name}</h2>
                            <span className="chat-status">{selected.online ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>
                    <div className="chat-actions">
                        <button className="control-btn" style={{ width: 40, height: 40, fontSize: '1rem' }}>⋮</button>
                    </div>
                </header>

                <div className="chat-messages">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`message ${msg.sent ? 'message-sent' : 'message-received'}`}
                            >
                                {msg.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="chat-input-area">
                    <div className="chat-input-wrapper">
                        <input 
                            type="text" 
                            className="chat-input" 
                            placeholder="Type a message..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <button className="btn-send" onClick={handleSend}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Chat;
