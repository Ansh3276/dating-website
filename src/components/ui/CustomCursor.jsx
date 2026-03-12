import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState("default");

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener("mousemove", mouseMove);

        // Add logic to check what element we're hovering over
        // If it has data-cursor="hover", we switch variants
        const handleMouseOver = (e) => {
            // Find closest parent with data-cursor attribute
            const target = e.target.closest('[data-cursor]');
            if (target) {
                setCursorVariant(target.getAttribute('data-cursor'));
            } else if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
                setCursorVariant('pointer');
            } else {
                setCursorVariant("default");
            }
        };

        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 12, // center the 24px cursor
            y: mousePosition.y - 12,
            scale: 1,
            opacity: 1
        },
        pointer: {
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
            scale: 1.5,
            opacity: 1,
            textShadow: '0 0 12px var(--color-primary)'
        },
        hidden: {
            opacity: 0
        }
    };

    return (
        <motion.div
            className="custom-cursor"
            variants={variants}
            animate={cursorVariant}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
            style={{
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                fontSize: '24px',
                color: 'var(--color-primary)',
                textShadow: '0 0 8px var(--color-primary)'
            }}
        >
            ♡
        </motion.div>
    );
};

export default CustomCursor;
