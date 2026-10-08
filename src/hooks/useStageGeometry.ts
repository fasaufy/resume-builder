import type { Paper } from '../store/resume';
import type { Zoom } from '../store/ui';
import type { Mode } from './useBreakpoint';

export const PAPER_SIZE: Record<Paper, { pw: number; ph: number }> = {
  A4: { pw: 794, ph: 1123 },
  Letter: { pw: 816, ph: 1056 },
};

/** Space between the pages of one resume when it runs to several pages (paper px, before scaling). */
export const PAGE_GAP = 40;

/** Width of a resume's pages laid side by side. */
export const spreadWidth = (pw: number, pages: number) => pages * pw + (pages - 1) * PAGE_GAP;

export interface StageGeometry {
  pw: number;
  ph: number;
  scale: number;
  /** Slide box size for a one-page resume (scaled page). Multi-page slides are wider: see slideWidth. */
  sw: number;
  sh: number;
  gap: number;
  /** Zoom is not Fit: show only the active page, free 2D scroll. */
  focus: boolean;
  /** Stage size the geometry was computed for. */
  sW: number;
}

/**
 * Formulas copied from the wireframe's renderVals(), extended for multi-page resumes:
 * at Fit the active resume's whole spread (all its pages side by side) has to fit the stage width too.
 */
export function stageGeometry(mode: Mode, paper: Paper, zoom: Zoom, stageW: number, stageH: number, appW: number, activePages = 1): StageGeometry {
  const { pw, ph } = PAPER_SIZE[paper];
  const isDesk = mode === 'desktop';
  const sW = stageW || Math.max(320, appW - (isDesk ? 330 : 0));
  const sH = stageH || 600;
  const spread = spreadWidth(pw, activePages);
  let fit =
    mode === 'desktop'
      ? Math.min((sH - 40) / ph, (sW * 0.64) / pw, activePages > 1 ? (sW * 0.92) / spread : Infinity)
      : mode === 'tablet'
        ? Math.min((sH - 28) / ph, (sW - 120) / spread)
        : Math.min((sW - 40) / spread, (sH - 20) / ph);
  fit = Math.max(0.18, fit);
  const focus = zoom !== 'fit';
  const scale = zoom === 'fit' ? fit : zoom / 100;
  const sw = Math.round(pw * scale);
  const sh = Math.round(ph * scale);
  const gap = isDesk ? 56 : 20;
  return { pw, ph, scale, sw, sh, gap, focus, sW };
}

/** Scaled width of a slide showing `pages` pages. */
export const slideWidth = (g: StageGeometry, pages: number) => Math.round(spreadWidth(g.pw, pages) * g.scale);

/** Leading / trailing spacer so the first / last slide can be centred. */
export const spacerFor = (g: StageGeometry, slideW: number) => Math.max(0, Math.max(16, Math.round((g.sW - slideW) / 2)) - g.gap);
