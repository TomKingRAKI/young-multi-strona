// Plik: /src/components/CustomCursor/CustomCursor.jsx

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

function CustomCursor() {
    const [isDragging, setIsDragging] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const cursorScale = useMotionValue(1);

    // Smooth spring animation (used when not dragging)
    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const scaleSpring = useSpring(cursorScale, { damping: 20, stiffness: 400 });

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseEnterLink = () => {
            cursorScale.set(2);
        };

        const handleMouseLeaveLink = () => {
            cursorScale.set(1);
        };

        // Detect drag start on draggable elements
        const handleDragStart = () => {
            setIsDragging(true);
            cursorScale.set(1.5);
        };

        const handleDragEnd = () => {
            setIsDragging(false);
            cursorScale.set(1);
        };

        // Track mouse movement
        window.addEventListener('mousemove', moveCursor);

        // Track mouseup globally (for drag end)
        window.addEventListener('mouseup', handleDragEnd);

        // Track hover on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], .product-card, .streaming-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnterLink);
            el.addEventListener('mouseleave', handleMouseLeaveLink);
        });

        // Track drag on jelly dread handles
        const draggableElements = document.querySelectorAll('.jelly-dread-handle');
        draggableElements.forEach(el => {
            el.addEventListener('mousedown', handleDragStart);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseup', handleDragEnd);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnterLink);
                el.removeEventListener('mouseleave', handleMouseLeaveLink);
            });
            draggableElements.forEach(el => {
                el.removeEventListener('mousedown', handleDragStart);
            });
        };
    }, [cursorX, cursorY, cursorScale]);

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
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

