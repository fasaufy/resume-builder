import { DownloadGlyph, doPrint, Mark, PaperSeg, ZoomSeg } from './controls';
import { useSaveStatus } from '../store/resume';

/** Desktop top bar: zoom Fit/75/100/125, paper, Export. */
export function DesktopBar() {
  const saveOk = useSaveStatus((s) => s.ok);
  return (
    <header className="bar noprint">
      <Mark note />
      <div style={{ flex: 1 }} />
      <span className="stat">{saveOk ? 'Autosaved in this browser' : 'Storage off: edits last this session'}</span>
      <ZoomSeg desktop />
      <PaperSeg />
      <button type="button" className="btn btnp cta" onClick={doPrint}><DownloadGlyph small />Export PDF</button>
    </header>
  );
}

/** Tablet top bar: 44px targets, zoom Fit/100%, paper, Export. */
export function TabletBar() {
  return (
    <header className="bar noprint" style={{ height: 60 }}>
      <Mark />
      <div style={{ flex: 1 }} />
      <ZoomSeg big />
      <PaperSeg big />
      <button type="button" className="btn btnp cta tall" onClick={doPrint}><DownloadGlyph small />Export PDF</button>
    </header>
  );
}
