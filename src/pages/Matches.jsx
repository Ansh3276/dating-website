import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Matches.css';

const TABS = [
    { id: 'mutual', label: 'Matches', icon: '❤️' },
    { id: 'incoming', label: 'Likes Received', icon: '🔥' },
    { id: 'pending', label: 'Likes Sent', icon: '✨' }
];

const Ring = ({ pct }) => {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div className="match-pct">
            <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#f5e6ec" strokeWidth="4" />
                <circle cx="26" cy="26" r={r} fill="none" stroke="#E91E63" strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
            </svg>
            <div className="match-pct-label">{pct}%</div>
        </div>
    );
};

const Matches = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mutual');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const api = await import('../services/api');
            let data = [];
            if (activeTab === 'mutual') data = await api.getMatches();
            else if (activeTab === 'incoming') data = await api.getIncomingLikes();
            else if (activeTab === 'pending') data = await api.getPendingLikes();

            const mapped = data.map(u => ({
                id: u.id,
                name: u.name,
                age: u.age,
                location: u.location,
                bio: u.bio,
                gender: u.gender || 'Not specified',
                photo: api.getPhotoUrl(u.photoUrl),
                tags: (typeof u.tags === 'string' ? JSON.parse(u.tags) : u.tags) || [],
                pct: u.pct || 90
            }));
            setList(mapped);
        } catch (err) {
            console.error(`Failed to load ${activeTab}`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleAccept = async (targetId) => {
        try {
            const { actionUser } = await import('../services/api');
            await actionUser(targetId, 'liked');
            // Optimistic update: move to mutual if they accepted
            setList(prev => prev.filter(u => u.id !== targetId));
            setActiveTab('mutual');
        } catch (err) {
            console.error('Failed to accept match', err);
        }
    };

    const handleDecline = async (targetId) => {
        try {
            const { actionUser } = await import('../services/api');
            await actionUser(targetId, 'passed');
            // Remove from local list immediately
            setList(prev => prev.filter(u => u.id !== targetId));
        } catch (err) {
            console.error('Failed to decline like', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="matches-page">
                <div className="matches-header">
                    <div className="matches-title">
                        <h1>Your Connections</h1>
                        <p>Manage your interactions and mutual matches.</p>
                    </div>
                    
                    <div className="matches-tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="active-tab-indicator" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="matches-grid">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="loading-state"
                                key="loading"
                            >
                                Loading...
                            </motion.div>
                        ) : list.length > 0 ? (
                            <motion.div 
                                className="grid-container" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                key="grid"
                            >
                                {list.map((m, i) => (
                                    <motion.div
                                        key={m.id}
                                        className="match-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                    >
                                        <div className="match-card-img-wrapper">
                                            <img 
                                                src={m.photo} 
                                                alt={m.name} 
                                                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                            />
                                            {activeTab === 'mutual' && <Ring pct={m.pct} />}
                                        </div>
                                        <div className="match-card-body">
                                            <h3>{m.name}, {m.age}</h3>
                                            <div className="match-meta-row">
                                                <p className="loc">📍 {m.location}</p>
                                                <span className="match-gender-tag">{m.gender}</span>
                                            </div>
                                            <p className="bio">{m.bio}</p>
                                            
                                            <div className="match-card-actions">
                                                {activeTab === 'mutual' && (
                                                    <button className="chat-btn" onClick={() => navigate('/chat', { state: { userId: m.id } })}>
                                                        Send Message
                                                    </button>
                                                )}
                                                {activeTab === 'incoming' && (
                                                    <div className="action-row">
                                                        <button className="accept-btn" onClick={() => handleAccept(m.id)}>
                                                            Accept Match
                                                        </button>
                                                        <button className="decline-btn" onClick={() => handleDecline(m.id)}>
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                                {activeTab === 'pending' && (
                                                    <button className="pending-indicator" disabled>
                                                        Awaiting Response...
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="empty-state"
                                key="empty"
                            >
                                <div className="empty-icon">🪹</div>
                                <h2>No {activeTab} yet</h2>
                                <p>Keep exploring to find new connections!</p>
                                <Link to="/discover" className="explore-btn">Start Swiping</Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default Matches;
