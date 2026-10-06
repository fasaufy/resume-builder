/* Inline icons copied from the wireframe (stroke, currentColor). */
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" {...base}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
export const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
export const LayoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="8" rx="1" /><rect x="14" y="15" width="7" height="6" rx="1" /></svg>
);
export const ThemeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M12 12h9" /></svg>
);
export const ZoomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
);
