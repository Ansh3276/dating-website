import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        
        // Calculate the center of the button
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        // Move slightly towards the cursor (divided by 4 for subtle effect)
        setPosition({ x: middleX / 4, y: middleY / 4 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`magnetic-btn ${className}`}
            onClick={onClick}
            style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '12px 24px',
                borderRadius: '30px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--color-text)',
                cursor: 'pointer',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Add a subtle border and glow
                boxShadow: 'inset 0 0 0 1pxvar(--glass-border), 0 4px 12px rgba(0,0,0,0.2)'
            }}
        >
            {/* The actual content */}
            <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
        </motion.button>
    );
};

export default MagneticButton;
