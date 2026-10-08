import { flushSync } from 'react-dom';
import { useUi } from '../store/ui';

/*
 * Print-mode lifecycle. The Export button sets `exporting` itself (controls.tsx → doPrint);
 * these listeners also cover the browser's own print (Cmd/Ctrl+P) and always reset afterwards.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeprint', () => {
    if (!useUi.getState().exporting) flushSync(() => useUi.setState({ exporting: true }));
  });
  window.addEventListener('afterprint', () => useUi.setState({ exporting: false }));
}
