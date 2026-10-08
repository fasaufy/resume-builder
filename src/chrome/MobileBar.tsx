import { useUi } from '../store/ui';
import { DownloadGlyph, doPrint, Mark, OverBadge } from './controls';
import editUrl from '../assets/ui/tool-edit.svg';
import layoutUrl from '../assets/ui/tool-layout.svg';
import themeUrl from '../assets/ui/tool-theme.svg';
import zoomUrl from '../assets/ui/tool-zoom.svg';

/** Mobile top bar: mark, 2+ pages badge, Export icon. */
export function MobileTopBar() {
  return (
    <header className="bar noprint" style={{ height: 56, padding: '0 10px 0 14px', gap: 8 }}>
      <Mark />
      <div style={{ flex: 1 }} />
      <OverBadge short style={{ padding: '3px 8px', fontSize: 11 }} />
      <button type="button" className="ib" onClick={() => doPrint()} aria-label="Export PDF"><DownloadGlyph /></button>
    </header>
  );
}

/** Mobile floating tool dock: Edit, Layout, Theme, Zoom toggle (Figma 532:3620). */
export function MobileBar() {
  const setSheet = useUi((s) => s.setSheet);
  const zoom = useUi((s) => s.zoom);
  const setZoom = useUi((s) => s.setZoom);
  return (
    <div className="noprint flex-none px-4" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom,0px))' }}>
      <nav className="dock flex gap-[10px]" aria-label="Editor tools">
        <button type="button" className="tool" onClick={() => setSheet('edit')}><img src={editUrl} alt="" />Edit</button>
        <button type="button" className="tool" onClick={() => setSheet('layout')}><img src={layoutUrl} alt="" />Layout</button>
        <button type="button" className="tool" onClick={() => setSheet('theme')}><img src={themeUrl} alt="" />Theme</button>
        <button type="button" className="tool" onClick={() => setZoom(zoom === 'fit' ? 100 : 'fit')}><img src={zoomUrl} alt="" />{zoom === 'fit' ? '100%' : 'Fit'}</button>
      </nav>
    </div>
  );
}
