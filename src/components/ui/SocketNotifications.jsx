import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { actionUser, getPhotoUrl } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SocketNotifications = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [likesQueue, setLikesQueue] = useState([]);
    const [matchPopup, setMatchPopup] = useState(null);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveLike = (data) => {
            setLikesQueue(prev => [...prev, data]);
        };

        const handleNewMatch = (data) => {
            setMatchPopup(data);
        };

        socket.on('receiveLike', handleReceiveLike);
        socket.on('newMatch', handleNewMatch);

        return () => {
            socket.off('receiveLike', handleReceiveLike);
            socket.off('newMatch', handleNewMatch);
        };
    }, [socket]);

    const handleAcceptLike = async (userId) => {
        try {
            await actionUser(userId, 'liked');
            // Remove from queue
            setLikesQueue(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Failed to accept like', err);
        }
    };

    const handleDeclineLike = async (userId) => {
        try {
            await actionUser(userId, 'passed');
            // Remove from queue
            setLikesQueue(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Failed to decline like', err);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <AnimatePresence>
                {/* Pending Likes Flow */}
                {likesQueue.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            padding: '16px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            width: '320px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <img 
                                src={getPhotoUrl(user.photoUrl)} 
                                alt={user.name} 
                                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#111' }}>🔥 Someone liked you!</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>User: {user.name}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                onClick={() => handleAcceptLike(user.id)}
                                style={{ flex: 1, background: '#E91E63', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Accept Match
                            </button>
                            <button 
                                onClick={() => handleDeclineLike(user.id)}
                                style={{ flex: 1, background: '#E0E0E0', color: '#333', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Decline
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Match Popup Flow */}
                {matchPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000
                        }}
                    >
                        <div style={{
                            background: '#fff',
                            padding: '40px',
                            borderRadius: '24px',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%'
                        }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#E91E63' }}>🎉 It's a Match!</h2>
                            <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '24px' }}>
                                You and <strong>{matchPopup.name}</strong> liked each other.
                            </p>
                            <img 
                                src={getPhotoUrl(matchPopup.photoUrl)} 
                                alt={matchPopup.name} 
                                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #E91E63', marginBottom: '24px' }} 
                            />
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button 
                                    onClick={() => {
                                        setMatchPopup(null);
                                        navigate('/chat', { state: { userId: matchPopup.id } });
                                    }}
                                    style={{ background: '#E91E63', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Start Chatting Now
                                </button>
                                <button 
                                    onClick={() => setMatchPopup(null)}
                                    style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '14px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Keep Swiping
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocketNotifications;
