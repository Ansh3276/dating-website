import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import MagneticButton from '../components/ui/MagneticButton';
import '../styles/Settings.css';

const Toggle = ({ checked, onChange, label, description }) => (
    <div className="setting-row">
        <div className="setting-info">
            <h4>{label}</h4>
            {description && <p>{description}</p>}
        </div>
        <button
            className={`toggle ${checked ? 'on' : ''}`}
            onClick={onChange}
            data-cursor="pointer"
            aria-label={`Toggle ${label}`}
        >
            <span className="toggle-knob" />
        </button>
    </div>
);

const RangeSlider = ({ label, value, onChange, min = 0, max = 100, unit = '' }) => (
    <div className="setting-row slider-row">
        <div className="setting-info">
            <h4>{label}</h4>
            <p className="slider-value">{value}{unit}</p>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="setting-slider"
        />
    </div>
);

const Settings = () => {
    const [settings, setSettings] = useState({
        pushNotifications: true,
        emailNotifications: false,
        matchAlerts: true,
        messagePreview: true,
        showOnline: true,
        showDistance: false,
        incognitoMode: false,
        readReceipts: true,
        darkMode: false,
        soundEffects: true,
        autoPlay: true,
        twoFactor: false,
    });

    const [maxDistance, setMaxDistance] = useState(50);
    const [ageRange, setAgeRange] = useState(35);

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            title: 'Notifications',
            icon: '🔔',
            items: [
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your device.' },
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get a weekly digest of your activity.' },
                { key: 'matchAlerts', label: 'Match Alerts', desc: 'Instant alerts when you get a new match.' },
                { key: 'messagePreview', label: 'Message Previews', desc: 'Show message content in notifications.' },
            ],
        },
        {
            title: 'Privacy',
            icon: '🔒',
            items: [
                { key: 'showOnline', label: 'Show Online Status', desc: 'Let others see when you\'re online.' },
                { key: 'showDistance', label: 'Show Distance', desc: 'Display how far away you are from matches.' },
                { key: 'incognitoMode', label: 'Incognito Mode', desc: 'Browse profiles without appearing in their viewers.' },
                { key: 'readReceipts', label: 'Read Receipts', desc: 'Let matches know when you\'ve read messages.' },
            ],
        },
        {
            title: 'Preferences',
            icon: '⚙️',
            items: [
                { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for matches and messages.' },
                { key: 'autoPlay', label: 'Auto-Play Videos', desc: 'Automatically play profile videos.' },
            ],
        },
        {
            title: 'Security',
            icon: '🛡️',
            items: [
                { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.' },
            ],
        },
    ];

    return (
        <div className="settings-page">
            <Navbar />

            <div className="settings-container">
                <motion.div
                    className="settings-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>Settings</h1>
                    <p>Manage your account preferences and privacy.</p>
                </motion.div>

                {/* Profile Quick Card */}
                <motion.div
                    className="settings-profile-card glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                        alt="Profile"
                        className="settings-avatar"
                    />
                    <div className="settings-profile-info">
                        <h3>Julian Rose</h3>
                        <p>julian.rose@email.com</p>
                        <span className="pill">Elite Member</span>
                    </div>
                    <MagneticButton className="settings-edit-btn" data-cursor="pointer">
                        Edit Profile
                    </MagneticButton>
                </motion.div>

                {/* Discovery Preferences */}
                <motion.div
                    className="settings-section glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="section-title">
                        <span className="section-icon">📍</span>
                        <h2>Discovery</h2>
                    </div>
                    <RangeSlider
                        label="Maximum Distance"
                        value={maxDistance}
                        onChange={setMaxDistance}
                        min={1}
                        max={100}
                        unit=" mi"
                    />
                    <RangeSlider
                        label="Age Range (Up To)"
                        value={ageRange}
                        onChange={setAgeRange}
                        min={18}
                        max={60}
                        unit=" yrs"
                    />
                </motion.div>

                {/* Toggle Sections */}
                {sections.map((section, sIdx) => (
                    <motion.div
                        key={section.title}
                        className="settings-section glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + sIdx * 0.08 }}
                    >
                        <div className="section-title">
                            <span className="section-icon">{section.icon}</span>
                            <h2>{section.title}</h2>
                        </div>
                        {section.items.map(item => (
                            <Toggle
                                key={item.key}
                                checked={settings[item.key]}
                                onChange={() => toggle(item.key)}
                                label={item.label}
                                description={item.desc}
                            />
                        ))}
                    </motion.div>
                ))}

                {/* Danger Zone */}
                <motion.div
                    className="settings-section danger-zone glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="section-title">
                        <span className="section-icon">⚠️</span>
                        <h2>Danger Zone</h2>
                    </div>
                    <div className="danger-actions">
                        <button className="danger-btn" data-cursor="pointer">Pause Account</button>
                        <button className="danger-btn delete" data-cursor="pointer">Delete Account</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
