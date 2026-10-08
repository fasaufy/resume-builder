import { createContext, type CSSProperties, type ReactNode } from 'react';
import type { ThemeDef } from '../data/themes';
import { PAGE_GAP } from '../hooks/useStageGeometry';

/** Page scale, so drag offsets can be converted back to paper pixels. */
export const PageScale = createContext(1);

interface PageProps {
  pw: number;
  ph: number;
  scale: number;
  theme: ThemeDef;
  /** Number of pages the content currently needs (measured by the Carousel). */
  pages: number;
  /** Background painted on every sheet (e.g. a full-height tinted sidebar), on top of white. */
  sheet?: string;
  /** Printing the ATS version: the page flows onto as many sheets as it needs. */
  ats?: boolean;
  children: ReactNode;
}

/**
 * The resume's paper, rendered at full paper size and scaled with a transform (never rasterized).
 *
 * Multi-page: the page is a multi-column container whose columns are exactly one sheet wide and tall.
 * When the content outgrows a sheet, the browser flows it into the next column, which shows as the
 * next page beside it. Items never split across pages (break-inside: avoid on .item), and `.flow`
 * repeats its top / bottom padding on every page (box-decoration-break: clone) as page margins.
 * Print uses the same engine to split pages, so the PDF breaks where the screen does.
 */
export function Page({ pw, ph, scale, theme, pages, sheet, ats, children }: PageProps) {
  const style = {
    width: pw,
    height: ph,
    columnWidth: pw,
    columnGap: PAGE_GAP,
    columnFill: 'auto',
    transform: `scale(${scale.toFixed(4)})`,
    '--theme-primary': theme.p,
    '--theme-secondary': theme.s,
    '--theme-tint': theme.t,
  } as CSSProperties;

  return (
    <div className={ats ? 'page ats-print' : 'page'} data-scope="page" data-pages={pages} style={style}>
      {Array.from({ length: pages }, (_, k) => (
        <div key={k} className="sheet noprint" aria-hidden="true" style={{ left: k * (pw + PAGE_GAP), width: pw, height: ph, background: sheet ? `${sheet}, #fff` : '#fff' }} />
      ))}
      <div className="flow">
        <PageScale.Provider value={scale}>{children}</PageScale.Provider>
      </div>
    </div>
  );
}
