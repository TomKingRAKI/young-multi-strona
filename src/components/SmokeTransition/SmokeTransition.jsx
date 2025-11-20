import React, { useRef, useEffect } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import './SmokeTransition.css';

const SmokeTransition = ({ progress }) => {
    const videoRef = useRef(null);

    // To jest serce mechanizmu - nasłuchujemy zmian scrolla
    useMotionValueEvent(progress, "change", (latestValue) => {
        const video = videoRef.current;

        // Sprawdzamy czy wideo jest załadowane i ma duration
        if (video && video.duration) {
            // latestValue to liczba od 0 do 1.
            // Mnożymy przez długość filmu, żeby uzyskać konkretną sekundę.
            const targetTime = latestValue * video.duration;

            // Ustawiamy czas filmu
            if (Number.isFinite(targetTime)) {
                video.currentTime = targetTime;
            }
        }
    });

    return (
        <div className="smoke-transition-container">
            <video
                ref={videoRef}
                className="smoke-video"
                src="/smoke-transition.mp4" // Ścieżka do pliku w folderze public
                muted
                playsInline
                preload="auto" // Ważne: ładujemy film od razu, żeby nie zacinał
            />
        </div>
    );
};

export default SmokeTransition;