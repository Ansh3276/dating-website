import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MagneticButton from '../components/ui/MagneticButton';
import '../styles/Profile.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

const Profile = () => {
    return (
        <>
            <Navbar />
            <div className="profile-page">
                {/* Banner */}
                <div className="profile-banner">
                    <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=90"
                        alt="Sophia Reeves"
                    />
                    <div className="profile-banner-overlay" />
                    <div className="profile-banner-text">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            Sophia Reeves, 27
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            📍 New York City · Member since 2024
                        </motion.p>
                    </div>
                    <Link to="/matches">
                        <button className="profile-edit-btn">← Back to Matches</button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    {[
                        { val: '96%', key: 'Compatibility' },
                        { val: '2.4k', key: 'Profile Views' },
                        { val: '148', key: 'Likes Received' },
                        { val: '12', key: 'Connections' },
                    ].map(s => (
                        <div key={s.key} className="profile-stat">
                            <div className="stat-val">{s.val}</div>
                            <div className="stat-key">{s.key}</div>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="profile-body">
                    {/* Left column */}
                    <motion.div
                        className="profile-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <p className="profile-section-title">About Sophia</p>
                            <p className="profile-bio-text">
                                Architecture lover, early riser, and firm believer that the best conversations happen over 
                                candlelit dinners. I spend my weekends exploring the hidden courtyards of the city and my 
                                weeknights sketching buildings I'll probably never build. I'm looking for someone who finds 
                                beauty in the details — in design, in food, in people.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <p className="profile-section-title">Passions</p>
                            <div className="profile-interests">
                                {['Architecture 🏛️','Travel ✈️','Fine Dining 🍷','Photography 📸','Film 🎬','Art 🎨','Early Mornings ☀️'].map(t => (
                                    <span key={t} className="profile-interest-tag">{t}</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <p className="profile-section-title">Looking For</p>
                            <p className="profile-bio-text">
                                A thoughtful connection — someone who's equally comfortable at a gallery opening and a 
                                farmers market. Intelligence is non-negotiable, kindness is everything.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right sidebar */}
                    <motion.div
                        className="profile-right"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="profile-sidebar-card">
                            <h3>Quick Details</h3>
                            {([
                                { k: 'Age', v: '27' },
                                { k: 'Location', v: 'New York City' },
                                { k: 'Profession', v: 'Architect' },
                                { k: 'Height', v: '5\'7"' },
                                { k: 'Education', v: 'Columbia University' },
                                { k: 'Relationship', v: 'Serious connection' },
                                { k: 'Lifestyle', v: 'Active & Social' },
                            ]).map(r => (
                                <div key={r.k} className="profile-detail-row">
                                    <span>{r.k}</span>
                                    <span>{r.v}</span>
                                </div>
                            ))}
                            <div className="profile-actions" style={{ marginTop: '24px' }}>
                                <MagneticButton className="profile-msg-btn" data-cursor="pointer">
                                    💬 Send a Message
                                </MagneticButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Profile;
