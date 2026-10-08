import type { Resume } from '../store/resume';

/** A bracketed sample value such as "[Previous role]" or "[MMM YYYY]". */
const BRACKETED = /\[[^\]\n]{1,60}\]/g;

/** Every distinct bracketed sample value still in the resume's text (photos excluded). */
export function findBracketed(r: Resume): string[] {
  const texts: string[] = [
    ...Object.values(r.basics),
    ...Object.values(r.titles),
    ...r.exp.flatMap((x) => [x.role, x.company, x.location, x.start, x.end, ...x.bullets]),
    ...r.edu.flatMap((x) => [x.degree, x.school, x.year, x.detail]),
    ...r.skills.map((x) => x.v),
    ...r.projects.flatMap((x) => [x.name, x.link, x.desc]),
  ];
  return [...new Set(texts.flatMap((t) => t.match(BRACKETED) ?? []))];
}

/** Put the cursor in the first field on the active page that still holds bracketed sample text. */
export function focusFirstBracketed() {
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.slide.is-active .page input, .slide.is-active .page textarea');
  const el = [...fields].find((f) => /\[[^\]\n]{1,60}\]/.test(f.value));
  if (!el) return;
  el.focus();
  el.select();
}
