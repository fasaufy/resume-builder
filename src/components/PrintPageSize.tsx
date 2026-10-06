import { useEffect } from 'react';
import { useResume } from '../store/resume';

/** Injects `@page { size: A4 | letter; margin: 0 }` from meta.paper (the wireframe could not). */
export function PrintPageSize() {
  const paper = useResume((s) => s.meta.paper);
  useEffect(() => {
    const el = document.createElement('style');
    el.dataset.print = 'page-size';
    el.textContent = `@media print { @page { size: ${paper === 'Letter' ? 'letter' : 'A4'}; margin: 0; } }`;
    document.head.appendChild(el);
    return () => el.remove();
  }, [paper]);
  return null;
}
