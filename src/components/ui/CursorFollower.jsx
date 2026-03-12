import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CursorFollower = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const followerX = useSpring(0, { damping: 30, stiffness: 120 });
    const followerY = useSpring(0, { damping: 30, stiffness: 120 });

    useEffect(() => {
        const moveCursor = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            followerX.set(e.clientX);
            followerY.set(e.clientY);
        };

        const handleHover = (e) => {
            const target = e.target;
            if (target.closest('button, a, .interactive')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <>
            <motion.div
                className="custom-cursor"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 2.5 : 1,
                }}
            />
            <motion.div
                className="cursor-follower"
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0 : 1,
                }}
            />
            <div className="noise-overlay"></div>
        </>
    );
};

export default CursorFollower;
