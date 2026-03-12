import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeInBlock from './ui/FadeInBlock';
import MagneticButton from './ui/MagneticButton';
import '../styles/CTASection.css';

const CTASection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section className="cta-section" ref={ref}>
            <motion.div 
                className="cta-bg-parallax" 
                style={{ y, backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=80)' }}
            />
            <div className="cta-overlay" />
            
            <div className="cta-beams">
                <div className="beam"></div>
                <div className="beam"></div>
                <div className="beam"></div>
                <div className="beam"></div>
            </div>
            
            <FadeInBlock className="cta-content">
                <span className="cta-eyebrow">The Next Chapter</span>
                <h2 className="text-reveal active">
                    <span>Rewrite Your Destiny.</span>
                </h2>
                <p>Private Admissions Now Open.</p>
                <div className="cta-button-wrap">
                    <MagneticButton className="cta-primary-btn" data-cursor="pointer">
                        Begin the Journey
                    </MagneticButton>
                </div>
            </FadeInBlock>
        </section>
    );
};

export default CTASection;
