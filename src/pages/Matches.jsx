import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Matches.css';

const MATCHES = [
    {
        id: 1,
        name: 'Sophia Reeves',
        age: 27,
        location: 'New York City',
        bio: 'Architecture lover, early riser, and firm believer that the best conversations happen over candlelit dinners.',
        pct: 96,
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=85',
        tags: ['Architecture', 'Travel', 'Fine Dining'],
    },
    {
        id: 2,
        name: 'Isabelle Chen',
        age: 29,
        location: 'San Francisco',
        bio: 'Documentary filmmaker chasing stories across continents. I believe depth is the ultimate luxury.',
        pct: 91,
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=85',
        tags: ['Film', 'Art', 'Yoga'],
    },
    {
        id: 3,
        name: 'Camille Rousseau',
        age: 31,
        location: 'Paris',
        bio: 'Sommelier by day, amateur painter by night. Looking for someone who appreciates both silence and laughter.',
        pct: 89,
        photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=85',
        tags: ['Wine', 'Art', 'Cooking'],
    },
    {
        id: 4,
        name: 'Ayla Demir',
        age: 26,
        location: 'London',
        bio: 'Product designer with a weakness for Turkish coffee and bookshop rabbit holes.',
        pct: 87,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=85',
        tags: ['Design', 'Reading', 'Coffee'],
    },
    {
        id: 5,
        name: 'Julia Martens',
        age: 30,
        location: 'Amsterdam',
        bio: 'Marine biologist and part-time adventurer. My ideal date is a boat ride that ends in a hidden cove.',
        pct: 84,
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=85',
        tags: ['Hiking', 'Fitness', 'Travel'],
    },
    {
        id: 6,
        name: 'Priya Nair',
        age: 28,
        location: 'Mumbai',
        bio: 'Startup founder who believes the best ideas come on long walks. My playlists are embarrassingly eclectic.',
        pct: 82,
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=85',
        tags: ['Music', 'Fitness', 'Fashion'],
    },
];

const FILTERS = ['All', 'Nearby', 'Highly Compatible', 'New'];

// Minimal SVG ring for compatibility %
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
    const [active, setActive] = useState('All');
    const [liked, setLiked] = useState(new Set());

    const toggleLike = (id) => {
        const s = new Set(liked);
        s.has(id) ? s.delete(id) : s.add(id);
        setLiked(s);
    };

    return (
        <>
            <Navbar />
            <div className="matches-page">
                {/* Header */}
                <div className="matches-header">
                    <div className="matches-title">
                        <h1>Your Matches</h1>
                        <p>✦ Curated by AI · updated daily</p>
                    </div>
                    <div className="matches-filters">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`filter-chip ${active === f ? 'active' : ''}`}
                                onClick={() => setActive(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="matches-grid">
                    {MATCHES.map((m, i) => (
                        <motion.div
                            key={m.id}
                            className="match-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                        >
                            <img
                                className="match-card-photo"
                                src={m.photo}
                                alt={m.name}
                                onClick={() => navigate('/profile')}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="match-card-body">
                                <div className="match-card-name">
                                    <div>
                                        <h3>{m.name}</h3>
                                        <span>{m.age} · {m.location}</span>
                                    </div>
                                    <Ring pct={m.pct} />
                                </div>
                                <p className="match-card-bio">{m.bio}</p>
                                <div className="match-card-tags">
                                    {m.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                </div>
                                <div className="match-card-actions">
                                    <motion.button
                                        className={`btn-like ${liked.has(m.id) ? 'liked' : ''}`}
                                        onClick={() => toggleLike(m.id)}
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <motion.span 
                                            initial={false}
                                            animate={{ scale: liked.has(m.id) ? [1, 1.4, 1] : 1 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ display: 'inline-block', marginRight: '6px' }}
                                        >
                                            {liked.has(m.id) ? '❤' : '♡'}
                                        </motion.span>
                                        {liked.has(m.id) ? 'Interested' : 'Send Interest'}
                                    </motion.button>
                                    <button className="btn-pass" data-cursor="pointer">Pass</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Matches;
