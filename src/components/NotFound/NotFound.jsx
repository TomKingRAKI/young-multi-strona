// Plik: /src/components/NotFound/NotFound.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import MagneticButton from '../MagneticButton/MagneticButton';
import './NotFound.css';

// Characters for scramble effect
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const NotFound = () => {
    // Mouse coordinates for the spotlight
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring values for proximity effect
    const springConfig = { stiffness: 150, damping: 15 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    // State for text scramble animation
    const [displayText, setDisplayText] = useState('???');
    const [isScrambling, setIsScrambling] = useState(true);

    // State for glitch burst
    const [isGlitchBurst, setIsGlitchBurst] = useState(false);

    // Ref for 404 text position
    const textRef = useRef(null);
    const containerRef = useRef(null);

    // Text proximity distortion values
    const [textCenter, setTextCenter] = useState({ x: 0, y: 0 });

    // Generate particles
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, []);

    // Initial center position logic
    useEffect(() => {
        if (typeof window !== 'undefined') {
            mouseX.set(window.innerWidth / 2);
            mouseY.set(window.innerHeight / 2);
        }

        const handleMouseMove = ({ clientX, clientY }) => {
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Update text center position
    useEffect(() => {
        const updateTextCenter = () => {
            if (textRef.current) {
                const rect = textRef.current.getBoundingClientRect();
                setTextCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        };

        updateTextCenter();
        window.addEventListener('resize', updateTextCenter);
        return () => window.removeEventListener('resize', updateTextCenter);
    }, [isScrambling]);

    // Text scramble animation on mount
    useEffect(() => {
        const targetText = '404';
        let iteration = 0;
        const maxIterations = 15;

        const scrambleInterval = setInterval(() => {
            setDisplayText(
                targetText
                    .split('')
                    .map((char, index) => {
                        if (iteration > index * 3) {
                            return char;
                        }
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join('')
            );

            iteration++;

            if (iteration > maxIterations) {
                clearInterval(scrambleInterval);
                setDisplayText(targetText);
                setIsScrambling(false);
            }
        }, 50);

        return () => clearInterval(scrambleInterval);
    }, []);

    // Random glitch burst effect
    useEffect(() => {
        const triggerGlitchBurst = () => {
            setIsGlitchBurst(true);
            setTimeout(() => setIsGlitchBurst(false), 200);
        };

        // Initial delay before first burst
        const initialDelay = setTimeout(() => {
            triggerGlitchBurst();

            // Set up random interval for subsequent bursts
            const randomInterval = () => {
                const delay = Math.random() * 4000 + 2000; // 2-6 seconds
                return setTimeout(() => {
                    triggerGlitchBurst();
                    timeoutId = randomInterval();
                }, delay);
            };

            let timeoutId = randomInterval();

            return () => clearTimeout(timeoutId);
        }, 1500);

        return () => clearTimeout(initialDelay);
    }, []);

    // Create a dynamic mask based on mouse position
    const maskImage = useMotionTemplate`radial-gradient(circle 300px at ${mouseX}px ${mouseY}px, black 30%, transparent 100%)`;
    const webkitMaskImage = maskImage;

    // Calculate proximity-based distortion
    const distortionX = useTransform(smoothMouseX, (x) => {
        const distance = x - textCenter.x;
        const maxDistance = 400;
        const strength = Math.max(0, 1 - Math.abs(distance) / maxDistance);
        return distance * strength * 0.05;
    });

    const distortionY = useTransform(smoothMouseY, (y) => {
        const distance = y - textCenter.y;
        const maxDistance = 400;
        const strength = Math.max(0, 1 - Math.abs(distance) / maxDistance);
        return distance * strength * 0.03;
    });

    const distortionSkewX = useTransform(smoothMouseX, (x) => {
        const distance = x - textCenter.x;
        const maxDistance = 500;
        return (distance / maxDistance) * 3;
    });

    return (
        <div className={`not-found-container ${isGlitchBurst ? 'glitch-burst' : ''}`} ref={containerRef}>
            {/* Background Texture */}
            <div className="noise-overlay" />
            <div className="grid-overlay" />

            {/* Scanlines during glitch */}
            <div className={`scanlines ${isGlitchBurst ? 'active' : ''}`} />

            {/* Floating Particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                            opacity: particle.opacity,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${particle.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* LAYER 1: Dark / Faint */}
            <div className="not-found-layer layer-dark">
                <motion.h1
                    className="error-code"
                    ref={textRef}
                    style={{
                        x: distortionX,
                        y: distortionY,
                        skewX: distortionSkewX,
                    }}
                >
                    {displayText}
                </motion.h1>
                <p className="error-message">Nie ma takiej strony</p>
                <div className="home-button-wrapper">
                    <MagneticButton>
                        <a href="/" className="btn-home">
                            <span className="btn-text">WRACAJ DO BAZY</span>
                            <span className="btn-glitch" data-text="WRACAJ DO BAZY">WRACAJ DO BAZY</span>
                        </a>
                    </MagneticButton>
                </div>
            </div>

            {/* LAYER 2: Light / Glitched (Revealed by Spotlight) */}
            <motion.div
                className="not-found-layer layer-light"
                style={{ maskImage, webkitMaskImage }}
            >
                <motion.h1
                    className={`error-code ${isGlitchBurst ? 'burst' : ''}`}
                    style={{
                        x: distortionX,
                        y: distortionY,
                        skewX: distortionSkewX,
                    }}
                >
                    {displayText}
                </motion.h1>
                <p className="error-message">Nie ma takiej strony</p>
                <div className="home-button-wrapper">
                    <MagneticButton strength={0.5}>
                        <a href="/" className="btn-home btn-home-light">
                            <span className="btn-text">WRACAJ DO BAZY</span>
                            <span className="btn-glitch" data-text="WRACAJ DO BAZY">WRACAJ DO BAZY</span>
                        </a>
                    </MagneticButton>
                </div>
            </motion.div>

            {/* Custom Cursor Ring */}
            <motion.div
                className="custom-cursor-follower"
                style={{ x: mouseX, y: mouseY }}
            />

            {/* Spotlight glow effect */}
            <motion.div
                className="spotlight-glow"
                style={{
                    x: mouseX,
                    y: mouseY,
                    opacity: isGlitchBurst ? 0.8 : 0.3
                }}
            />
        </div>
    );
};

export default NotFound;
