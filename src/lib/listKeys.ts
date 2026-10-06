import type { KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { useResume } from '../store/resume';

type FieldEvent = KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;

/** Focus `sel` inside the closest [data-scope] and put the caret at the end. */
function focusIn(scope: Element | null, sel: string) {
  const el = scope?.querySelector<HTMLInputElement | HTMLTextAreaElement>(sel);
  if (!el) return;
  el.focus();
  const n = el.value.length;
  el.setSelectionRange?.(n, n);
}

export const bulletId = (expId: string, j: number) => `${expId}-${j}`;
export const skillId = (i: number) => `sk-${i}`;

/** Enter inserts a bullet after this one; Backspace on an empty bullet removes it (one always remains). */
export function onBulletKey(e: FieldEvent, expId: string, j: number) {
  const scope = e.currentTarget.closest('[data-scope]');
  const store = useResume.getState();
  const item = store.exp.find((x) => x.id === expId);
  if (!item) return;
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault();
    flushSync(() => store.insertBullet(expId, j + 1));
    focusIn(scope, `[data-bid="${bulletId(expId, j + 1)}"]`);
  } else if (e.key === 'Backspace' && e.currentTarget.value === '' && item.bullets.length > 1) {
    e.preventDefault();
    flushSync(() => store.removeBullet(expId, j));
    focusIn(scope, `[data-bid="${bulletId(expId, Math.max(0, j - 1))}"]`);
  }
}

/** Enter inserts a skill after this one; Backspace on an empty skill removes it (one always remains). */
export function onSkillKey(e: FieldEvent, i: number) {
  const scope = e.currentTarget.closest('[data-scope]');
  const store = useResume.getState();
  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
    e.preventDefault();
    flushSync(() => store.insertItem('skills', i + 1));
    focusIn(scope, `[data-sid="${skillId(i + 1)}"]`);
  } else if (e.key === 'Backspace' && e.currentTarget.value === '' && store.skills.length > 1) {
    e.preventDefault();
    const id = store.skills[i]?.id;
    if (!id) return;
    flushSync(() => store.removeItem('skills', id));
    focusIn(scope, `[data-sid="${skillId(Math.max(0, i - 1))}"]`);
  }
}
