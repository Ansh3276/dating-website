import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import '../../styles/FloatingBackground.css';

const FloatingBackground = () => {
    // Generate some random positions for decorative elements
    const blobs = [
        { color: 'rgba(232, 75, 106, 0.07)', size: '600px', top: '-10%', left: '-5%', duration: 25 },
        { color: 'rgba(184, 131, 42, 0.08)', size: '500px', top: '20%', right: '-10%', duration: 30 },
        { color: 'rgba(232, 75, 106, 0.05)', size: '700px', bottom: '10%', left: '10%', duration: 35 },
        { color: 'rgba(184, 131, 42, 0.06)', size: '400px', bottom: '-5%', right: '15%', duration: 28 },
    ];

    const hearts = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        size: Math.random() * 25 + 15,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 10,
    }));

    return (
        <div className="floating-background-container">
            {/* Mesh Blobs */}
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className="mesh-blob"
                    style={{
                        width: blob.size,
                        height: blob.size,
                        backgroundColor: blob.color,
                        top: blob.top,
                        left: blob.left,
                        right: blob.right,
                        bottom: blob.bottom,
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 60, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Floating Hearts */}
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className="floating-heart-bg"
                    style={{
                        top: heart.top,
                        left: heart.left,
                    }}
                    animate={{
                        y: [0, -120, 0],
                        opacity: [0, 0.25, 0],
                        rotate: [0, 45, -45, 0],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Heart 
                        size={heart.size} 
                        color="var(--color-primary)" 
                        fill="var(--color-primary)" 
                        style={{ opacity: 0.15 }}
                    />
                </motion.div>
            ))}

            {/* Premium Grain Texture Overlay */}
            <div className="noise-texture"></div>
        </div>
    );
};

export default FloatingBackground;
