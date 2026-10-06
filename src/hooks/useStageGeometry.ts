import type { Paper } from '../store/resume';
import type { Zoom } from '../store/ui';
import type { Mode } from './useBreakpoint';

export const PAPER_SIZE: Record<Paper, { pw: number; ph: number }> = {
  A4: { pw: 794, ph: 1123 },
  Letter: { pw: 816, ph: 1056 },
};

export interface StageGeometry {
  pw: number;
  ph: number;
  scale: number;
  /** Slide box size (scaled page). */
  sw: number;
  sh: number;
  gap: number;
  /** Leading / trailing spacer width. */
  spacer: number;
  /** Zoom is not Fit: show only the active page, free 2D scroll. */
  focus: boolean;
}

/** Formulas copied from the wireframe's renderVals(). */
export function stageGeometry(mode: Mode, paper: Paper, zoom: Zoom, stageW: number, stageH: number, appW: number): StageGeometry {
  const { pw, ph } = PAPER_SIZE[paper];
  const isDesk = mode === 'desktop';
  const sW = stageW || Math.max(320, appW - (isDesk ? 330 : 0));
  const sH = stageH || 600;
  let fit =
    mode === 'desktop'
      ? Math.min((sH - 40) / ph, (sW * 0.64) / pw)
      : mode === 'tablet'
        ? Math.min((sH - 28) / ph, (sW - 120) / pw)
        : Math.min((sW - 40) / pw, (sH - 20) / ph);
  fit = Math.max(0.18, fit);
  const focus = zoom !== 'fit';
  const scale = zoom === 'fit' ? fit : zoom / 100;
  const sw = Math.round(pw * scale);
  const sh = Math.round(ph * scale);
  const gap = isDesk ? 56 : 20;
  const pad = Math.max(16, Math.round((sW - sw) / 2));
  return { pw, ph, scale, sw, sh, gap, spacer: Math.max(0, pad - gap), focus };
}

export function useStageGeometry(mode: Mode, paper: Paper, zoom: Zoom, stageW: number, stageH: number, appW: number) {
  return stageGeometry(mode, paper, zoom, stageW, stageH, appW);
}
