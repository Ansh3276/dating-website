import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FloatingBackground from '../components/ui/FloatingBackground';
import '../styles/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to matches after "login"
        navigate('/matches');
    };

    return (
        <>
            <FloatingBackground />
            <Navbar />
            <div className="auth-page">
                {/* Left — form */}
                <motion.div
                    className="auth-left"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/" className="auth-logo">
                        <span>NANO</span><strong>MATCH</strong>
                    </Link>

                    <div className="auth-card">
                        <h1>Welcome back.</h1>
                        <p className="subtitle">Sign in to continue your journey towards a meaningful connection.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="field-group">
                                <div>
                                    <label className="field-label">Email</label>
                                    <input
                                        className="field-input"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="field-label">Password</label>
                                    <input
                                        className="field-input"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="auth-btn-primary" type="submit">
                                Sign In
                            </button>
                        </form>

                        <div className="auth-divider">or</div>

                        <button className="auth-btn-social">
                            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>
                        <button className="auth-btn-social">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                            Continue with Apple
                        </button>

                        <p className="auth-footer-text">
                            Don't have an account? <Link to="/signup">Apply for membership</Link>
                        </p>
                    </div>
                </motion.div>

                {/* Right — cinematic image */}
                <div className="auth-right">
                    <img
                        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&q=90"
                        alt="Couple"
                    />
                    <div className="auth-right-overlay">
                        <h2>Every match is a story waiting to be written.</h2>
                        <p>Join 2.4 million members who chose depth over distance.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
