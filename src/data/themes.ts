import type { LayoutCat } from './layouts';

export type ThemeId =
  | 'wall-street'
  | 'terminal-mono'
  | 'british-racing'
  | 'obsidian-black'
  | 'bauhaus-studio'
  | 'terracotta-calm'
  | 'sage-modern'
  | 'electric-atelier';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  cat: LayoutCat;
  /** primary */
  p: string;
  /** secondary */
  s: string;
  /** tint (backgrounds) */
  t: string;
}

export const THEMES: ThemeDef[] = [
  { id: 'wall-street', name: 'Wall Street', cat: 'Corporate', p: '#1e3a8a', s: '#e2e8f0', t: '#e2e8f0' },
  { id: 'terminal-mono', name: 'Terminal Mono', cat: 'Corporate', p: '#1f2937', s: '#9ca3af', t: '#f3f4f6' },
  { id: 'british-racing', name: 'British Racing', cat: 'Corporate', p: '#064e3b', s: '#fef3c7', t: '#fef3c7' },
  { id: 'obsidian-black', name: 'Obsidian Black', cat: 'Corporate', p: '#000000', s: '#71717a', t: '#f4f4f5' },
  { id: 'bauhaus-studio', name: 'Bauhaus Studio', cat: 'Creative', p: '#2563eb', s: '#fef08a', t: '#fef08a' },
  { id: 'terracotta-calm', name: 'Terracotta Calm', cat: 'Creative', p: '#c2410c', s: '#f5f5f4', t: '#f5f5f4' },
  { id: 'sage-modern', name: 'Sage Modern', cat: 'Creative', p: '#0d9488', s: '#f0fdfa', t: '#f0fdfa' },
  { id: 'electric-atelier', name: 'Electric Atelier', cat: 'Creative', p: '#4338ca', s: '#ede9fe', t: '#ede9fe' },
];

export const DEFAULT_THEME: ThemeId = 'wall-street';

export function getTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function isThemeId(id: unknown): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}
