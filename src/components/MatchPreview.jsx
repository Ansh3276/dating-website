import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import TiltWrapper from './ui/TiltWrapper';
import MagneticButton from './ui/MagneticButton';
import FadeInBlock from './ui/FadeInBlock';
import '../styles/MatchPreview.css';

const CompatibilityRing = ({ percentage }) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="compatibility-ring">
            <svg width="60" height="60">
                <circle className="bg" cx="30" cy="30" r={radius} />
                <motion.circle 
                    className="bar" 
                    cx="30" cy="30" r={radius} 
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: offset }}
                    viewport={{ once: true }}
                />
            </svg>
            <div className="percentage-text" style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white'
            }}>
                {percentage}%
            </div>
        </div>
    );
};

const MatchCard = ({ name, traits, image, percentage }) => {
    return (
        <TiltWrapper>
            <div className="match-card glass-panel" data-cursor="pointer">
                <div 
                    className="match-card-bg"
                    style={{ backgroundImage: `url(${image})` }}
                />
                
                <CompatibilityRing percentage={percentage} />
                
                <div className="match-card-content">
                    <div className="match-info">
                        <h3>{name}</h3>
                        <p>{traits}</p>
                        
                        <div className="match-actions">
                            <MagneticButton className="action-btn pass-btn">
                                <X size={20} />
                            </MagneticButton>
                            <MagneticButton className="action-btn like-btn">
                                <Heart size={20} fill="currentColor" />
                            </MagneticButton>
                        </div>
                    </div>
                </div>
            </div>
        </TiltWrapper>
    );
};

const MatchPreview = () => {
    return (
        <section className="match-preview-section" id="match">
            <div className="match-preview-container">
                <FadeInBlock className="match-text-content">
                    <h2 className="text-reveal active">
                        <span>AI Match Preview</span>
                    </h2>
                    <p>Our proprietary compatibility engine uses deep learning to identify the invisible sparks that lead to lasting connections.</p>
                </FadeInBlock>
                
                <div className="match-cards-container">
                    <MatchCard 
                        name="Emma, 28" 
                        traits="Art Curator • Travel Enthusiast" 
                        image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" 
                        percentage={92}
                    />
                     <MatchCard 
                        name="Julian, 31" 
                        traits="Architect • Wilderness Photographer" 
                        image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80" 
                        percentage={88}
                    />
                </div>
            </div>
        </section>
    );
};

export default MatchPreview;
