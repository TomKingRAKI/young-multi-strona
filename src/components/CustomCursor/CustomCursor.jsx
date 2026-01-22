// Plik: /src/components/CustomCursor/CustomCursor.jsx

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

function CustomCursor() {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth spring animation
    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Scale animation
    const cursorScale = useMotionValue(1);
    const scaleSpring = useSpring(cursorScale, { damping: 20, stiffness: 400 });

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Event delegation for hover state
            const target = e.target;
            const isInteractive = target.closest('a, button, [role="button"], .product-card, .streaming-link, input, textarea, select, .interactive');

            if (isInteractive && !isDragging) {
                if (!isHovering) {
                    scaleSpring.set(2);
                    setIsHovering(true);
                }
            } else {
                if (isHovering && !isDragging) {
                    scaleSpring.set(1);
                    setIsHovering(false);
                }
            }
        };

        const handleDragStart = () => {
            setIsDragging(true);
            scaleSpring.set(1.5);
        };

        const handleDragEnd = () => {
            setIsDragging(false);
            scaleSpring.set(isHovering ? 2 : 1);
        };

        // Track mouse movement and hovers via delegation
        window.addEventListener('mousemove', moveCursor);

        // Track drag on jelly dread handles (keep legacy listeners if needed, or stick to delegation if possible)
        // For specific drag logic that might be preventDefault-heavy, we might stick to specific listeners or just global mouseup
        window.addEventListener('mouseup', handleDragEnd);

        // For specific draggables, we might still want to listen `mousedown` if we can't delegate easily
        // But for "jelly-dread-handle", let's try delegation too or keep it simple. 
        // Let's rely on the previous implementation's specific logic for dragging if it was complex, 
        // but here we just toggle visual state.
        const handleMouseDown = (e) => {
            if (e.target.closest('.jelly-dread-handle')) {
                handleDragStart();
            }
        };
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [cursorX, cursorY, scaleSpring, isHovering, isDragging]);

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null; // Return null effectively disables it
    }

    // Use direct position when dragging, spring animation otherwise
    const xPos = isDragging ? cursorX : cursorXSpring;
    const yPos = isDragging ? cursorY : cursorYSpring;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className={`custom-cursor-dot ${isDragging ? 'is-dragging' : ''}`}
                style={{
                    x: xPos,
                    y: yPos,
                    scale: scaleSpring
                }}
            />

            {/* Outer ring */}
            <motion.div
                className={`custom-cursor-ring ${isDragging ? 'is-dragging' : ''}`}
                style={{
                    x: xPos,
                    y: yPos,
                    scale: scaleSpring
                }}
            />
        </>
    );
}

export default CustomCursor;
