import type { CSSProperties } from 'react';
import { LAYOUTS } from '../data/layouts';
import { getTheme, type ThemeDef } from '../data/themes';
import { useResume, type Paper } from '../store/resume';
import { useUi, type Zoom } from '../store/ui';
import logoUrl from '../assets/ui/logo.svg';
import downloadUrl from '../assets/ui/download.svg';
import downloadSmUrl from '../assets/ui/download-sm.svg';

export const doPrint = () => {
  try {
    window.print();
  } catch {
    /* print blocked (e.g. sandboxed frame) */
  }
};

/** Product logo from the UI guideline; `note` adds the "Free · No sign-up" chip. */
export function Mark({ note }: { note?: boolean }) {
  return (
    <div className="mark">
      <img src={logoUrl} width={80.8333} height={20} alt="ResuMe!" />
      {note && <span className="note">Free · No sign-up</span>}
    </div>
  );
}

/** Download glyph from the UI guideline; `small` is the toolbar's Export PDF size (Figma 515:780). */
export const DownloadGlyph = ({ small }: { small?: boolean }) =>
  small ? <img src={downloadSmUrl} width={10.7059} height={13.5735} alt="" aria-hidden="true" /> : <img src={downloadUrl} width={14} height={17.75} alt="" aria-hidden="true" />;

const DESKTOP_ZOOMS: [Zoom, string][] = [['fit', 'Fit'], [75, '75%'], [100, '100%'], [125, '125%']];
const TOUCH_ZOOMS: [Zoom, string][] = [['fit', 'Fit'], [100, '100%']];

export function ZoomSeg({ desktop, big }: { desktop?: boolean; big?: boolean }) {
  const zoom = useUi((s) => s.zoom);
  const setZoom = useUi((s) => s.setZoom);
  return (
    <div className={big ? 'seg frost big' : 'seg frost'} role="group" aria-label="Zoom">
      {(desktop ? DESKTOP_ZOOMS : TOUCH_ZOOMS).map(([z, label]) => (
        <button key={label} type="button" aria-pressed={zoom === z} onClick={() => setZoom(z)}>{label}</button>
      ))}
    </div>
  );
}

const PAPERS: [Paper, string][] = [['A4', 'A4'], ['Letter', 'US Letter']];

export function PaperSeg({ big }: { big?: boolean }) {
  const paper = useResume((s) => s.meta.paper);
  const setPaper = useResume((s) => s.setPaper);
  return (
    <div className={big ? 'seg frost wide big' : 'seg frost wide'} role="group" aria-label="Paper size">
      {PAPERS.map(([p, label]) => (
        <button key={p} type="button" aria-pressed={paper === p} onClick={() => setPaper(p)}>{label}</button>
      ))}
    </div>
  );
}

export function OverBadge({ short, style }: { short?: boolean; style?: CSSProperties }) {
  const over = useUi((s) => s.over);
  if (!over) return null;
  return <span className="badge" style={style}>{short ? '2+ pages' : 'Content runs past one page'}</span>;
}

export function SampleClearButtons({ tall }: { tall?: boolean }) {
  const loadSample = useResume((s) => s.loadSample);
  const confirmClear = useUi((s) => s.confirmClear);
  const clearAll = useUi((s) => s.clearAll);
  // same white pill as Export PDF; tall = 44px for the mobile sheet, otherwise 36px with a 44px tap area
  const base = tall ? 'btn cta tall' : 'btn cta touch44';
  const cls = confirmClear ? `${base} btnw` : base;
  return (
    <>
      <button type="button" className={base} onClick={loadSample}>Load sample</button>
      <button type="button" className={cls} onClick={clearAll}>{confirmClear ? 'Tap again to clear' : 'Clear all'}</button>
    </>
  );
}

export function ThemeDots({ t }: { t: ThemeDef }) {
  return (
    <span style={{ display: 'flex', flex: 'none' }}>
      <span className="dot" style={{ display: 'block', background: t.p }} />
      <span className="dot" style={{ display: 'block', background: t.t, marginLeft: -7 }} />
    </span>
  );
}

/** Active layout + theme, and whether a theme is recommended (★) for the active layout. */
export function useActive() {
  const layout = useResume((s) => s.meta.layout);
  const themeId = useResume((s) => s.meta.theme);
  const cur = LAYOUTS[layout];
  return { layout, cur, theme: getTheme(themeId), rec: (t: ThemeDef) => t.cat === cur.cat };
}

