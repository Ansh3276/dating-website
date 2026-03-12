import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import '../styles/HowItWorks.css';

const steps = [
    {
        number: '01',
        title: 'Craft Your Story',
        description: 'Build an expressive, multi-dimensional profile. Not just photos — your voice, your values, your world. Let your essence speak before your words do.',
        accent: 'Authenticity First',
    },
    {
        number: '02',
        title: 'The Algorithm Awakens',
        description: 'Our proprietary AI analyzes 200+ compatibility vectors: attachment styles, love languages, life trajectory alignment, and the invisible frequency of chemistry.',
        accent: 'Deep Intelligence',
    },
    {
        number: '03',
        title: 'A Curated Reveal',
        description: 'Each day, a handpicked selection awaits. Not an endless scroll — a deliberate, thoughtful introduction to someone who could genuinely change your story.',
        accent: 'Quality Over Quantity',
    },
    {
        number: '04',
        title: 'The First Encounter',
        description: 'Voice memos, cinematic video prompts, and text that goes beyond small talk. We architect the conditions for real connection, not performative first impressions.',
        accent: 'Depth From Day One',
    },
];

const StepCard = ({ step, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            className={`step-card ${isEven ? 'step-card--left' : 'step-card--right'}`}
            initial={{ opacity: 0, x: isEven ? -60 : 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
            <div className="step-number">{step.number}</div>
            <div className="step-content">
                <p className="step-accent">{step.accent}</p>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
            </div>
        </motion.div>
    );
};

const HowItWorks = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // The vertical progress line that draws as you scroll
    const lineScaleY = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

    return (
        <section ref={containerRef} className="how-it-works-section" id="how">
            <div className="how-it-works-container">
                {/* Section Header */}
                <div className="how-header">
                    <motion.p
                        className="how-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        The Process
                    </motion.p>
                    <motion.h2
                        className="how-title"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Engineered for<br />
                        <span className="text-gradient">Meaningful Discovery.</span>
                    </motion.h2>
                </div>

                {/* Timeline */}
                <div className="timeline-wrapper">
                    {/* Animated vertical line */}
                    <div className="timeline-track">
                        <motion.div
                            className="timeline-line"
                            style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
                        />
                    </div>

                    {/* Step cards */}
                    <div className="steps-list">
                        {steps.map((step, i) => (
                            <StepCard key={i} step={step} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
