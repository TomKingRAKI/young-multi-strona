import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import './SmokeTransition.css';

const SmokeTransition = ({ progress }) => {
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Optymalizacja wideo: RAF loop vars
    const latestProgressRef = useRef(0);
    const isUpdatingRef = useRef(false);

    // Detekcja mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animacja kurtyny na mobile - przesuwa się od lewej do prawej
    const curtainX = useTransform(progress, [0, 1], ['-100%', '0%']);

    // Desktop: scroll-driven video (OPTIMIZED with RAF)
    useMotionValueEvent(progress, "change", (latestValue) => {
        if (isMobile) return;
        latestProgressRef.current = latestValue;

        // Jeśli klatka nie jest akurat liczona, zlecamy nową.
        // To ogranicza aktualizacje do częstotliwości odświeżania ekranu (60Hz/144Hz)
        // zamiast katować przeglądarkę przy każdym pikselu scrolla (np. 1000Hz przy szybkiej myszce).
        if (!isUpdatingRef.current) {
            isUpdatingRef.current = true;
            requestAnimationFrame(updateVideoFrame);
        }
    });

    const updateVideoFrame = () => {
        const video = videoRef.current;
        // Sprawdzamy readyState > 0, żeby nie męczyć pustego wideo
        if (video && video.duration && video.readyState >= 1) {
            const targetTime = latestProgressRef.current * video.duration;
            // Mały "treshold" (np. 0.001s), żeby nie aktualizować, jak nic się nie zmieniło
            if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.001) {
                video.currentTime = targetTime;
            }
        }
        isUpdatingRef.current = false;
    };

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
                preload="auto" // Zmiana na auto, żeby buforowało agresywniej
                crossOrigin="anonymous"
            />
        </div>
    );
};

export default SmokeTransition;