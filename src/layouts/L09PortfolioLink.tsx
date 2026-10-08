import { useRef, useState } from 'react';
import { fileToThumb } from '../lib/image';
import { useResume, type ProjectItem } from '../store/resume';
import { Add, Basic, Bullets, EF, HANKEN, Items, P, PF, Sep, Skills, TINT, Title, XF } from './parts';

/** 16:9 project photo: click or drop an image to upload; hover to replace or remove. Empty ones don't print. */
function ProjectThumb({ x }: { x: ProjectItem }) {
  const set = useResume((s) => s.setItemField);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = async (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setBusy(true);
    setFailed(false);
    try {
      set('projects', x.id, 'image', await fileToThumb(file));
    } catch {
      setFailed(true); // e.g. a format the browser can't decode
    } finally {
      setBusy(false);
    }
  };

  const has = !!x.image;
  const label = busy ? 'Loading…' : failed ? 'Couldn’t read that image, try another' : has ? 'Replace photo' : '+ Upload photo';
  return (
    <div
      className={`thumb aspect-video ${has ? 'has-img' : 'is-empty'}`}
      style={{ background: TINT }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        load(e.dataTransfer.files[0]);
      }}
    >
      {has && <img src={x.image} alt={x.name ? `${x.name} thumbnail` : 'Project thumbnail'} />}
      <button type="button" className="thumb-btn geist noprint" onClick={() => input.current?.click()} aria-label={has ? 'Replace project photo' : 'Upload project photo'}>
        {label}
      </button>
      {has && (
        <button type="button" className="thumb-remove noprint" onClick={() => set('projects', x.id, 'image', '')} aria-label="Remove project photo">×</button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          load(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/** L09 · Project cards first, link chips, experience after. */
export function L09PortfolioLink() {
  const b = useResume((s) => s.basics);
  return (
    <div className="flex h-full flex-col gap-5 px-[52px] py-12 font-sans text-[12px] leading-[1.5] text-ink">
      <header className="flex items-end justify-between gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <Basic k="fullName" style={{ fontFamily: HANKEN, fontSize: 36, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-.03em' }} ph="Your Name" label="Full name" />
          <Basic k="headline" style={{ fontSize: 14, fontWeight: 500, color: '#334155' }} ph="e.g. Design Engineer" label="Headline" />
        </div>
        <div className="flex flex-col items-end gap-[3px] text-[11px] text-[#334155]">
          <span className="chipw geist" style={{ background: P, color: '#fff', fontSize: 11, padding: '2px 10px' }}>
            <Basic k="website" inline ph="yoursite.dev" label="Website" />
          </span>
          <Basic k="email" inline style={{ textAlign: 'right' }} ph="you@email.com" label="Email" />
          <div className="flex">
            <Basic k="phone" inline style={{ textAlign: 'right' }} ph="+1 (555) 000-0000" label="Phone" />
            <Sep vals={[b.phone, b.location]} i={0}>·</Sep>
            <Basic k="location" inline ph="City" label="Location" />
          </div>
        </div>
      </header>
      <Basic k="summary" multiline rows={2} style={{ fontSize: 13, color: '#1e293b' }} ph="What you build where design meets code: tools, stack and craft." label="Summary" />

      <section className="flex flex-col gap-[10px]">
        <Title k="projects" className="st02" />
        <div className="grid grid-cols-2 gap-3">
          <Items list="projects" moves="horizontal" itemClassName="flex flex-col gap-[6px] rounded-[10px] border border-[#e2e8f0] px-[14px] py-3" itemStyle={{ background: '#fff' }} ctlStyle={{ top: -11, right: 8 }}>
            {(x) => (
              <>
                <ProjectThumb x={x} />
                <PF x={x} k="name" style={{ fontSize: 14, fontWeight: 700 }} ph="Project name" label="Project name" />
                <span className="chipw geist self-start" style={{ background: TINT, color: '#0f172a', fontSize: 10 }}>
                  <span aria-hidden="true">↗</span>
                  <PF x={x} k="link" inline ph="yoursite.dev/project" label="Live link" />
                </span>
                <PF x={x} k="desc" multiline rows={2} style={{ color: '#334155' }} ph="What it does, your role and the stack" label="Description" />
              </>
            )}
          </Items>
        </div>
        <Add list="projects">+ Add project</Add>
      </section>

      <section className="flex flex-col gap-2">
        <Title k="skills" className="st02" />
        <Skills chipClass="geist" chipStyle={{ border: `1px solid ${P}`, borderRadius: 4 }} ph="e.g. React" />
      </section>

      <section className="flex flex-col gap-[10px]">
        <Title k="exp" className="st02" />
        <Items list="exp">
          {(x) => (
            <>
              <div className="flex items-baseline gap-[6px]">
                <XF x={x} k="role" inline style={{ flex: 'none', maxWidth: '55%', fontWeight: 700, fontSize: 13, minWidth: '12ch' }} ph="e.g. Frontend Engineer" label="Job title" />
                <Sep vals={[x.role, x.company]} i={0} className="text-[#475569]">@</Sep>
                <XF x={x} k="company" style={{ fontWeight: 500 }} ph="Company" label="Company" />
                <div className="geist flex flex-none text-[10px] text-[#475569]">
                  <XF x={x} k="start" inline style={{ textAlign: 'right' }} ph="YYYY" label="Start date" />
                  <Sep vals={[x.start, x.end]} i={0}>–</Sep>
                  <XF x={x} k="end" inline ph="Now" label="End date" />
                </div>
              </div>
              <Bullets x={x} marker="•" ph="Built a component, tool or experience; cite adoption or performance" />
            </>
          )}
        </Items>
        <Add list="exp">+ Add role</Add>
      </section>

      <section className="flex flex-col gap-[6px]">
        <Title k="edu" className="st02" />
        <Items list="edu" moves={false} itemClassName="flex items-baseline gap-2">
          {(x) => (
            <>
              <EF x={x} k="degree" style={{ fontWeight: 600 }} ph="e.g. BS Computer Science" label="Degree" />
              <EF x={x} k="school" style={{ color: '#334155' }} ph="University" label="School" />
              <EF x={x} k="year" inline className="geist" style={{ flex: 'none', fontSize: 10, textAlign: 'right' }} ph="YYYY" label="Year" />
            </>
          )}
        </Items>
        <Add list="edu">+ Add education</Add>
      </section>
    </div>
  );
}
