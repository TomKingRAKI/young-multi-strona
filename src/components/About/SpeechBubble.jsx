import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './About.css'; // Reusing About.css for styles

export function SpeechBubble({ text, direction, onTypingComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayedText('');
        setShowCursor(true);
        let currentIndex = 0;

        // Szybsze pisanie dla dłuższego tekstu, wolniejsze dla krótszego
        const typingSpeed = Math.max(20, Math.min(50, 1500 / text.length));

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                const charToAdd = text[currentIndex];
                setDisplayedText((prev) => prev + charToAdd);
                currentIndex++;
            } else {
                clearInterval(intervalId);
                setShowCursor(false);
                if (onTypingComplete) onTypingComplete();
            }
        }, typingSpeed);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <motion.div
            className={`about-speech-bubble ${direction === 'left' ? 'bubble-left' : 'bubble-right'}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {displayedText}
            {showCursor && <span className="cursor">|</span>}
        </motion.div>
    );
}
