import React, { useEffect } from 'react';
import { motion, useAnimation, animate } from 'framer-motion';

// ...

export function SpectralGuide({ startPos, ghostOffset }) {
    const controls = useAnimation();

    useEffect(() => {
        let isMounted = true;
        let activeDreadAnimation = null;

        const runLoop = async () => {
            if (!isMounted) return;

            // Reset
            ghostOffset.x.set(0);
            ghostOffset.y.set(0);

            // 1. Appear
            await controls.start({ opacity: 0.6, scale: 1, transition: { duration: 0.8 } });
            if (!isMounted) return;

            // 2. Grab
            await controls.start({ scale: 0.8, transition: { duration: 0.3 } });
            if (!isMounted) return;

            // 3. Pull (Ghost moves, Dread follows)
            const ghostPull = controls.start({ x: "-4.16vw", transition: { duration: 1.0, ease: "easeInOut" } });

            // Dread Physics - save reference to stop it later
            activeDreadAnimation = animate(ghostOffset.x, -80, { duration: 1.0, ease: "easeInOut" });

            await Promise.all([ghostPull, activeDreadAnimation]);
            if (!isMounted) return;

            // 4. Release (Ghost fades out, Dread springs back)
            const fadeOut = controls.start({ opacity: 0, scale: 1.5, transition: { duration: 0.4 } });

            activeDreadAnimation = animate(ghostOffset.x, 0, { type: "spring", stiffness: 400, damping: 20 });

            await Promise.all([fadeOut, activeDreadAnimation]);
            if (!isMounted) return;

            // Reset visual ghost position
            controls.set({ x: 0, y: 0 });

            // 5. Pause
            await new Promise(r => setTimeout(r, 2000));

            // Loop
            if (isMounted) runLoop();
        };

        runLoop();

        return () => {
            isMounted = false;
            controls.stop(); // Stop visual ghost
            if (activeDreadAnimation) activeDreadAnimation.stop(); // Stop dread physics
            ghostOffset.x.stop(); // Stop any other motion on value
            ghostOffset.x.set(0); // Snap back immediately
        };
    }, [controls, ghostOffset]);

    return (
        <motion.div
            className="spectral-guide"
            initial={{ opacity: 0, scale: 0 }}
            animate={controls}
            style={{
                left: startPos.x,
                top: startPos.y,
            }}
        >
            <div className="spectral-core" />
            <div className="spectral-glow" />
        </motion.div>
    );
}
