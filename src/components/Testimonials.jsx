import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeInBlock from './ui/FadeInBlock';
import '../styles/Testimonials.css';

const Testimonials = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const x1 = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);
    const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "10%"]);

    const testimonialsRow1 = [
        { quote: "I never thought an algorithm could understand chemistry. Nano Match proved me wrong.", author: "Sarah T.", location: "New York" },
        { quote: "The voice prompt feature changed everything. I heard his laugh before we'd ever met.", author: "Elena R.", location: "Paris" },
        { quote: "Three months in, and we're moving to the coast together. It began with one curated reveal.", author: "Daniel M.", location: "London" },
        { quote: "No swiping fatigue. Just one perfect match a day. I actually looked forward to opening the app.", author: "Michael B.", location: "Los Angeles" },
    ];

    const testimonialsRow2 = [
        { quote: "He was the only one in my weekly curation. We've been inseparable for a year.", author: "Sophia K.", location: "Tokyo" },
        { quote: "The 'Elite Privacy' mode was a dealbreaker for me. Finally, control over my vulnerability.", author: "James L.", location: "Toronto" },
        { quote: "It's not an app. It's a ritual. Every evening, I open it like a letter from the universe.", author: "Olivia P.", location: "Sydney" },
        { quote: "We connected over a video prompt about sunrises. Now we watch them together every morning.", author: "William H.", location: "Berlin" },
    ];

    return (
        <section className="testimonials-section" id="testimonials" ref={targetRef}>
            <FadeInBlock className="testimonials-header">
                <h2 className="text-reveal active">
                    <span>Member Stories.</span>
                </h2>
                <p>From first spark to forever — told in their own words.</p>
            </FadeInBlock>

            <div className="testimonials-scroll-wrapper">
                <motion.div className="testimonials-track" style={{ x: x1 }}>
                    {[...testimonialsRow1, ...testimonialsRow1].map((item, idx) => (
                        <div key={idx} className="testimonial-card glass-panel" data-cursor="pointer">
                            <h3 className="quote">"{item.quote}"</h3>
                            <div className="author-info">
                                <span className="author-name">— {item.author}</span>
                                <span className="author-loc">{item.location}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div className="testimonials-track" style={{ x: x2 }}>
                    {[...testimonialsRow2, ...testimonialsRow2].map((item, idx) => (
                        <div key={idx} className="testimonial-card glass-panel" data-cursor="pointer">
                            <h3 className="quote">"{item.quote}"</h3>
                            <div className="author-info">
                                <span className="author-name">— {item.author}</span>
                                <span className="author-loc">{item.location}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
