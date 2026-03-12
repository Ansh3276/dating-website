import React from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './ui/MagneticButton';
import '../styles/VideoSection.css';

/**
 * VideoSection — fills empty page gaps with cinematic ambient video
 * Props:
 *   variant: 'dark' | 'light' (default 'dark')
 *   eyebrow: string
 *   title: string (supports <br/> in JSX)
 *   body: string
 *   ctaLabel: string (optional)
 *   videoSrc: string (optional — if omitted uses a Pexels stock embed)
 *   stats: [{ number, label }] (optional)
 *   tall: boolean (100vh instead of 75vh)
 */
const VideoSection = ({
    variant = 'dark',
    eyebrow,
    title,
    body,
    ctaLabel,
    videoSrc,
    stats,
    tall = false,
}) => {
    // Fallback to a beautiful free Pexels couple/romance video
    const fallbackVideo = variant === 'dark'
        ? 'https://videos.pexels.com/video-files/3763401/3763401-uhd_2560_1440_25fps.mp4'
        : 'https://videos.pexels.com/video-files/1722598/1722598-hd_1280_720_24fps.mp4';

    const src = videoSrc || fallbackVideo;

    return (
        <section className={`video-section ${tall ? 'video-section--tall' : ''} video-section--${variant}`}>
            {/* Video Background */}
            <div className="video-section__bg">
                <video
                    className="video-section__video"
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
            </div>

            {/* Tinted Overlay */}
            <div className="video-section__overlay" />

            {/* Content */}
            <motion.div
                className="video-section__content"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                {eyebrow && (
                    <span className="video-section__eyebrow">{eyebrow}</span>
                )}
                {title && (
                    <h2 className="video-section__title">{title}</h2>
                )}
                {body && (
                    <p className="video-section__body">{body}</p>
                )}
                {ctaLabel && (
                    <MagneticButton className="video-section__cta">
                        {ctaLabel}
                    </MagneticButton>
                )}

                {stats && stats.length > 0 && (
                    <div className="video-section__stats">
                        {stats.map((s, i) => (
                            <div className="video-stat" key={i}>
                                <div className="video-stat__number">{s.number}</div>
                                <div className="video-stat__label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default VideoSection;
