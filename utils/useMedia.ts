import { useState, useCallback, useEffect } from 'react';

function isMobileWindowSize(query) {
    if (typeof window !== 'undefined') {
        if (window.matchMedia(`(${query})`).matches) {
            return true;
        }
    }

    return false;
};

export default function useMedia(query: string) {
    const [useMedia, setUseMedia] = useState(isMobileWindowSize(query));

    const resizeEvent = useCallback(() => {
        setUseMedia(isMobileWindowSize(query));
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        };
    }, []);

    return useMedia;
}