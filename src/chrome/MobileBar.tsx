import { useUi } from '../store/ui';
import { DownloadGlyph, doPrint, Mark, OverBadge } from './controls';
import { EditIcon, LayoutIcon, ThemeIcon, ZoomIcon } from './icons';

/** Mobile top bar: mark, 2+ pages badge, Export icon. */
export function MobileTopBar() {
  return (
    <header className="bar noprint" style={{ height: 56, padding: '0 10px 0 14px', gap: 8 }}>
      <Mark />
      <div style={{ flex: 1 }} />
      <OverBadge short style={{ padding: '3px 8px', fontSize: 11 }} />
      <button type="button" className="ib" onClick={doPrint} aria-label="Export PDF"><DownloadGlyph /></button>
    </header>
  );
}

/** Mobile bottom bar: Edit, Layout, Theme, Zoom toggle. */
export function MobileBar() {
  const setSheet = useUi((s) => s.setSheet);
  const zoom = useUi((s) => s.zoom);
  const setZoom = useUi((s) => s.setZoom);
  return (
    <nav className="noprint" aria-label="Editor tools" style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 4, padding: '6px 8px calc(6px + env(safe-area-inset-bottom,0px))', background: '#fff', borderTop: '1px solid #d6d9de' }}>
      <button type="button" className="tbb" onClick={() => setSheet('edit')}><EditIcon />Edit</button>
      <button type="button" className="tbb" onClick={() => setSheet('layout')}><LayoutIcon />Layout</button>
      <button type="button" className="tbb" onClick={() => setSheet('theme')}><ThemeIcon />Theme</button>
      <button type="button" className="tbb" onClick={() => setZoom(zoom === 'fit' ? 100 : 'fit')}><ZoomIcon />{zoom === 'fit' ? '100%' : 'Fit'}</button>
    </nav>
  );
}
