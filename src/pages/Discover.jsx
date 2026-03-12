import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Discover.css';

const DISCOVER_DATA = [
    {
        id: 1,
        name: 'Elena Vance',
        age: 24,
        location: 'Brooklyn, NY',
        bio: 'Art director and weekend florist. I live for long walks in Central Park and hidden jazz bars.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
        tags: ['Jazz', 'Design', 'Flora'],
        compatibility: 94,
    },
    {
        id: 2,
        name: 'Marcus Thorne',
        age: 28,
        location: 'Chelsea, NY',
        bio: 'Tech founder by day, surfer by dawn. Looking for someone who values ambition and adventure.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
        tags: ['Tech', 'Surfing', 'Adventure'],
        compatibility: 87,
    },
    {
        id: 3,
        name: 'Sienna Miller',
        age: 26,
        location: 'Upper East Side, NY',
        bio: 'Literature student with a love for classic cinema and vintage bookstores.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        tags: ['Literature', 'Cinema', 'Vintage'],
        compatibility: 91,
    },
    {
        id: 4,
        name: 'Julian Rose',
        age: 30,
        location: 'West Village, NY',
        bio: 'Chef specializing in Italian cuisine. I believe a good meal can solve almost anything.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        tags: ['Cooking', 'Wine', 'Travel'],
        compatibility: 82,
    },
    {
        id: 5,
        name: 'Ava Lin',
        age: 25,
        location: 'SoHo, NY',
        bio: 'Photographer and world traveler. Always chasing golden light and new stories.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
        tags: ['Photography', 'Travel', 'Culture'],
        compatibility: 96,
    },
];

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
                        <span className="compat-badge">{person.compatibility}%</span>
                    </div>
                    <p className="discover-location">📍 {person.location}</p>
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
    const [people, setPeople] = useState(DISCOVER_DATA);
    const [showHearts, setShowHearts] = useState(false);
    const [lastDirection, setLastDirection] = useState(null);

    const handleSwipe = useCallback((direction) => {
        setLastDirection(direction);
        if (direction === 'right') {
            setShowHearts(true);
            setTimeout(() => setShowHearts(false), 900);
        }
        console.log(`Swiped ${direction} on ${people[people.length - 1].name}`);
        setPeople(prev => prev.slice(0, -1));
    }, [people]);

    return (
        <div className="discover-page">
            <Navbar />

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
                    Swipe right to like, left to pass. Every match is AI-curated.
                </motion.p>
            </div>

            <div className="discover-container">
                <HeartExplosion show={showHearts} />
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
                                onClick={() => setPeople(DISCOVER_DATA)}
                                data-cursor="pointer"
                            >
                                Reset Discovery
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
        </div>
    );
};

export default Discover;
