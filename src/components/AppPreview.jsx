import React from 'react';
import { motion } from 'framer-motion';
import FadeInBlock from './ui/FadeInBlock';
import TiltWrapper from './ui/TiltWrapper';
import MagneticButton from './ui/MagneticButton';
import '../styles/AppPreview.css';

const AppPreview = () => {
    return (
        <section className="app-preview-section" id="app">
            <div className="app-preview-container">
                <div className="app-preview-text">
                    <FadeInBlock>
                        <h2 className="text-reveal active">
                            <span>Science of Connection</span>
                        </h2>
                    </FadeInBlock>
                    <FadeInBlock delay={0.2}>
                        <p>Our mobile companion is designed for the modern elite. A focused, high-precision instrument for navigating your social landscape.</p>
                    </FadeInBlock>
                    
                    <div className="app-features-list">
                        <FadeInBlock delay={0.4} className="app-feature-item">
                            <span className="feature-dot"></span>
                            <div>
                                <h4>Chemistry Radar</h4>
                                <p>Real-time proximity matching with layered frequency analysis.</p>
                            </div>
                        </FadeInBlock>
                        <FadeInBlock delay={0.5} className="app-feature-item">
                            <span className="feature-dot"></span>
                            <div>
                                <h4>Secured Legacy</h4>
                                <p>Deep encryption protocols protecting every intimate interaction.</p>
                            </div>
                        </FadeInBlock>
                    </div>

                    <FadeInBlock delay={0.6} className="app-store-buttons">
                        <MagneticButton className="store-btn glass-panel">
                            App Store
                        </MagneticButton>
                        <MagneticButton className="store-btn glass-panel">
                            Play Store
                        </MagneticButton>
                    </FadeInBlock>
                </div>

                <div className="app-mockup-wrapper">
                    <TiltWrapper>
                        <motion.div 
                            className="phone-mockup glass-panel"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <div className="phone-screen">
                                <img 
                                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=90" 
                                    alt="Happy couple smiling" 
                                    className="app-screenshot"
                                />
                                <div className="phone-overlay">
                                    <div className="match-notif glass-panel">
                                        <div className="notif-content">
                                            <div className="notif-dot"></div>
                                            <span>New Echo: Isabella</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TiltWrapper>
                    
                    <motion.div 
                        className="phone-mockup-secondary glass-panel"
                        initial={{ rotateY: 20, x: 100, opacity: 0 }}
                        whileInView={{ rotateY: 10, x: 0, opacity: 0.6 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    >
                         <div className="phone-screen">
                            <img 
                                src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=500&q=90" 
                                alt="Couple on a romantic date" 
                                className="app-screenshot"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AppPreview;
