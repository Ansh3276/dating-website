import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import MagneticButton from './ui/MagneticButton';
import { useAuth } from '../context/AuthContext';
import { getPhotoUrl } from '../services/api';
import '../styles/Navbar.css';

/**
 * Premium Navbar Component
 * Sticky navigation with scroll-based hide/show animation
 * Features: responsive design, smooth animations, mobile menu
 */
const Navbar = () => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const { user, logout: contextLogout } = useAuth();


    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 200) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    const handleLogout = async () => {
        try {
            const { logout } = await import('../services/api');
            await logout();
            contextLogout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: '-100%', opacity: 0 },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}
        >
            <div className="nav-container">
                <Link to="/" className="nav-logo" data-cursor="pointer">
                    <span>NANO</span>
                    <span className="text-gradient">MATCH</span>
                </Link>

                <ul className="nav-links">
                    <li data-cursor="pointer"><Link to="/discover">Discover</Link></li>
                    <li data-cursor="pointer"><Link to="/matches">Matches</Link></li>
                    <li data-cursor="pointer"><Link to="/membership">Membership</Link></li>
                    <li data-cursor="pointer"><Link to="/chat">Chat</Link></li>
                </ul>

                <div className="nav-actions">
                    {user ? (
                        <div className="nav-user-profile">
                            <span className="nav-user-name">{user.name}</span>
                            <div 
                                className="nav-avatar-wrapper" 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                data-cursor="pointer"
                            >
                                <img 
                                    src={getPhotoUrl(user.photoUrl)} 
                                    alt={user.name} 
                                    className="nav-avatar" 
                                    onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                />
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div 
                                            className="nav-dropdown"
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link to="/profile" className="dropdown-item">Profile</Link>
                                            <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="login-link" data-cursor="pointer">Log in</Link>
                            <Link to="/signup">
                                <MagneticButton className="join-btn" data-cursor="pointer">
                                    Apply Now
                                </MagneticButton>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
