export type Mode = 'mobile' | 'tablet' | 'desktop';

/**
 * Mode from the app root container width (never window media queries,
 * so the app behaves inside an embedded frame).
 * ≤767 mobile · 768–1023 tablet · ≥1024 desktop
 */
export function modeFor(width: number): Mode {
  if (width <= 767) return 'mobile';
  if (width <= 1023) return 'tablet';
  return 'desktop';
}

export function useBreakpoint(rootWidth: number): Mode {
  // Before the first measurement, fall back to the window so we don't flash the wrong chrome.
  const w = rootWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
  return modeFor(w);
}
