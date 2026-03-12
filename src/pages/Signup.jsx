import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import FloatingBackground from '../components/ui/FloatingBackground';
import '../styles/Auth.css';
import '../styles/Signup.css';

const STEPS = [
    { id: 0, label: 'About You' },
    { id: 1, label: 'Your Story' },
    { id: 2, label: 'Preferences' },
    { id: 3, label: 'Done' },
];

const INTERESTS = [
    'Travel ✈️','Reading 📚','Music 🎵','Film 🎬','Cooking 🍳',
    'Fitness 💪','Art 🎨','Wine 🍷','Hiking 🏔️','Theatre 🎭',
    'Fashion 👗','Architecture 🏛️','Photography 📸','Yoga 🧘',
];

const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
};

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        firstName: '', age: '', email: '', password: '',
        bio: '', interests: [],
    });

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleInterest = (i) => {
        const cur = form.interests;
        setForm({
            ...form,
            interests: cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i],
        });
    };

    const next = () => step < 3 ? setStep(step + 1) : navigate('/matches');
    const back = () => step > 0 && setStep(step - 1);

    return (
        <>
            <FloatingBackground />
            <Navbar />
            <div className="auth-page">
                {/* Left — multi-step form */}
                <motion.div
                    className="auth-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Link to="/" className="auth-logo">
                        <span>NANO</span><strong>MATCH</strong>
                    </Link>

                    {/* Step progress */}
                    <div className="signup-progress">
                        {STEPS.map((s) => (
                            <div
                                key={s.id}
                                className={`progress-step ${step >= s.id ? 'active' : ''} ${step === s.id ? 'current' : ''}`}
                            >
                                <div className="progress-dot">{step > s.id ? '✓' : s.id + 1}</div>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-card signup-card">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                                    <h1>Let's start with you.</h1>
                                    <p className="subtitle">Tell us a bit about yourself so we can find your ideal match.</p>
                                    <div className="field-group">
                                        <div>
                                            <label className="field-label">First Name</label>
                                            <input className="field-input" name="firstName" placeholder="e.g. Sophia" value={form.firstName} onChange={change} />
                                        </div>
                                        <div>
                                            <label className="field-label">Age</label>
                                            <input className="field-input" name="age" type="number" placeholder="25" min="18" max="80" value={form.age} onChange={change} />
                                        </div>
                                        <div>
                                            <label className="field-label">Email</label>
                                            <input className="field-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} />
                                        </div>
                                        <div>
                                            <label className="field-label">Password</label>
                                            <input className="field-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={change} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                                    <h1>Your story.</h1>
                                    <p className="subtitle">Write a bio that captures who you really are — not just what you do.</p>
                                    <div className="field-group">
                                        <div>
                                            <label className="field-label">Bio</label>
                                            <textarea
                                                className="field-input"
                                                name="bio"
                                                placeholder="I'm passionate about early morning hikes, Italian cinema, and finding the best hole-in-the-wall restaurants..."
                                                rows={5}
                                                value={form.bio}
                                                onChange={change}
                                                style={{ resize: 'none', borderRadius: 16 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }}>
                                    <h1>What moves you?</h1>
                                    <p className="subtitle">Select your passions — we use these to calibrate your matches.</p>
                                    <div className="interests-grid">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest}
                                                className={`interest-chip ${form.interests.includes(interest) ? 'selected' : ''}`}
                                                onClick={() => toggleInterest(interest)}
                                                type="button"
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} style={{ textAlign: 'center' }}>
                                    <div className="done-icon">💖</div>
                                    <h1>You're in, {form.firstName || 'there'}.</h1>
                                    <p className="subtitle">Your profile is ready. We've curated your first set of matches — each one chosen with intention.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="signup-nav">
                            {step > 0 && <button className="auth-btn-social" onClick={back} style={{ width: 'auto', padding: '14px 28px' }}>← Back</button>}
                            <button className="auth-btn-primary" onClick={next} style={{ flex: 1 }}>
                                {step === 3 ? 'Explore My Matches →' : step === 2 ? 'Almost There →' : 'Continue →'}
                            </button>
                        </div>

                        {step === 0 && (
                            <p className="auth-footer-text">
                                Already a member? <Link to="/login">Sign in</Link>
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Right — image */}
                <div className="auth-right">
                    <img
                        src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=900&q=90"
                        alt="Couple"
                    />
                    <div className="auth-right-overlay">
                        <h2>It starts with a single step.</h2>
                        <p>Thousands of meaningful connections start right here, right now.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
