// Plik: /src/components/About/FaceFeatures.jsx

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// --- KONFIGURACJA POZYCJI (%) ---
// Pozycje względem kontenera 1000x960
const EYE_Y_PCT = 55.2; // 530 / 960 * 100
const LEFT_EYE_X_PCT = 42; // 420 / 1000 * 100
const RIGHT_EYE_X_PCT = 56; // 560 / 1000 * 100

const MOUTH_POS_PCT = { x: 48.5, y: 72.9 }; // 485/1000, 700/960

export const FaceFeatures = ({ mousePos, mouthState }) => {
    // Stan szerokości okna do obliczeń
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- LOGIKA ŚLEDZENIA OCZU (SKALOWALNA) ---
    const calculatePupilPos = (eyeXPct, eyeYPct) => {
        if (!mousePos.x && !mousePos.y) return { x: 0, y: 0 };

        const containerCenterX = windowWidth / 2;
        const containerCenterY = window.innerHeight / 2;

        // Obliczamy szerokość kontenera (52.08vw) i wysokość (z aspect ratio 1000/960)
        const currentContainerW = windowWidth * 0.5208;
        const currentContainerH = currentContainerW * (960 / 1000);

        // Obliczamy offset oka od środka ekranu
        const offsetX = ((eyeXPct - 50) / 100) * currentContainerW;
        const offsetY = ((eyeYPct - 50) / 100) * currentContainerH;

        const eyeScreenX = containerCenterX + offsetX;
        const eyeScreenY = containerCenterY + offsetY;

        const dx = mousePos.x - eyeScreenX;
        const dy = mousePos.y - eyeScreenY;

        const angle = Math.atan2(dy, dx);
        // Ograniczamy ruch źrenicy (skalujemy limit też? 8px to ok. 0.4vw)
        const limit = windowWidth * 0.004;
        const distance = Math.min(limit, Math.hypot(dx, dy) / 20);

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        };
    };

    const leftPupil = calculatePupilPos(LEFT_EYE_X_PCT, EYE_Y_PCT);
    const rightPupil = calculatePupilPos(RIGHT_EYE_X_PCT, EYE_Y_PCT);

    // --- LOGIKA ANIMACJI UST (Wartości VW) ---
    const mouthControls = useAnimation();

    // Helper: px to vw string (dla 1920px)
    // 30px -> 1.56vw
    // 25px -> 1.3vw
    // 28px -> 1.45vw
    // 20px -> 1.04vw
    // 35px -> 1.82vw
    // 4px -> 0.2vw
    // 6px -> 0.31vw

    useEffect(() => {
        if (mouthState === 'talking') {
            mouthControls.start({
                height: ["0.2vw", "1.04vw", "0.41vw", "1.3vw", "0.2vw"],
                width: ["1.56vw", "1.3vw", "1.45vw", "1.04vw", "1.56vw"],
                borderRadius: ["10px", "50%", "10px", "50%", "10px"],
                transition: { duration: 0.3, repeat: Infinity }
            });
        } else if (mouthState === 'prompt') {
            mouthControls.start({
                width: ["1.56vw", "1.82vw", "1.56vw"],
                height: ["0.2vw", "0.31vw", "0.2vw"],
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            });
        } else {
            mouthControls.start({
                width: "1.56vw",
                height: "0.2vw",
                borderRadius: "2px",
                transition: { duration: 0.5 }
            });
        }
    }, [mouthState, mouthControls]);

    const eyeContainerStyle = {
        position: 'absolute',
        top: `${EYE_Y_PCT}%`,
        // 60px -> 3.125vw, 40px -> 2.08vw
        width: '3.125vw',
        height: '2.08vw',
        backgroundColor: '#fff', borderRadius: '50%',
        transform: 'translate(-50%, -50%)', overflow: 'hidden',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
    };

    const eyelidStyle = {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '45%',
        backgroundColor: '#000', zIndex: 2,
    };

    // Pupil: 14px -> 0.73vw
    const pupilSize = '0.73vw';

    return (
        <div className="face-features-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>

            {/* LEWE OKO */}
            <div style={{ ...eyeContainerStyle, left: `${LEFT_EYE_X_PCT}%` }}>
                <div style={eyelidStyle} />
                <motion.div
                    style={{
                        position: 'absolute', top: '55%', left: '50%',
                        width: pupilSize, height: pupilSize,
                        borderRadius: '50%', backgroundColor: 'black',
                        x: '-50%', y: '-50%', // Centrowanie źrenicy
                        zIndex: 1,
                        translateX: leftPupil.x, translateY: leftPupil.y
                    }}
                />
            </div>

            {/* PRAWE OKO */}
            <div style={{ ...eyeContainerStyle, left: `${RIGHT_EYE_X_PCT}%` }}>
                <div style={eyelidStyle} />
                <motion.div
                    style={{
                        position: 'absolute', top: '55%', left: '50%',
                        width: pupilSize, height: pupilSize,
                        borderRadius: '50%', backgroundColor: 'black',
                        x: '-50%', y: '-50%',
                        zIndex: 1,
                        translateX: rightPupil.x, translateY: rightPupil.y
                    }}
                />
            </div>

            {/* USTA */}
            <div style={{ position: 'absolute', top: `${MOUTH_POS_PCT.y}%`, left: `${MOUTH_POS_PCT.x}%`, transform: 'translate(-50%, -50%)' }}>
                <motion.div
                    animate={mouthControls}
                    style={{ backgroundColor: 'white' }}
                />
            </div>

            {/* DYMEK (Nad głową) */}
            {mouthState === 'prompt' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        // 250px / 960px = ~26%
                        top: '26%',
                        left: '42%',
                        transform: 'translateX(-50%)',

                        backgroundColor: 'white',
                        color: 'black',
                        padding: '0.52vw 1.04vw', // 10px 20px
                        borderRadius: '0.78vw', // 15px
                        whiteSpace: 'nowrap',
                        fontFamily: 'Antonio, sans-serif',
                        fontSize: '0.78vw', // 15px
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 20,
                        boxShadow: '0 0.26vw 1.04vw rgba(0,0,0,0.5)'
                    }}
                >
                    pociągnij dreda...

                    {/* Strzałka w dół */}
                    <div style={{
                        position: 'absolute', bottom: '-0.4vw', left: '50%', marginLeft: '-0.42vw',
                        borderLeft: '0.42vw solid transparent', borderRight: '0.42vw solid transparent',
                        borderTop: '0.42vw solid white'
                    }} />
                </motion.div>
            )}

        </div>
    );
};