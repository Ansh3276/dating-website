import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeInBlock from './ui/FadeInBlock';
import '../styles/LoveStorySection.css';

const StoryCard = ({ quote, names, image, progress, range }) => {
    const scale = useTransform(progress, range, [0.8, 1, 0.8]);
    const x = useTransform(progress, range, [500, 0, -500]);
    const opacity = useTransform(progress, range, [0, 1, 0]);

    return (
        <motion.div 
            className="story-card glass-panel"
            style={{ scale, opacity, x }}
        >
            <div 
                className="story-card-bg"
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className="story-content">
                <h3 className="story-quote">{quote}</h3>
                <p className="story-names">{names}</p>
            </div>
        </motion.div>
    );
};

const LoveStorySection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const horizontalX = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

    const stories = [
        {
            quote: "Two strangers. One swipe. Forever.",
            names: "Emma & Leo • Married 2024",
            image: "https://images.unsplash.com/photo-1511732351157-1865efba7b11?w=1200&q=80"
        },
        {
            quote: "We found our rhythm in the noise.",
            names: "Sarah & Marcus • Together 3 years",
            image: "https://images.unsplash.com/photo-1522673607200-1648832cee98?w=1200&q=80"
        },
        {
            quote: "Design brought us together. Love kept us.",
            names: "Chloe & James • Engaged 2025",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80"
        }
    ];

    return (
        <section ref={containerRef} className="love-story-section" id="stories">
            <div className="love-story-sticky">
                <div className="love-story-header">
                    <h2 className="text-reveal active">
                        <span>Real Chemistry.</span>
                    </h2>
                </div>

                <motion.div 
                    className="horizontal-scroll-wrapper"
                    style={{ x: horizontalX }}
                >
                    {stories.map((story, i) => (
                        <StoryCard 
                            key={i}
                            {...story}
                            progress={scrollYProgress}
                            range={[i * 0.33, (i + 0.5) * 0.33, (i + 1) * 0.33]}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default LoveStorySection;
