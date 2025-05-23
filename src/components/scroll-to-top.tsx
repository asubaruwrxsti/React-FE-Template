import { useScrollToTop } from "@/hooks/use-scroll-to-top";

/**
 * Component that automatically scrolls to the top of the page
 * whenever the route changes. Should be placed inside the Router component.
 */
export function ScrollToTop() {
    useScrollToTop();
    return null;
}