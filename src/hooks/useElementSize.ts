import { useLayoutEffect, useState } from 'react';

export interface Size {
  w: number;
  h: number;
}

/** Rounded clientWidth/clientHeight of an element, tracked with a ResizeObserver. */
export function useElementSize(el: HTMLElement | null): Size {
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);

  return size;
}
