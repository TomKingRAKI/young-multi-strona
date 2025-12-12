import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import './SmokeTransition.css';

const SmokeTransition = ({ progress }) => {
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detekcja mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animacja kurtyny na mobile - przesuwa się od lewej do prawej
    const curtainX = useTransform(progress, [0, 1], ['-100%', '0%']);

    // Desktop: scroll-driven video
    useMotionValueEvent(progress, "change", (latestValue) => {
        if (isMobile) return; // Na mobile nie używamy video

        const video = videoRef.current;
        if (video && video.duration) {
            const targetTime = latestValue * video.duration;
            if (Number.isFinite(targetTime)) {
                video.currentTime = targetTime;
            }
        }
    });

    // MOBILE: Sliding curtain effect
    if (isMobile) {
        return (
            <div className="smoke-transition-container">
                <motion.div 
                    className="mobile-curtain"
                    style={{ x: curtainX }}
                />
            </div>
        );
    }

    // DESKTOP: Scroll-driven video
    return (
        <div className="smoke-transition-container">
            <video
                ref={videoRef}
                className="smoke-video"
                src="/smoke-transition.mp4"
                muted
                playsInline
                preload="auto"
            />
        </div>
    );
};

export default SmokeTransition;