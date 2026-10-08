import { useEffect, type ReactNode } from 'react';
import { LAYOUTS, type LayoutPlaceholders } from '../data/layouts';
import { THEMES } from '../data/themes';
import { goTo } from '../lib/carousel';
import { bulletId, onBulletKey, onSkillKey, skillId } from '../lib/listKeys';
import { useResume } from '../store/resume';
import { useUi, type EditTab } from '../store/ui';
import { CloseIcon } from './icons';
import { AtsNote, PaperSeg, SampleClearButtons, ThemeDots, useActive } from './controls';

const TITLES = { edit: 'Edit content', layout: 'Layout & paper', theme: 'Theme' } as const;

/** Mobile bottom sheet. Scrolls internally; closes on the backdrop, ✕ or Escape. */
export function BottomSheet() {
  const sheet = useUi((s) => s.sheet);
  const setSheet = useUi((s) => s.setSheet);
  const close = () => setSheet(null);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet, setSheet]);

  if (!sheet) return null;
  const title = TITLES[sheet];

  return (
    <div className="noprint" style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <button type="button" onClick={close} aria-label="Close panel" style={{ position: 'absolute', inset: 0, border: 0, padding: 0, background: 'rgba(17,24,39,.4)' }} />
      <div role="dialog" aria-modal="true" aria-label={title} data-scope="sheet" style={{ position: 'relative', maxHeight: '82%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '18px 18px 0 0', boxShadow: '0 -10px 30px rgba(15,23,42,.18)' }}>
        <div style={{ flex: 'none', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <span style={{ width: 36, height: 4, borderRadius: 2, background: '#d1d5db' }} />
        </div>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 8px 16px' }}>
          <strong style={{ flex: 1, fontSize: 16 }}>{title}</strong>
          <button type="button" className="ib" onClick={close} aria-label="Close"><CloseIcon /></button>
        </div>
        {sheet === 'edit' && <EditSheet />}
        {sheet === 'layout' && <LayoutSheet onPicked={close} />}
        {sheet === 'theme' && <ThemeSheet />}
      </div>
    </div>
  );
}

/* ---------- Layout & paper ---------- */

function LayoutSheet({ onPicked }: { onPicked: () => void }) {
  const { layout } = useActive();
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="lbl">Paper</span>
        <PaperSeg big />
      </div>
      <AtsNote className="self-start" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
        {LAYOUTS.map((l, i) => (
          <button key={l.id} type="button" className="pill" style={{ width: '100%', whiteSpace: 'normal' }} aria-pressed={i === layout} onClick={() => { onPicked(); goTo(i); }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</span>
            <span style={{ fontSize: 11, color: '#4b5563' }}>{l.id} · {l.cat}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
        <SampleClearButtons tall />
      </div>
    </div>
  );
}

/* ---------- Theme ---------- */

function ThemeSheet() {
  const { cur, theme, rec } = useActive();
  const setTheme = useResume((s) => s.setTheme);
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12.5, color: '#4b5563' }}>★ recommended for {cur.cat} layouts</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
        {THEMES.map((t) => (
          <button key={t.id} type="button" className="sw" style={{ minHeight: 52 }} aria-pressed={t.id === theme.id} onClick={() => setTheme(t.id)}>
            <ThemeDots t={t} />
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <span>{t.name}</span>
              <span style={{ fontSize: 10.5, color: '#4b5563' }}>{t.cat}{rec(t) ? ' · ★' : ''}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Edit content ---------- */

const EDIT_TABS: [EditTab, string][] = [['profile', 'Profile'], ['exp', 'Experience'], ['edu', 'Education'], ['skills', 'Skills'], ['projects', 'Projects']];

function EditSheet() {
  const tab = useUi((s) => s.tab);
  const setTab = useUi((s) => s.setTab);
  const ph = useActive().cur.ph;
  return (
    <>
      <div className="hs" style={{ flex: 'none', padding: '0 16px 10px', borderBottom: '1px solid #e5e7eb' }}>
        <div className="seg big" role="group" aria-label="Section">
          {EDIT_TABS.map(([k, label]) => (
            <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'profile' && <ProfileForm ph={ph} />}
        {tab === 'exp' && <ExpForm ph={ph} />}
        {tab === 'edu' && <EduForm />}
        {tab === 'skills' && <SkillsForm ph={ph} />}
        {tab === 'projects' && <ProjectsForm />}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="fl">{label}{children}</label>;
}

function CardHead({ title, onUp, onDown, onRemove, removeLabel = 'Delete' }: { title: string; onUp?: () => void; onDown?: () => void; onRemove: () => void; removeLabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <strong style={{ flex: 1, fontSize: 13 }}>{title}</strong>
      {onUp && <button type="button" className="ib" onClick={onUp} aria-label="Move up">↑</button>}
      {onDown && <button type="button" className="ib" onClick={onDown} aria-label="Move down">↓</button>}
      <button type="button" className="ib" onClick={onRemove} aria-label={removeLabel}>×</button>
    </div>
  );
}

const num = (i: number) => String(i + 1).padStart(2, '0');

function ProfileForm({ ph }: { ph: LayoutPlaceholders }) {
  const b = useResume((s) => s.basics);
  const set = useResume((s) => s.setBasic);
  return (
    <>
      <Field label="Full name"><input className="fi" value={b.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
      <Field label="Headline"><input className="fi" value={b.headline} onChange={(e) => set('headline', e.target.value)} placeholder={ph.headline} /></Field>
      <Field label="Email"><input className="fi" type="email" value={b.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" autoComplete="email" /></Field>
      <Field label="Phone"><input className="fi" type="tel" value={b.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" autoComplete="tel" /></Field>
      <Field label="Location"><input className="fi" value={b.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" /></Field>
      <Field label="Website or profile"><input className="fi" type="url" value={b.website} onChange={(e) => set('website', e.target.value)} placeholder={ph.website} /></Field>
      <Field label="Summary"><textarea className="fi" value={b.summary} onChange={(e) => set('summary', e.target.value)} placeholder={ph.summary} /></Field>
    </>
  );
}

function ExpForm({ ph }: { ph: LayoutPlaceholders }) {
  const exp = useResume((s) => s.exp);
  const { setItemField, setBullet, addBullet, moveItem, removeItem, addItem } = useResume.getState();
  return (
    <>
      {exp.map((x, i) => {
        const set = (k: 'role' | 'company' | 'location' | 'start' | 'end') => (e: { target: { value: string } }) => setItemField('exp', x.id, k, e.target.value);
        return (
          <div key={x.id} className="fcard">
            <CardHead title={`Role ${num(i)}`} onUp={() => moveItem('exp', i, i - 1)} onDown={() => moveItem('exp', i, i + 1)} onRemove={() => removeItem('exp', x.id)} removeLabel="Delete role" />
            <Field label="Job title"><input className="fi" value={x.role} onChange={set('role')} placeholder={ph.role} /></Field>
            <Field label="Company"><input className="fi" value={x.company} onChange={set('company')} placeholder="Company name" /></Field>
            <Field label="Location"><input className="fi" value={x.location} onChange={set('location')} placeholder="City or Remote" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
              <Field label="Start"><input className="fi" value={x.start} onChange={set('start')} placeholder="MMM YYYY" /></Field>
              <Field label="End"><input className="fi" value={x.end} onChange={set('end')} placeholder="Present" /></Field>
            </div>
            <span className="fl" style={{ marginBottom: -2 }}>Achievements</span>
            {x.bullets.map((bl, j) => (
              <textarea key={j} className="fi sm" data-bid={bulletId(x.id, j)} aria-label="Achievement" value={bl} onChange={(e) => setBullet(x.id, j, e.target.value)} onKeyDown={(e) => onBulletKey(e, x.id, j)} placeholder={ph.bullet} />
            ))}
            <button type="button" className="btn tall" onClick={() => addBullet(x.id)}>+ Add achievement</button>
          </div>
        );
      })}
      <button type="button" className="btn btnp tall" onClick={() => addItem('exp')}>+ Add role</button>
    </>
  );
}

function EduForm() {
  const edu = useResume((s) => s.edu);
  const { setItemField, removeItem, addItem } = useResume.getState();
  return (
    <>
      {edu.map((x, i) => {
        const set = (k: 'degree' | 'school' | 'year' | 'detail') => (e: { target: { value: string } }) => setItemField('edu', x.id, k, e.target.value);
        return (
          <div key={x.id} className="fcard">
            <CardHead title={`Education ${num(i)}`} onRemove={() => removeItem('edu', x.id)} />
            <Field label="Degree"><input className="fi" value={x.degree} onChange={set('degree')} placeholder="e.g. MBA, Finance" /></Field>
            <Field label="School"><input className="fi" value={x.school} onChange={set('school')} placeholder="University" /></Field>
            <Field label="Years"><input className="fi" value={x.year} onChange={set('year')} placeholder="YYYY – YYYY" /></Field>
            <Field label="Details"><input className="fi" value={x.detail} onChange={set('detail')} placeholder="Honors, GPA or thesis (optional)" /></Field>
          </div>
        );
      })}
      <button type="button" className="btn btnp tall" onClick={() => addItem('edu')}>+ Add education</button>
    </>
  );
}

function SkillsForm({ ph }: { ph: LayoutPlaceholders }) {
  const skills = useResume((s) => s.skills);
  const { setItemField, removeItem, addItem } = useResume.getState();
  return (
    <>
      {skills.map((k, i) => (
        <div key={k.id} style={{ display: 'flex', gap: 8 }}>
          <input className="fi" data-sid={skillId(i)} aria-label="Skill" value={k.v} onChange={(e) => setItemField('skills', k.id, 'v', e.target.value)} onKeyDown={(e) => onSkillKey(e, i)} placeholder={ph.skill} />
          <button type="button" className="ib" onClick={() => removeItem('skills', k.id)} aria-label="Remove skill">×</button>
        </div>
      ))}
      <button type="button" className="btn btnp tall" onClick={() => addItem('skills')}>+ Add skill</button>
    </>
  );
}

function ProjectsForm() {
  const projects = useResume((s) => s.projects);
  const { setItemField, moveItem, removeItem, addItem } = useResume.getState();
  return (
    <>
      {projects.map((x, i) => {
        const set = (k: 'name' | 'link' | 'desc') => (e: { target: { value: string } }) => setItemField('projects', x.id, k, e.target.value);
        return (
          <div key={x.id} className="fcard">
            <CardHead title={`Project ${num(i)}`} onUp={() => moveItem('projects', i, i - 1)} onDown={() => moveItem('projects', i, i + 1)} onRemove={() => removeItem('projects', x.id)} />
            <Field label="Name"><input className="fi" value={x.name} onChange={set('name')} placeholder="Project or initiative name" /></Field>
            <Field label="Link"><input className="fi" value={x.link} onChange={set('link')} placeholder="yoursite.com/project" /></Field>
            <Field label="Description"><textarea className="fi sm" value={x.desc} onChange={set('desc')} placeholder="What it is, your role and the outcome" /></Field>
          </div>
        );
      })}
      <button type="button" className="btn btnp tall" onClick={() => addItem('projects')}>+ Add project</button>
    </>
  );
}
