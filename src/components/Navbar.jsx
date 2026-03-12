import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from './ui/MagneticButton';
import '../styles/Navbar.css';

const Navbar = () => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Hide on scroll down, reveal on scroll up
        if (latest > previous && latest > 200) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: '-100%', opacity: 0 },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="premium-navbar scrolled"
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
                    <Link to="/login" className="login-link" data-cursor="pointer">Log in</Link>
                    <Link to="/signup">
                        <MagneticButton className="join-btn" data-cursor="pointer">
                            Apply Now
                        </MagneticButton>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
