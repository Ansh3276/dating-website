import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPhotoUrl } from '../services/api';
import { useSocket } from '../context/SocketContext';
import '../styles/Chat.css';

const Chat = () => {
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = React.useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { onlineUsers } = useSocket();

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const { getMe } = await import('../services/api');
                setCurrentUser(await getMe());
            } catch (err) {
                console.error('Not logged in', err);
            }
        };
        fetchUser();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversations = async () => {
        try {
            const { getConversations } = await import('../services/api');
            const data = await getConversations();
            setConversations(data);
            
            // Check for passed userId in navigation state
            const targetId = location.state?.userId;
            if (targetId) {
                const found = data.find(c => c.id === targetId);
                if (found) setSelected(found);
            } else if (data.length > 0 && !selected) {
                setSelected(data[0]);
            }
        } catch (err) {
            console.error('Failed to load conversations', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (otherUserId) => {
        try {
            const { getMessages } = await import('../services/api');
            const data = await getMessages(otherUserId);
            setMessages(data.map(m => ({
                id: m.id,
                text: m.text,
                sent: currentUser ? m.senderId === currentUser.id : false
            })));
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    };

    React.useEffect(() => {
        loadConversations();
    }, [location.state?.userId]); // Re-run if a new userId is passed in navigation state

    React.useEffect(() => {
        if (selected) {
            loadMessages(selected.id);
            const interval = setInterval(() => {
                loadMessages(selected.id);
            }, 3000); // Poll every 3 seconds for real-time feel
            return () => clearInterval(interval);
        }
    }, [selected]);

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !selected) return;
        
        const tempId = Date.now();
        const newMsg = { id: tempId, text: input, sent: true };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        try {
            const { sendMessage } = await import('../services/api');
            await sendMessage(selected.id, input);
            // Optionally reload messages or just keep the local one
        } catch (err) {
            console.error('Failed to send message', err);
        }
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
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                    ) : conversations.length > 0 ? (
                        conversations.map(conv => (
                            <div 
                                key={conv.id} 
                                className={`conversation-item ${selected?.id === conv.id ? 'active' : ''}`}
                                onClick={() => setSelected(conv)}
                            >
                                <img 
                                    src={getPhotoUrl(conv.avatar)} 
                                    alt={conv.name} 
                                    className="conversation-avatar" 
                                    onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                />
                                <div className="conversation-info">
                                    <div className="conversation-name-row">
                                        <h3>
                                            {conv.name}
                                            {onlineUsers.includes(conv.id) && <span className="online-dot" style={{ width: 8, height: 8, background: '#4CAF50', borderRadius: '50%', display: 'inline-block', marginLeft: 6 }}></span>}
                                        </h3>
                                        <span className="conversation-time">
                                            {conv.time ? new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className="conversation-last-msg">{conv.lastMsg}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No messages yet.</div>
                    )}
                </div>
            </aside>

            <main className="chat-main">
                {selected ? (
                    <>
                        <header className="chat-header">
                            <div className="chat-user-info">
                                <img 
                                    src={getPhotoUrl(selected.avatar)} 
                                    alt={selected.name} 
                                    className="conversation-avatar" 
                                    style={{ width: 45, height: 45 }} 
                                    onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                />
                                <div>
                                    <h2>{selected.name}</h2>
                                    <span className="chat-status" style={{ color: onlineUsers.includes(selected.id) ? '#4CAF50' : '#888' }}>
                                        {onlineUsers.includes(selected.id) ? '● Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <button className="control-btn" style={{ width: 40, height: 40, fontSize: '1rem' }}>⋮</button>
                            </div>
                        </header>

                        <div className="chat-messages">
                            {messages.length === 0 && (
                                <div className="chat-empty-new">
                                    <p>Say hello to start the conversation! 👋</p>
                                </div>
                            )}
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
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
                            <div ref={messagesEndRef} />
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
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', background: '#fafafa' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chat;
