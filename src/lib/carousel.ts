import { useResume } from '../store/resume';

/**
 * The mounted Carousel registers its animated goTo here so chrome
 * (inspector, panels, sheets, keyboard) can switch layouts the same way.
 */
let impl: ((i: number) => void) | null = null;

export function registerGoTo(fn: ((i: number) => void) | null) {
  impl = fn;
}

export function goTo(i: number) {
  if (impl) impl(i);
  else useResume.getState().setLayout(i);
}
