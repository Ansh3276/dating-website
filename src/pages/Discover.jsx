import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPhotoUrl } from '../services/api';
import '../styles/Discover.css';


/* ── Heart Particle Explosion ── */
const HeartParticle = ({ x, y, delay }) => (
    <motion.span
        className="heart-particle"
        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        animate={{
            opacity: 0,
            x: x,
            y: y,
            scale: 0,
            rotate: Math.random() * 360,
        }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    >
        ❤️
    </motion.span>
);

const HeartExplosion = ({ show }) => {
    if (!show) return null;
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300 - 100,
        delay: Math.random() * 0.15,
    }));

    return (
        <div className="heart-explosion">
            {particles.map(p => (
                <HeartParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />
            ))}
        </div>
    );
};

/* ── X Particle for Reject ── */
const RejectBurst = ({ show }) => {
    if (!show) return null;
    return (
        <motion.div
            className="reject-burst"
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            ✕
        </motion.div>
    );
};

/* ── Match Modal ── */
const MatchModal = ({ show, matchedPerson, currentUserPhoto, onChat, onKeepSwiping }) => {
    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="match-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="match-modal"
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 40 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
                >
                    {/* Confetti particles */}
                    <div className="match-confetti">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.span
                                key={i}
                                className="confetti-piece"
                                initial={{ opacity: 1, y: 0, x: 0 }}
                                animate={{
                                    opacity: 0,
                                    y: (Math.random() - 0.5) * 400,
                                    x: (Math.random() - 0.5) * 300,
                                    rotate: Math.random() * 720,
                                }}
                                transition={{ duration: 1.5, delay: Math.random() * 0.3, ease: 'easeOut' }}
                            />
                        ))}
                    </div>

                    <motion.h2
                        className="match-title"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        It's a Match! 🎉
                    </motion.h2>
                    <p className="match-subtitle">You and {matchedPerson?.name} liked each other</p>

                    <div className="match-avatars">
                        <motion.div
                            className="match-avatar-wrapper"
                            initial={{ x: -60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                        >
                            <img
                                src={currentUserPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                alt="You"
                                className="match-avatar"
                                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            />
                        </motion.div>
                        <motion.div
                            className="match-heart-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 400 }}
                        >
                            ❤️
                        </motion.div>
                        <motion.div
                            className="match-avatar-wrapper"
                            initial={{ x: 60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                        >
                            <img
                                src={matchedPerson?.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                alt={matchedPerson?.name}
                                className="match-avatar"
                                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            />
                        </motion.div>
                    </div>

                    <div className="match-actions">
                        <button className="match-btn match-btn-chat" onClick={onChat}>
                            💬 Start Chat
                        </button>
                        <button className="match-btn match-btn-swipe" onClick={onKeepSwiping}>
                            Keep Swiping
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ── Swipe Card ── */
const DiscoverCard = ({ person, onSwipe, isTop, direction }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);
    const likeOpacity = useTransform(x, [0, 80], [0, 1]);
    const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

    const handleDragEnd = (_, info) => {
        const threshold = 100;
        const velocityThreshold = 500;

        if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
            onSwipe('right');
        } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            className="discover-card"
            style={{ x, rotate, zIndex: isTop ? 10 : 1 }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            whileTap={isTop ? { scale: 1.02 } : {}}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={(direction) => ({
                x: direction === 'right' ? 800 : direction === 'left' ? -800 : (x.get() > 0 ? 800 : -800),
                opacity: 0,
                rotate: direction === 'right' ? 30 : direction === 'left' ? -30 : (x.get() > 0 ? 30 : -30)
            })}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            custom={isTop ? direction : null}
        >
            <img
                src={person.image}
                alt={person.name}
                className="discover-card-img"
                draggable={false}
                onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            />

            {/* LIKE / NOPE overlays */}
            <motion.div className="swipe-label like-label" style={{ opacity: likeOpacity }}>
                LIKE
            </motion.div>
            <motion.div className="swipe-label nope-label" style={{ opacity: nopeOpacity }}>
                NOPE
            </motion.div>

            <div className="discover-card-overlay">
                <div className="discover-card-info">
                    <div className="discover-name-row">
                        <h2>{person.name}, {person.age}</h2>
                    </div>
                    <div className="discover-meta-row">
                        <p className="discover-location">📍 {person.location}</p>
                    </div>
                    <p className="discover-bio">{person.bio}</p>
                    <div className="discover-card-tags">
                        {person.tags.map(tag => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Main Page ── */
const Discover = () => {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHearts, setShowHearts] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [lastDirection, setLastDirection] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Match modal state
    const [showMatch, setShowMatch] = useState(false);
    const [matchedPerson, setMatchedPerson] = useState(null);

    const loadPeople = async () => {
        try {
            const apiServices = await import('../services/api');
            const data = await apiServices.getDiscoverUsers();
            const mapped = data.map(u => ({
                id: u.id,
                name: u.name,
                age: u.age,
                location: u.location,
                bio: u.bio,
                gender: u.gender || 'Not specified',
                image: apiServices.getPhotoUrl(u.photoUrl),
                tags: (typeof u.tags === 'string' ? JSON.parse(u.tags) : u.tags) || [],
                compatibility: Math.floor(Math.random() * 15) + 85,
            }));
            setPeople(mapped);
        } catch (err) {
            console.error('Failed to load people', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadPeople();
        const fetchUser = async () => {
            try {
                const { getMe } = await import('../services/api');
                const user = await getMe();
                setCurrentUser(user);
            } catch (err) {
                console.error('Failed to get current user', err);
            }
        };
        fetchUser();
    }, []);

    const handleSwipe = useCallback(async (direction) => {
        const swipedPerson = people[people.length - 1];
        if (!swipedPerson) return;

        setLastDirection(direction);
        if (direction === 'right') {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 900);
        } else {
            setShowReject(true);
            setTimeout(() => setShowReject(false), 600);
        }

        try {
            const { actionUser } = await import('../services/api');
            const result = await actionUser(swipedPerson.id, direction === 'right' ? 'liked' : 'passed');

            // Check if a match occurred
            if (result && result.matched) {
                setMatchedPerson(swipedPerson);
                setTimeout(() => setShowMatch(true), 400);
            }
        } catch (err) {
            console.error('Failed to record swipe', err);
        }

        setPeople(prev => prev.slice(0, -1));
    }, [people]);

    const handleMatchChat = () => {
        setShowMatch(false);
        if (matchedPerson) {
            navigate('/chat', { state: { userId: matchedPerson.id } });
        }
    };

    const handleKeepSwiping = () => {
        setShowMatch(false);
        setMatchedPerson(null);
    };

    return (
        <div className="discover-page">
            <Navbar />

            <div className="discover-layout">
                {/* Left Panel — Filters */}
                <aside className="discover-sidebar left-sidebar">
                    <div className="sidebar-section">
                        <h3>Match Preferences</h3>

                        <div className="filter-group">
                            <label>I'm interested in</label>
                            <div className="filter-options">
                                <button className="filter-btn active">Women</button>
                                <button className="filter-btn">Men</button>
                                <button className="filter-btn">All</button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Age Range</label>
                            <input type="range" min="18" max="60" defaultValue="35" className="range-slider" />
                            <div className="range-labels">
                                <span>18</span>
                                <span>35</span>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Maximum Distance</label>
                            <input type="range" min="1" max="100" defaultValue="25" className="range-slider" />
                            <div className="range-labels">
                                <span>1 km</span>
                                <span>25 km</span>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Interests</label>
                            <div className="interest-chips">
                                <span className="chip active">Travel</span>
                                <span className="chip active">Music</span>
                                <span className="chip">Fitness</span>
                                <span className="chip">Photography</span>
                                <span className="chip">Coffee</span>
                                <span className="chip">Reading</span>
                                <span className="chip">Gaming</span>
                                <span className="chip">Cooking</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center Panel — Swipe Cards */}
                <main className="discover-center">
                    <div className="discover-header">
                        <motion.span
                            className="eyebrow"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            ✦ Curated For You
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Discover
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Swipe right to like, left to pass.
                        </motion.p>
                    </div>

                    <div className="discover-container">
                        <HeartExplosion show={showHearts} />
                        <RejectBurst show={showReject} />
                        <AnimatePresence custom={lastDirection}>
                            {people.length > 0 ? (
                                people.map((person, index) => (
                                    <DiscoverCard
                                        key={person.id}
                                        person={person}
                                        onSwipe={handleSwipe}
                                        isTop={index === people.length - 1}
                                        direction={lastDirection}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    className="discover-empty"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="discover-empty-icon">✨</span>
                                    <h2>No more people today.</h2>
                                    <p>Come back tomorrow for more curated matches.</p>
                                    <button
                                        className="reset-btn"
                                        onClick={loadPeople}
                                        data-cursor="pointer"
                                    >
                                        Refresh Discovery
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {people.length > 0 && (
                        <motion.div
                            className="discover-controls"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <button className="control-btn btn-pass" onClick={() => handleSwipe('left')} data-cursor="pointer">
                                <span>✕</span>
                            </button>
                            <button className="control-btn btn-like" onClick={() => handleSwipe('right')} data-cursor="pointer">
                                <span>♥</span>
                            </button>
                        </motion.div>
                    )}
                </main>
            </div>

            {/* Match Modal */}
            <MatchModal
                show={showMatch}
                matchedPerson={matchedPerson}
                currentUserPhoto={currentUser ? getPhotoUrl(currentUser.photoUrl) : null}
                onChat={handleMatchChat}
                onKeepSwiping={handleKeepSwiping}
            />
        </div>
    );
};

export default Discover;
