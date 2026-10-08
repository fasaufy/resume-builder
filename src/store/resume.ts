import { create } from 'zustand';
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware';
import { LAYOUTS } from '../data/layouts';
import { DEFAULT_THEME, isThemeId, type ThemeId } from '../data/themes';

export const STORAGE_KEY = 'canvas-resume-builder:v1';

/* ---------- schema ---------- */

export type Paper = 'A4' | 'Letter';

export interface Meta {
  version: '1.0.0';
  layout: number; // 0–9
  theme: ThemeId;
  paper: Paper;
}
export interface Basics {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}
export interface Titles {
  summary: string;
  exp: string;
  edu: string;
  skills: string;
  projects: string;
}
export interface ExpItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}
export interface EduItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  detail: string;
}
export interface SkillItem {
  id: string;
  v: string;
}
export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  desc: string;
  /** Thumbnail as a JPEG data URL (16:9, downscaled before saving), or '' for none. */
  image: string;
}

export interface Resume {
  meta: Meta;
  basics: Basics;
  titles: Titles;
  exp: ExpItem[];
  edu: EduItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
}

export type ListKey = 'exp' | 'edu' | 'skills' | 'projects';
export type ListItem<K extends ListKey> = Resume[K][number];
export type EditableField<K extends ListKey> = Exclude<keyof ListItem<K>, 'id' | 'bullets'>;

/* ---------- factories ---------- */

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function newItem<K extends ListKey>(list: K): ListItem<K>;
export function newItem(list: ListKey): ListItem<ListKey> {
  if (list === 'exp') return { id: uid(), role: '', company: '', location: '', start: '', end: '', bullets: ['', '', ''] };
  if (list === 'edu') return { id: uid(), degree: '', school: '', year: '', detail: '' };
  if (list === 'projects') return { id: uid(), name: '', link: '', desc: '', image: '' };
  return { id: uid(), v: '' };
}

export function blank(): Resume {
  return {
    meta: { version: '1.0.0', layout: 0, theme: DEFAULT_THEME, paper: 'A4' },
    basics: { fullName: '', headline: '', email: '', phone: '', location: '', website: '', summary: '' },
    titles: { summary: 'Profile', exp: 'Experience', edu: 'Education', skills: 'Skills', projects: 'Projects' },
    exp: [newItem('exp'), newItem('exp')],
    edu: [newItem('edu')],
    skills: [0, 1, 2, 3, 4, 5].map(() => newItem('skills')),
    projects: [newItem('projects'), newItem('projects')],
  };
}

export function sample(): Omit<Resume, 'meta' | 'titles'> {
  return {
    basics: { fullName: 'Alex Mercer', headline: 'Senior Product Designer & Design Engineer', email: 'alex.mercer@example.com', phone: '+1 (555) 234-5678', location: 'San Francisco, CA', website: 'alexmercer.design', summary: 'Multi-disciplinary designer bridging design systems and frontend code.' },
    exp: [
      { id: uid(), role: 'Lead Product Designer', company: 'Horizon Labs', location: 'Remote', start: 'Mar 2022', end: 'Present', bullets: ['Designed and shipped 0-to-1 design system adopted by 14 product squads.', 'Increased canvas interaction speeds by 40% through atomic state optimizations.'] },
      { id: uid(), role: '[Previous role]', company: '[Previous company]', location: '[City]', start: '[MMM YYYY]', end: '[MMM YYYY]', bullets: ['[A shipped project and its measurable impact]'] },
    ],
    edu: [{ id: uid(), degree: 'BFA, Interaction Design', school: 'California College of the Arts', year: '2014 – 2018', detail: 'Graduated with honors' }],
    skills: ['Design systems', 'Figma', 'React', 'TypeScript', 'Prototyping', 'Accessibility'].map((v) => ({ id: uid(), v })),
    projects: [
      { id: uid(), name: 'Horizon Design System', link: 'alexmercer.design/horizon', desc: 'Token-based React component library; led design and build, now used by 14 product squads.', image: '' },
      { id: uid(), name: 'Flowboard', link: 'github.com/alexmercer/flowboard', desc: 'Open-source sprint whiteboard built with React and WebSockets; 2.3k GitHub stars.', image: '' },
    ],
  };
}

/* ---------- normalize: never let stored data break a layout ---------- */

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const str = (x: unknown, fallback = ''): string => (typeof x === 'string' ? x : typeof x === 'number' ? String(x) : fallback);

/** Copy only known string keys from `src` onto a fresh `base`. */
function strings<T extends object>(base: T, src: unknown): T {
  if (!isObj(src)) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const k of Object.keys(base)) if (k !== 'id' && k !== 'bullets' && k in src) out[k] = str(src[k], out[k] as string);
  return out as T;
}

export function normalize(r: unknown): Resume {
  const b = blank();
  if (!isObj(r)) return b;
  const m = isObj(r.meta) ? r.meta : {};

  const list = <K extends ListKey>(k: K): Resume[K] => {
    const src = r[k];
    if (!Array.isArray(src)) return b[k];
    const seen = new Set<string>();
    return src.map((it) => {
      const base = newItem(k);
      const out = strings(base, it) as ListItem<K>;
      // keep stored ids (stable keys for dnd) but never duplicate ones
      const id = isObj(it) ? str(it.id) : '';
      out.id = id && !seen.has(id) ? id : base.id;
      seen.add(out.id);
      if (k === 'projects') {
        const p = out as ProjectItem;
        if (!/^data:image\/(jpeg|png|webp|gif);base64,/.test(p.image)) p.image = '';
      }
      if (k === 'exp') {
        const bl = isObj(it) && Array.isArray(it.bullets) ? it.bullets.map((x) => str(x)) : [];
        (out as ExpItem).bullets = bl.length ? bl : [''];
      }
      return out;
    }) as Resume[K];
  };

  const layout = Math.trunc(Number(m.layout)) || 0;
  return {
    meta: {
      version: '1.0.0',
      layout: Math.max(0, Math.min(LAYOUTS.length - 1, layout)),
      theme: isThemeId(m.theme) ? m.theme : DEFAULT_THEME,
      paper: m.paper === 'Letter' ? 'Letter' : 'A4',
    },
    basics: strings(b.basics, r.basics),
    titles: strings(b.titles, r.titles),
    exp: list('exp'),
    edu: list('edu'),
    skills: list('skills'),
    projects: list('projects'),
  };
}

/* ---------- storage: localStorage, tolerant of being blocked or corrupt ---------- */

export const useSaveStatus = create<{ ok: boolean }>(() => ({ ok: true }));
const setSaveOk = (ok: boolean) => {
  if (useSaveStatus.getState().ok !== ok) useSaveStatus.setState({ ok });
};

/** Set while applying a change from another tab, so we don't echo it back. */
let applyingRemote = false;

const storage: PersistStorage<Resume> = {
  getItem: (name) => {
    try {
      const raw = window.localStorage.getItem(name);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      // accept the wireframe's raw format ({meta, basics, ...}) as well as zustand's {state, version}
      if (isObj(parsed) && 'state' in parsed) return parsed as unknown as StorageValue<Resume>;
      return { state: parsed as Resume, version: 1 };
    } catch {
      setSaveOk(false);
      return null;
    }
  },
  setItem: (name, value) => {
    if (applyingRemote) return;
    try {
      window.localStorage.setItem(name, JSON.stringify(value));
      setSaveOk(true);
    } catch {
      setSaveOk(false);
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

/* ---------- store ---------- */

interface Actions {
  setBasic: (k: keyof Basics, v: string) => void;
  setTitle: (k: keyof Titles, v: string) => void;
  setItemField: <K extends ListKey>(list: K, id: string, k: EditableField<K>, v: string) => void;
  addItem: (list: ListKey) => void;
  /** Insert a fresh item at `index`; returns its id. */
  insertItem: (list: ListKey, index: number) => string;
  removeItem: (list: ListKey, id: string) => void;
  moveItem: (list: ListKey, from: number, to: number) => void;
  setBullet: (expId: string, j: number, v: string) => void;
  insertBullet: (expId: string, at: number) => void;
  removeBullet: (expId: string, j: number) => void;
  addBullet: (expId: string) => void;
  setLayout: (i: number) => void;
  setTheme: (id: ThemeId) => void;
  setPaper: (p: Paper) => void;
  loadSample: () => void;
  clearAll: () => void;
}

export type ResumeStore = Resume & Actions;

const pickData = (s: Resume): Resume => ({
  meta: s.meta,
  basics: s.basics,
  titles: s.titles,
  exp: s.exp,
  edu: s.edu,
  skills: s.skills,
  projects: s.projects,
});

export const useResume = create<ResumeStore>()(
  persist(
    (set) => {
      const mapList = <K extends ListKey>(list: K, fn: (a: Resume[K]) => Resume[K]) =>
        set((s) => ({ [list]: fn(s[list]) }) as Partial<ResumeStore>);
      const mapExp = (expId: string, fn: (bullets: string[]) => string[]) =>
        set((s) => ({ exp: s.exp.map((e) => (e.id === expId ? { ...e, bullets: fn(e.bullets) } : e)) }));

      return {
        ...blank(),

        setBasic: (k, v) => set((s) => ({ basics: { ...s.basics, [k]: v } })),
        setTitle: (k, v) => set((s) => ({ titles: { ...s.titles, [k]: v } })),
        setItemField: (list, id, k, v) =>
          mapList(list, (a) => a.map((it) => (it.id === id ? { ...it, [k]: v } : it)) as typeof a),
        addItem: (list) => mapList(list, (a) => [...a, newItem(list)] as typeof a),
        insertItem: (list, index) => {
          const it = newItem(list);
          mapList(list, (a) => [...a.slice(0, index), it, ...a.slice(index)] as typeof a);
          return it.id;
        },
        removeItem: (list, id) => mapList(list, (a) => a.filter((it) => it.id !== id) as typeof a),
        moveItem: (list, from, to) =>
          mapList(list, (a) => {
            if (from === to || from < 0 || to < 0 || from >= a.length || to >= a.length) return a;
            const next = a.slice() as typeof a;
            const [it] = next.splice(from, 1);
            (next as ListItem<ListKey>[]).splice(to, 0, it);
            return next;
          }),

        setBullet: (expId, j, v) => mapExp(expId, (b) => b.map((x, i) => (i === j ? v : x))),
        insertBullet: (expId, at) => mapExp(expId, (b) => [...b.slice(0, at), '', ...b.slice(at)]),
        removeBullet: (expId, j) => mapExp(expId, (b) => (b.length > 1 ? b.filter((_, i) => i !== j) : b)),
        addBullet: (expId) => mapExp(expId, (b) => [...b, '']),

        setLayout: (i) =>
          set((s) => {
            const layout = Math.max(0, Math.min(LAYOUTS.length - 1, i));
            return layout === s.meta.layout ? s : { meta: { ...s.meta, layout } };
          }),
        setTheme: (theme) => set((s) => ({ meta: { ...s.meta, theme } })),
        setPaper: (paper) => set((s) => ({ meta: { ...s.meta, paper } })),

        loadSample: () => set(() => sample()),
        clearAll: () =>
          set(() => {
            const { meta: _drop, ...rest } = blank();
            return rest;
          }),
      };
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage,
      partialize: (s) => pickData(s),
      merge: (persisted, current) => ({ ...current, ...normalize(persisted) }),
    },
  ),
);

/** Read the plain data snapshot (no actions). */
export const getResume = (): Resume => pickData(useResume.getState());

/* Keep tabs in sync. The local tab keeps its own active layout. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const parsed: unknown = JSON.parse(e.newValue);
      const next = normalize(isObj(parsed) && 'state' in parsed ? parsed.state : parsed);
      next.meta.layout = useResume.getState().meta.layout;
      applyingRemote = true;
      useResume.setState(next);
    } catch {
      /* ignore malformed remote writes */
    } finally {
      applyingRemote = false;
    }
  });
}
