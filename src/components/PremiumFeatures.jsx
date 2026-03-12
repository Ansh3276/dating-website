import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Compass, Shield, Video } from 'lucide-react';
import TiltWrapper from './ui/TiltWrapper';
import FadeInBlock from './ui/FadeInBlock';
import '../styles/PremiumFeatures.css';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
    return (
        <FadeInBlock delay={delay}>
            <TiltWrapper>
                <div className="feature-card glass-panel" data-cursor="pointer">
                    <div className="feature-icon-wrapper">
                        <Icon size={28} className="feature-icon" />
                    </div>
                    <div>
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                </div>
            </TiltWrapper>
        </FadeInBlock>
    );
};

const PremiumFeatures = () => {
    const features = [
        {
            icon: Sparkles,
            title: "AI Precision",
            description: "Deep learning models that identify sparks before you even swipe."
        },
        {
            icon: Mic,
            title: "Vocal Soul",
            description: "Authentic voice prompts that capture the true essence of a connection."
        },
        {
            icon: Compass,
            title: "Life Radar",
            description: "Filter for values, growth, and the core metrics of a lasting legacy."
        },
        {
            icon: Shield,
            title: "Elite Privacy",
            description: "Ghost mode active. You are only visible to the souls you choose to encounter."
        },
        {
            icon: Video,
            title: "Cinematic Self",
            description: "High-definition video storytelling that moves beyond the static frame."
        }
    ];

    return (
        <section className="premium-features-section" id="features">
            <div className="features-container">
                <FadeInBlock className="features-header">
                    <h2 className="text-reveal active">
                        <span>Elite Refinement.</span>
                    </h2>
                    <p>Designed for those who seek the extraordinary. A suite of advanced tools to navigate the modern romantic landscape with cinematic precision.</p>
                </FadeInBlock>
                
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index} 
                            {...feature} 
                            delay={0.1 * index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumFeatures;
