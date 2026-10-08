import { useLayoutEffect } from 'react';
import { LAYOUTS } from '../data/layouts';
import { getTheme } from '../data/themes';
import { useResume } from '../store/resume';
import { useUi } from '../store/ui';

/**
 * Injects `@page { size: A4 | letter; margin }` from meta.paper (the wireframe could not).
 * The designed page carries its own padding (margin 0); the ATS version can run to several sheets,
 * so it gets real page margins that repeat on every sheet.
 */
export function PrintPageSize() {
  const paper = useResume((s) => s.meta.paper);
  const ats = useUi((s) => s.exporting === 'ats');
  const sheet = LAYOUTS[useResume((s) => s.meta.layout)].sheet;
  const tint = getTheme(useResume((s) => s.meta.theme)).t;
  useLayoutEffect(() => {
    const el = document.createElement('style');
    el.dataset.print = 'page-size';
    // a full-height sidebar tint is painted on the paper itself, so it runs down every printed sheet
    const paperBg = sheet && !ats ? `html { --theme-tint: ${tint}; background: ${sheet}, #fff !important; }` : '';
    el.textContent = `@media print { @page { size: ${paper === 'Letter' ? 'letter' : 'A4'}; margin: ${ats ? '16mm 18mm' : '0'}; } ${paperBg} }`;
    document.head.appendChild(el);
    return () => el.remove();
  }, [paper, ats, sheet, tint]);
  return null;
}
