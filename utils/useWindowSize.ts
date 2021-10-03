import { useState, useEffect } from "react";

export function useWindowSizeOrientation() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("orientationchange", () => {
            setTimeout(() => { handleResize() }, 200)
        });

        handleResize();
        return () => window.removeEventListener("orientationchange", handleResize);

    }, []);

    return windowSize;
}

export function useWindowSizeResize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", () => {
            setTimeout(() => { handleResize() }, 200)
        });

        handleResize();
        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return windowSize;
}