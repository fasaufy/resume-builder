import { useEffect, useRef } from 'react';
import { findBracketed, focusFirstBracketed } from '../lib/sampleText';
import { getResume } from '../store/resume';
import { useUi } from '../store/ui';
import { doPrint } from './controls';

/** "Some fields still have sample text in [brackets]. Export anyway?" shown by doPrint before printing. */
export function ExportConfirm() {
  const kind = useUi((s) => s.confirmExport);
  const back = useRef<HTMLButtonElement>(null);

  const goBack = () => {
    useUi.setState({ confirmExport: null });
    requestAnimationFrame(focusFirstBracketed); // land on the first field to fix
  };
  const exportAnyway = () => {
    useUi.setState({ confirmExport: null });
    if (kind) doPrint(kind, true);
  };

  useEffect(() => {
    if (!kind) return;
    back.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && goBack();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kind]);

  if (!kind) return null;
  const found = findBracketed(getResume());
  const shown = found.slice(0, 4).join(', ') + (found.length > 4 ? `, +${found.length - 4} more` : '');

  return (
    <div className="noprint fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-label="Go back" onClick={goBack} className="absolute inset-0 border-0 p-0" style={{ background: 'rgba(17,24,39,.4)' }} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="export-confirm-title" aria-describedby="export-confirm-list" className="relative flex w-full max-w-[400px] flex-col gap-3 rounded-2xl bg-white p-5" style={{ boxShadow: '0 12px 40px rgba(15,23,42,.2)' }}>
        <p id="export-confirm-title" className="text-[15px] font-semibold leading-[1.4] text-[#111827]">Some fields still have sample text in [brackets]. Export anyway?</p>
        <p id="export-confirm-list" className="text-[12.5px] leading-[1.45] text-[#475569]">Found: {shown}</p>
        <div className="mt-1 flex justify-end gap-2">
          <button ref={back} type="button" className="btn cta touch44" onClick={goBack}>Go back</button>
          <button type="button" className="btn cta touch44" style={{ background: '#111827', color: '#fff' }} onClick={exportAnyway}>Export</button>
        </div>
      </div>
    </div>
  );
}
