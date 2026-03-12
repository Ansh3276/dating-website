import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Notifications.css';

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'match',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        title: 'New Match!',
        body: 'You matched with Elena Vance. Start a conversation now.',
        time: '2 min ago',
        unread: true,
    },
    {
        id: 2,
        type: 'like',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
        title: 'Someone Liked You',
        body: 'Marcus Thorne liked your profile. Like them back?',
        time: '18 min ago',
        unread: true,
    },
    {
        id: 3,
        type: 'message',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
        title: 'New Message',
        body: 'Sienna: "Hey! I loved your taste in films 🎬"',
        time: '1 hr ago',
        unread: false,
    },
    {
        id: 4,
        type: 'promo',
        avatar: null,
        title: 'Upgrade to Elite',
        body: 'Unlock unlimited likes, rewinds, and see who liked you.',
        time: '3 hr ago',
        unread: false,
    },
    {
        id: 5,
        type: 'system',
        avatar: null,
        title: 'Profile Boost Active',
        body: 'Your profile is being shown to 10× more people for the next 30 minutes.',
        time: '5 hr ago',
        unread: false,
    },
    {
        id: 6,
        type: 'like',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        title: 'Someone Liked You',
        body: 'Julian Rose liked your profile.',
        time: 'Yesterday',
        unread: false,
    },
    {
        id: 7,
        type: 'match',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
        title: "It's a Match!",
        body: "You and Ava Lin both swiped right. Don't let this moment pass.",
        time: 'Yesterday',
        unread: false,
    },
    {
        id: 8,
        type: 'system',
        avatar: null,
        title: 'Safety Reminder',
        body: 'Remember to meet in public places. Your safety always comes first.',
        time: '2 days ago',
        unread: false,
    },
];

const TYPE_ICONS = {
    match: '💘',
    like: '❤️',
    message: '💬',
    promo: '✨',
    system: '🔔',
};

const TYPE_COLORS = {
    match: '#E91E63',
    like: '#FF4081',
    message: '#9C27B0',
    promo: '#FF9800',
    system: '#607D8B',
};

const Notifications = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState('all');

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filtered = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(n => n.unread)
            : notifications.filter(n => n.type === filter);

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="notifications-page">
            <Navbar />

            <div className="notif-container">
                <motion.div
                    className="notif-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="notif-title-row">
                        <h1>Notifications</h1>
                        {unreadCount > 0 && (
                            <motion.span
                                className="notif-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </div>
                    <p className="notif-subtitle">Stay in the loop with your connections.</p>

                    <div className="notif-actions-row">
                        <div className="notif-filters">
                            {['all', 'unread', 'match', 'like', 'message'].map(f => (
                                <button
                                    key={f}
                                    className={`notif-filter-btn ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                    data-cursor="pointer"
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        {unreadCount > 0 && (
                            <button className="notif-mark-read" onClick={markAllRead} data-cursor="pointer">
                                Mark all read
                            </button>
                        )}
                    </div>
                </motion.div>

                <div className="notif-list">
                    <AnimatePresence>
                        {filtered.length > 0 ? (
                            filtered.map((n, i) => (
                                <motion.div
                                    key={n.id}
                                    className={`notif-item ${n.unread ? 'unread' : ''}`}
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0, padding: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    layout
                                >
                                    <div
                                        className="notif-icon"
                                        style={{ background: `${TYPE_COLORS[n.type]}15`, color: TYPE_COLORS[n.type] }}
                                    >
                                        {n.avatar ? (
                                            <img src={n.avatar} alt="" className="notif-avatar" />
                                        ) : (
                                            <span className="notif-emoji">{TYPE_ICONS[n.type]}</span>
                                        )}
                                        {n.unread && <span className="notif-pulse" style={{ borderColor: TYPE_COLORS[n.type] }} />}
                                    </div>

                                    <div className="notif-content">
                                        <div className="notif-content-header">
                                            <h3>{n.title}</h3>
                                            <span className="notif-time">{n.time}</span>
                                        </div>
                                        <p>{n.body}</p>
                                    </div>

                                    <button
                                        className="notif-dismiss"
                                        onClick={() => dismissNotification(n.id)}
                                        data-cursor="pointer"
                                        aria-label="Dismiss"
                                    >
                                        ✕
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="notif-empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="notif-empty-icon">🔔</span>
                                <h3>All caught up!</h3>
                                <p>No notifications to display right now.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
