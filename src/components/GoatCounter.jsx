import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GoatCounter = () => {
    const location = useLocation();
    const lastTrackedPath = useRef(null);

    useEffect(() => {
        const path = `${location.pathname}${location.search}`;

        const countPageView = () => {
            if (
                lastTrackedPath.current === path ||
                typeof window.goatcounter?.count !== 'function'
            ) {
                return;
            }

            try {
                window.goatcounter.count({ path });
                lastTrackedPath.current = path;
            } catch (error) {
                console.warn('GoatCounter failed to record a page view:', error);
            }
        };

        countPageView();

        const script = document.getElementById('goatcounter-script');
        if (!script || typeof window.goatcounter?.count === 'function') return undefined;

        script.addEventListener('load', countPageView, { once: true });
        return () => script.removeEventListener('load', countPageView);
    }, [location.pathname, location.search]);

    return null;
};

export default GoatCounter;
