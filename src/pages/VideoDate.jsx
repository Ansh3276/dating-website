import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/VideoDate.css';

const FEATURES = [
    {
        icon: '🎬',
        title: 'HD Quality',
        desc: 'Crystal-clear video powered by adaptive streaming — looks great on any connection.',
    },
    {
        icon: '🔒',
        title: 'End-to-End Encrypted',
        desc: 'Your conversation stays between you and your match. Always private, always secure.',
    },
    {
        icon: '✨',
        title: 'AI Enhancement',
        desc: 'Smart lighting correction and background blur keep you looking your absolute best.',
    },
];

const VideoDate = () => {
    return (
        <div className="videodate-page">
            <Navbar />

            <motion.div
                className="videodate-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <span className="eyebrow">✦ Video Dating</span>
                <h1>Face to Face.</h1>
                <p>Skip the texting phase. Start a video date and experience real chemistry in real time.</p>
            </motion.div>

            <motion.div
                className="videodate-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="video-feed-main">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80"
                        alt="Video date partner"
                    />
                    <div className="video-overlay-gradient" />
                    <div className="video-partner-name">
                        <h3>Elena Vance</h3>
                        <span>Brooklyn, NY · 24</span>
                    </div>
                </div>

                <div className="video-self">
                    <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                        alt="You"
                    />
                </div>
            </motion.div>

            <motion.div
                className="videodate-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <button className="vd-control" data-cursor="pointer" title="Mute">🎤</button>
                <button className="vd-control" data-cursor="pointer" title="Camera Off">📷</button>
                <button className="vd-control" data-cursor="pointer" title="Effects">✨</button>
                <button className="vd-control end-call" data-cursor="pointer" title="End Call">📞</button>
                <button className="vd-control" data-cursor="pointer" title="Chat">💬</button>
            </motion.div>

            <div className="videodate-features">
                {FEATURES.map((f, i) => (
                    <motion.div
                        key={f.title}
                        className="vd-feature-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    >
                        <div className="vd-feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default VideoDate;
