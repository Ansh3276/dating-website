import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/Navbar';
import HeroScrollAnimation from '../components/HeroScrollAnimation';
import MatchPreview from '../components/MatchPreview';
import VideoSection from '../components/VideoSection';
import HowItWorks from '../components/HowItWorks';
import PremiumFeatures from '../components/PremiumFeatures';
import LoveStorySection from '../components/LoveStorySection';
import AppPreview from '../components/AppPreview';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const Landing = () => {
    // Global Lenis smooth scrolling handled in App.jsx

    return (
        <React.Fragment>
            <div className="landing-page">
                <Navbar />

                {/* 1 — Cinematic hero canvas sequence */}
                <HeroScrollAnimation />

                {/* 2 — AI Match Preview */}
                <MatchPreview />

                {/* 3 — Video break: "Real Chemistry Awaits" */}
                <VideoSection
                    variant="dark"
                    eyebrow="Crafted for depth"
                    title="Real Chemistry Awaits."
                    body="We don't believe in endless swipes. We believe in curated encounters — each one a potential beginning."
                    ctaLabel="Explore the science"
                    stats={[
                        { number: '2.4M+', label: 'Members' },
                        { number: '94%', label: 'Match Satisfaction' },
                        { number: '200K+', label: 'Connections Made' },
                    ]}
                />

                {/* 4 — How It Works */}
                <HowItWorks />

                {/* 5 — Love Stories horizontal gallery */}
                <LoveStorySection />

                {/* 6 — Video break: "Where Stories Begin" */}
                <VideoSection
                    variant="light"
                    eyebrow="Member Stories"
                    title="Where Stories Begin."
                    body="Every connection on Nano Match is the start of something extraordinary. Our members don't date — they discover."
                    videoSrc="https://videos.pexels.com/video-files/3754418/3754418-hd_1920_1080_24fps.mp4"
                />

                {/* 7 — Premium Features */}
                <PremiumFeatures />

                {/* 8 — App Preview */}
                <AppPreview />

                {/* 9 — Testimonials */}
                <Testimonials />

                {/* 10 — CTA Finale */}
                <CTASection />

                <Footer />
            </div>
        </React.Fragment>
    );
};

export default Landing;
