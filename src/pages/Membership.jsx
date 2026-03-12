import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Membership.css';

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        amount: '0',
        period: '/month',
        desc: 'Begin your journey. Explore the platform and discover what meaningful dating feels like.',
        features: [
            { label: '5 curated matches / week', on: true },
            { label: 'Basic profile creation', on: true },
            { label: 'Send up to 3 messages / day', on: true },
            { label: 'AI compatibility score', on: false },
            { label: 'Read receipts', on: false },
            { label: 'Priority placement', on: false },
            { label: 'Concierge date planning', on: false },
        ],
        cta: 'Get started free',
        ctaClass: 'plan-cta--outline',
        featured: false,
    },
    {
        id: 'gold',
        name: 'Gold',
        amount: '29',
        period: '/month',
        desc: 'For those ready to go deeper. Unlocks everything you need for a genuine connection.',
        features: [
            { label: 'Unlimited matches', on: true },
            { label: 'Full profile customisation', on: true },
            { label: 'Unlimited messaging', on: true },
            { label: 'AI compatibility score', on: true },
            { label: 'Read receipts', on: true },
            { label: 'Priority placement', on: false },
            { label: 'Concierge date planning', on: false },
        ],
        cta: 'Start Gold',
        ctaClass: 'plan-cta--primary',
        featured: true,
        badge: '✦ Most Popular',
    },
    {
        id: 'elite',
        name: 'Elite',
        amount: '79',
        period: '/month',
        desc: 'A white-glove experience. For members who demand the absolute best in curated matchmaking.',
        features: [
            { label: 'Unlimited matches', on: true },
            { label: 'Full profile customisation', on: true },
            { label: 'Unlimited messaging', on: true },
            { label: 'AI compatibility score', on: true },
            { label: 'Read receipts', on: true },
            { label: 'Priority placement', on: true },
            { label: 'Concierge date planning', on: true },
        ],
        cta: 'Apply for Elite',
        ctaClass: 'plan-cta--outline',
        featured: false,
    },
];

const Membership = () => (
    <>
        <Navbar />
        <div className="membership-page">
            {/* Hero */}
            <div className="membership-hero">
                <motion.span
                    className="eyebrow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    ✦ Membership
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Invest in your love life.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Every plan includes our award-winning matching algorithm. 
                    Choose the depth of experience that feels right for you.
                </motion.p>
            </div>

            {/* Pricing grid */}
            <div className="pricing-grid">
                {PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}
                        whileHover={{ y: -8, scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 }}
                    >
                        {plan.badge && <div className="popular-badge">{plan.badge}</div>}

                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-price">
                            {plan.amount !== '0' && <span className="currency">$</span>}
                            <span className="amount">{plan.amount === '0' ? 'Free' : plan.amount}</span>
                            {plan.amount !== '0' && <span className="period">{plan.period}</span>}
                        </div>
                        <p className="plan-desc">{plan.desc}</p>

                        <ul className="features-list">
                            {plan.features.map(f => (
                                <li key={f.label}>
                                    <span className={f.on ? 'check' : 'cross'}>{f.on ? '✓' : '×'}</span>
                                    {f.label}
                                </li>
                            ))}
                        </ul>

                        <Link to={plan.id === 'free' ? '/signup' : '/signup'}>
                            <button className={`plan-cta ${plan.ctaClass}`}>{plan.cta}</button>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    </>
);

export default Membership;
