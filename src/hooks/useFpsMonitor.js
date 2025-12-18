import { useRef, useCallback } from 'react';

const useFpsMonitor = () => {
    const frameCount = useRef(0);
    const startTime = useRef(0);
    const isMonitoring = useRef(false);
    const rafId = useRef(null);

    const startMonitoring = useCallback(() => {
        frameCount.current = 0;
        startTime.current = performance.now();
        isMonitoring.current = true;

        const loop = () => {
            if (!isMonitoring.current) return;
            frameCount.current++;
            rafId.current = requestAnimationFrame(loop);
        };
        rafId.current = requestAnimationFrame(loop);
    }, []);

    const stopMonitoring = useCallback(() => {
        isMonitoring.current = false;
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }

        const endTime = performance.now();
        const duration = endTime - startTime.current;
        const frames = frameCount.current;

        // Calculate FPS
        // duration is in ms, so duration / 1000 is seconds
        const seconds = duration / 1000;
        const fps = seconds > 0 ? frames / seconds : 60;

        return fps;
    }, []);

    return { startMonitoring, stopMonitoring };
};

export default useFpsMonitor;
