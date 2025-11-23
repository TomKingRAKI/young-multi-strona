// Plik: /src/components/About/FaceFeatures.jsx

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// --- KONFIGURACJA POZYCJI (TU ZMIENIASZ POŁOŻENIE) ---
// Poprzednio Y było ~470, teraz dajemy ~600, żeby zjechać z grzywki na twarz.
const EYE_Y = 530;  // <--- ZWIĘKSZ TO, jeśli oczy są dalej za wysoko (np. na 600 lub 620)
const LEFT_EYE_X = 420; // Zbliżyłem je trochę do środka (było 380)
const RIGHT_EYE_X = 560; // Zbliżyłem je trochę do środka (było 620)

// Usta też muszą zjechać w dół
const MOUTH_POS = { x: 485, y: 700 };

export const FaceFeatures = ({ mousePos, mouthState }) => {

    // --- LOGIKA ŚLEDZENIA OCZU (bez zmian) ---
    const calculatePupilPos = (eyeX, eyeY) => {
        if (!mousePos.x && !mousePos.y) return { x: 0, y: 0 };

        const containerCenterX = window.innerWidth / 2;
        const containerCenterY = window.innerHeight / 2;
        const offsetX = eyeX - 500;
        const offsetY = eyeY - 480;

        const eyeScreenX = containerCenterX + offsetX;
        const eyeScreenY = containerCenterY + offsetY;

        const dx = mousePos.x - eyeScreenX;
        const dy = mousePos.y - eyeScreenY;

        const angle = Math.atan2(dy, dx);
        const distance = Math.min(8, Math.hypot(dx, dy) / 20);

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        };
    };

    const leftPupil = calculatePupilPos(LEFT_EYE_X, EYE_Y);
    const rightPupil = calculatePupilPos(RIGHT_EYE_X, EYE_Y);

    // --- LOGIKA ANIMACJI UST (bez zmian) ---
    const mouthControls = useAnimation();

    useEffect(() => {
        if (mouthState === 'talking') {
            mouthControls.start({
                height: [4, 20, 8, 25, 4],
                width: [30, 25, 28, 20, 30],
                borderRadius: ["10px", "50%", "10px", "50%", "10px"],
                transition: { duration: 0.3, repeat: Infinity }
            });
        } else if (mouthState === 'prompt') {
            mouthControls.start({
                width: [30, 35, 30],
                height: [4, 6, 4],
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            });
        } else {
            mouthControls.start({
                width: 30,
                height: 4,
                borderRadius: "2px",
                transition: { duration: 0.5 }
            });
        }
    }, [mouthState, mouthControls]);

    const eyeContainerStyle = {
        position: 'absolute', top: EYE_Y, width: 60, height: 40,
        backgroundColor: '#fff', borderRadius: '50%',
        transform: 'translate(-50%, -50%)', overflow: 'hidden',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
    };

    const eyelidStyle = {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '45%',
        backgroundColor: '#000', zIndex: 2,
    };

    return (
        <div className="face-features-layer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>

            {/* LEWE OKO */}
            <div style={{ ...eyeContainerStyle, left: LEFT_EYE_X }}>
                <div style={eyelidStyle} />
                <motion.div
                    style={{
                        position: 'absolute', top: '55%', left: '50%',
                        width: 14, height: 14, borderRadius: '50%', backgroundColor: 'black',
                        marginTop: -7, marginLeft: -7, zIndex: 1,
                        x: leftPupil.x, y: leftPupil.y
                    }}
                />
            </div>

            {/* PRAWE OKO */}
            <div style={{ ...eyeContainerStyle, left: RIGHT_EYE_X }}>
                <div style={eyelidStyle} />
                <motion.div
                    style={{
                        position: 'absolute', top: '55%', left: '50%',
                        width: 14, height: 14, borderRadius: '50%', backgroundColor: 'black',
                        marginTop: -7, marginLeft: -7, zIndex: 1,
                        x: rightPupil.x, y: rightPupil.y
                    }}
                />
            </div>

            {/* USTA (Tylko usta, bez dymka) */}
            <div style={{ position: 'absolute', top: MOUTH_POS.y, left: MOUTH_POS.x, transform: 'translate(-50%, -50%)' }}>
                <motion.div
                    animate={mouthControls}
                    style={{ backgroundColor: 'white' }}
                />
            </div>

            {/* --- DYMEK JEST TERAZ TUTAJ (NAD GŁOWĄ) --- */}
            {mouthState === 'prompt' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        // TU ZMIENIASZ POZYCJĘ PIONOWĄ:
                        top: 250, // 150px od samej góry "deski" (nad dredami)
                        left: '42%', // Wycentrowany w poziomie
                        transform: 'translateX(-50%)',

                        backgroundColor: 'white',
                        color: 'black',
                        padding: '10px 20px',
                        borderRadius: '15px',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Antonio, sans-serif',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 20, // Musi być wyżej niż dredy
                        boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
                    }}
                >
                    pociągnij dreda...

                    {/* Strzałka w dół */}
                    <div style={{
                        position: 'absolute', bottom: -8, left: '50%', marginLeft: -8,
                        borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                        borderTop: '8px solid white'
                    }} />
                </motion.div>
            )}

        </div>
    );
};