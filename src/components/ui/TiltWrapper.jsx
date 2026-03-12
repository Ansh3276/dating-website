import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const TiltWrapper = ({ children, className = "" }) => {
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const dx = useSpring(0, springConfig);
    const dy = useSpring(0, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rX = -(mouseY / (rect.height / 2)) * 10; // Max 10 degrees
        const rY = (mouseX / (rect.width / 2)) * 10;
        
        dx.set(rX);
        dy.set(rY);
    };

    const handleMouseLeave = () => {
        dx.set(0);
        dy.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`tilt-wrapper ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX: dx,
                rotateY: dy,
                transformStyle: "preserve-3d"
            }}
        >
            <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
                {children}
            </div>
        </motion.div>
    );
};

export default TiltWrapper;
