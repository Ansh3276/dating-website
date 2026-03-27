import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPhotoUrl } from '../services/api';
import { useSocket } from '../context/SocketContext';
import '../styles/Chat.css';

/* ── Typing Indicator Dots ── */
const TypingIndicator = ({ name }) => (
    <motion.div
        className="typing-indicator"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.25 }}
    >
        <span className="typing-text">{name} is typing</span>
        <span className="typing-dots">
            <span className="dot dot-1">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
        </span>
    </motion.div>
);

/* ── Message Status Icon ── */
const MessageStatus = ({ status }) => {
    if (status === 'seen') {
        return <span className="msg-status msg-seen" title="Seen">✓✓</span>;
    }
    if (status === 'delivered') {
        return <span className="msg-status msg-delivered" title="Delivered">✓✓</span>;
    }
    return <span className="msg-status msg-sent" title="Sent">✓</span>;
};

const Chat = () => {
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = React.useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { socket, onlineUsers } = useSocket();
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
                sent: currentUser ? m.senderId === currentUser.id : false,
                time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                fullTime: m.createdAt ? new Date(m.createdAt).toLocaleString() : '',
                status: m.status || 'sent'
            })));
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    };

    React.useEffect(() => {
        loadConversations();
    }, [location.state?.userId]);

    React.useEffect(() => {
        if (selected) {
            loadMessages(selected.id);
            // Whenever we select a chat, we mark its messages as seen
            if (socket) {
                socket.emit('mark_seen', { otherUserId: selected.id, userId: currentUser?.id });
            }
        }
    }, [selected, socket, currentUser]);

    React.useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            // Only append if it belongs to the currently selected conversation
            // Ideally we check if newMessage.senderId === selected.id or newMessage.receiverId === selected.id
            // For now, if we receive a message and the sender is the selected user, append to view
            const now = new Date(newMessage.createdAt || new Date());
            const msgObj = {
                id: newMessage.id,
                text: newMessage.text,
                sent: currentUser ? newMessage.senderId === currentUser.id : false,
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fullTime: now.toLocaleString(),
                status: newMessage.status || 'delivered'
            };

            // If we're looking at the sender, append message and mark it seen instantly
            if (selected && newMessage.senderId === selected.id) {
                setMessages(prev => [...prev, msgObj]);
                socket.emit('mark_seen', { otherUserId: selected.id, userId: currentUser?.id });
            } else {
                // Otherwise update the unread badge in conversations list (by reloading or local state)
                loadConversations();
            }
        };

        const handleMessageDelivered = (messageId) => {
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m));
        };

        const handleMessagesSeen = (userId) => {
            // If the user who saw our messages is the one we're currently looking at
            if (selected && selected.id === userId) {
                setMessages(prev => prev.map(m => (!m.sent || m.status === 'seen') ? m : { ...m, status: 'seen' }));
            }
        };

        const handleTyping = (senderId) => {
            if (selected && selected.id === senderId) {
                setIsOtherTyping(true);
            }
        };

        const handleStopTyping = (senderId) => {
            if (selected && selected.id === senderId) {
                setIsOtherTyping(false);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_delivered', handleMessageDelivered);
        socket.on('messages_seen', handleMessagesSeen);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_delivered', handleMessageDelivered);
            socket.off('messages_seen', handleMessagesSeen);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
        };
    }, [socket, selected, currentUser]);

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Typing Indicator Logic
    const typingTimeoutRef = React.useRef(null);

    const handleInputChange = (e) => {
        setInput(e.target.value);

        if (socket && selected && currentUser) {
            socket.emit('typing', { senderId: currentUser.id, receiverId: selected.id });

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stop_typing', { senderId: currentUser.id, receiverId: selected.id });
            }, 1500);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !selected) return;

        const tempId = Date.now();
        const now = new Date();
        const newMsg = {
            id: tempId,
            text: input,
            sent: true,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullTime: now.toLocaleString(),
            status: 'sent'
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsOtherTyping(false);

        try {
            const { sendMessage } = await import('../services/api');
            const resMsg = await sendMessage(selected.id, input);
            
            // Re-map our temp message ID to the real database ID so delivery updates work
            // and we set the correct status based on whether they were online and it mapped to delivered immediately
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: resMsg.id, status: resMsg.status || 'sent' } : m));

            if (socket && currentUser) {
                socket.emit('stop_typing', { senderId: currentUser.id, receiverId: selected.id });
            }
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    const handleSelectConversation = (conv) => {
        setSelected(conv);
        // On mobile, close the sidebar after selecting
        if (window.innerWidth < 900) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="chat-page">
            <Navbar />

            <div className="chat-body">

                {/* Left Sidebar — Chat List */}
                <aside className={`chat-sidebar ${sidebarOpen ? 'visible' : 'hidden'}`}>
                    <div className="chat-sidebar-header">
                        <h1>Messages</h1>
                        <input type="text" className="chat-search" placeholder="Search matches..." />
                    </div>
                    <div className="conversation-list">
                        {loading ? (
                            <div className="conv-loading">Loading...</div>
                        ) : conversations.length > 0 ? (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selected?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(conv)}
                                >
                                    <div className="conv-avatar-wrap">
                                        <img
                                            src={getPhotoUrl(conv.avatar)}
                                            alt={conv.name}
                                            className="conversation-avatar"
                                            onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        />
                                        {onlineUsers.includes(conv.id) && (
                                            <span className="online-dot-badge"></span>
                                        )}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-name-row">
                                            <h3>{conv.name}</h3>
                                            <span className="conversation-time">
                                                {conv.time ? new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className="conversation-bottom-row">
                                            <p className="conversation-last-msg">{conv.lastMsg}</p>
                                            {conv.unread > 0 && (
                                                <span className="unread-badge">{conv.unread}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="conv-empty">No messages yet.</div>
                        )}
                    </div>
                </aside>

                {/* Right Side — Chat Window */}
                <main className="chat-main">
                    {selected ? (
                        <>
                            {/* Chat Header */}
                            <header className="chat-header">
                                <button
                                    className="sidebar-toggle"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    {sidebarOpen ? '✕' : '☰'}
                                </button>
                                <div className="chat-user-info">
                                    <div className="chat-header-avatar-wrap">
                                        <img
                                            src={getPhotoUrl(selected.avatar)}
                                            alt={selected.name}
                                            className="chat-header-avatar"
                                            onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        />
                                        {onlineUsers.includes(selected.id) && (
                                            <span className="online-dot-badge"></span>
                                        )}
                                    </div>
                                    <div className="chat-header-text">
                                        <h2>{selected.name}</h2>
                                        <span className={`chat-status ${onlineUsers.includes(selected.id) ? 'status-online' : 'status-offline'}`}>
                                            {onlineUsers.includes(selected.id) ? '● Online' : '○ Offline'}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-actions">
                                    <button className="chat-action-btn" title="Options">⋮</button>
                                </div>
                            </header>

                            {/* Messages Container */}
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
                                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                            className={`message ${msg.sent ? 'message-sent' : 'message-received'}`}
                                            title={msg.fullTime}
                                        >
                                            <span className="msg-text">{msg.text}</span>
                                            <div className="msg-meta">
                                                <span className="msg-time">{msg.time}</span>
                                                {msg.sent && <MessageStatus status={msg.status} />}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Typing Indicator */}
                            <AnimatePresence>
                                {isOtherTyping && (
                                    <TypingIndicator name={selected.name} />
                                )}
                            </AnimatePresence>

                            {/* Message Input */}
                            <div className="chat-input-area">
                                <div className="chat-input-wrapper">
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                </div>
                                <button className="btn-send" onClick={handleSend} title="Send">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="chat-empty-state">
                            <button
                                className="sidebar-toggle"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{ position: 'absolute', top: '16px', left: '16px' }}
                            >
                                {sidebarOpen ? '✕' : '☰'}
                            </button>
                            <span className="chat-empty-icon">💬</span>
                            <h3>Select a conversation</h3>
                            <p>Choose a match from the sidebar to start chatting</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Chat;
