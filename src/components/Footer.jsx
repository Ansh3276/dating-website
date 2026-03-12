import React from 'react';
import MagneticButton from './ui/MagneticButton';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="premium-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2>NANO<span className="text-gradient">MATCH</span></h2>
                        <p>Redefining romance for the modern elite. A cinematic journey into the future of connection.</p>
                    </div>
                    
                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Experience</h4>
                            <a href="#match" data-cursor="pointer">AI Preview</a>
                            <a href="#stories" data-cursor="pointer">Stories</a>
                            <a href="#features" data-cursor="pointer">Refined Tools</a>
                        </div>
                        <div className="link-column">
                            <h4>Company</h4>
                            <a href="#" data-cursor="pointer">About</a>
                            <a href="#" data-cursor="pointer">Legal</a>
                            <a href="#" data-cursor="pointer">Privacy</a>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Nano Match. All rights reserved.</p>
                    <div className="social-links">
                        <MagneticButton className="social-link">IG</MagneticButton>
                        <MagneticButton className="social-link">TW</MagneticButton>
                        <MagneticButton className="social-link">IN</MagneticButton>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
