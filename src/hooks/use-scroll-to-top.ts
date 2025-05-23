import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that scrolls the window to the top when the route pathname changes.
 * This ensures that when users navigate to a new page, they start at the top of the content.
 */
export function useScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use immediate scrolling for more reliability
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

/**
 * A function to be called explicitly when needed, such as when clicking pagination buttons
 * This can be used in event handlers directly
 */
export function scrollToTop() {
    window.scrollTo(0, 0);
}