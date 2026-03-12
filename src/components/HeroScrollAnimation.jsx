import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { preloadImages, getAvailableFrameUrls } from '../animations/imageSequence';

import '../styles/HeroScrollAnimation.css';

const initialUrls = getAvailableFrameUrls();
const FRAME_COUNT = Math.max(1, initialUrls.length);

const CinematicQuote = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1, 1, 0]);
    const y = useTransform(progress, range, [60, 0, 0, -60]);

    return (
        <motion.div className="cinematic-quote" style={{ opacity, y }}>
            <h2 className="text-glow">{children}</h2>
        </motion.div>
    );
};

// Ambient floating dot particle
const Particle = ({ style }) => (
    <motion.div
        className="hero-particle"
        style={style}
        animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
        transition={{
            duration: style.duration,
            repeat: Infinity,
            delay: style.delay,
            ease: 'easeInOut',
        }}
    />
);

const HeroScrollAnimation = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 0.9], [1, FRAME_COUNT]);
    const heroOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0.88, 1], [1, 1.08]);

    // Particles config
    const particles = Array.from({ length: 15 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 5,
    }));

    useEffect(() => {
        if (initialUrls.length === 0) {
            setLoadingProgress(1);
            return;
        }

        preloadImages(initialUrls, setLoadingProgress)
            .then((loadedImages) => setImages(loadedImages))
            .catch((err) => {
                console.error('Error preloading images:', err);
                setLoadingProgress(1);
            });
    }, []);

    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            renderFrame(frameIndex.get());
        };

        const renderFrame = (index) => {
            if (!ctx || images.length === 0) return;
            const imgIndex = Math.min(Math.round(index) - 1, images.length - 1);
            if (imgIndex < 0) return;
            const img = images[imgIndex];
            const canvasRatio = canvas.width / canvas.height;
            const imageRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            if (imageRatio > canvasRatio) {
                drawWidth = canvas.height * imageRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                drawHeight = canvas.height;
            } else {
                drawHeight = canvas.width / imageRatio;
                offsetY = (canvas.height - drawHeight) / 2;
                drawWidth = canvas.width;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        const unsubscribe = frameIndex.on('change', renderFrame);

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [images, frameIndex]);

    return (
        <div ref={containerRef} className="hero-scroll-container">
            <AnimatePresence>
                {loadingProgress < 1 && (
                    <motion.div
                        className="preloader"
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            Nano Match
                        </motion.h1>
                        <div className="progress-bar-container">
                            <motion.div
                                className="progress-bar"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadingProgress * 100}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="sticky-canvas-wrapper"
                style={{ opacity: heroOpacity, scale: heroScale }}
            >
                <canvas ref={canvasRef} className="hero-canvas" />

                {/* Ambient particles */}
                <div className="hero-particles-layer">
                    {particles.map((p, i) => (
                        <Particle key={i} style={p} />
                    ))}
                </div>



                {/* Vignette */}
                <div className="hero-vignette" />

                <div className="hero-overlay">
                    <motion.div
                        className="hero-tagline"
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]),
                            y: useTransform(scrollYProgress, [0, 0.06], [0, -60]),
                        }}
                    >
                        <h1 className="text-reveal active">
                            <span>Connection is more than a swipe.</span>
                        </h1>
                    </motion.div>

                    <CinematicQuote progress={scrollYProgress} range={[0.15, 0.28, 0.42, 0.58]}>
                        Real chemistry deserves real design.
                    </CinematicQuote>

                    <CinematicQuote progress={scrollYProgress} range={[0.62, 0.72, 0.82, 0.92]}>
                        Meet differently.
                    </CinematicQuote>

                    <motion.div
                        className="scroll-indicator"
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]),
                        }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    >
                        <span>Scroll into the film</span>
                        <ArrowDown size={13} color="white" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroScrollAnimation;
