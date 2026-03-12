import React from 'react';
import { motion } from 'framer-motion';

/**
 * FadeInBlock - Reusable fade-in animation wrapper
 * Animates elements into view with customizable delay and offset
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.yOffset - Initial Y offset in pixels
 */
const FadeInBlock = ({ children, className = '', delay = 0, yOffset = 50 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }} // Triggers slightly before it enters fully
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.16, 1, 0.3, 1] // Custom easing for premium feel
            }}
        >
            {children}
        </motion.div>
    );
};

export default FadeInBlock;
