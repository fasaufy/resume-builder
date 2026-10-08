import { createContext, type CSSProperties, type ReactNode } from 'react';
import type { ThemeDef } from '../data/themes';

/** Page scale, so drag offsets can be converted back to paper pixels. */
export const PageScale = createContext(1);

interface PageProps {
  pw: number;
  ph: number;
  scale: number;
  theme: ThemeDef;
  /** Printing the ATS version: the page flows onto as many sheets as it needs. */
  ats?: boolean;
  children: ReactNode;
}

/** Paper box rendered at full paper size and scaled with a transform (never rasterized). */
export function Page({ pw, ph, scale, theme, ats, children }: PageProps) {
  const style = {
    background: '#fff',
    width: pw,
    height: ph,
    transform: `scale(${scale.toFixed(4)})`,
    '--theme-primary': theme.p,
    '--theme-secondary': theme.s,
    '--theme-tint': theme.t,
  } as CSSProperties;

  return (
    <div className={ats ? 'page ats-print' : 'page'} data-scope="page" style={style}>
      <PageScale.Provider value={scale}>{children}</PageScale.Provider>
    </div>
  );
}
