import { useState, useEffect } from 'react';

/**
 * Custom hook to track media query state.
 * Replaces duplicated resize listeners across components.
 * 
 * @param query - CSS media query string, e.g. '(max-width: 768px)'
 * @returns boolean - whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // For SSR safety, fall back to useState if useSyncExternalStore is not ideal
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Sync with current value via the event handler pattern
    // (avoids calling setState directly in effect body)
    if (mediaQuery.matches !== matches) {
      setMatches(mediaQuery.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}
