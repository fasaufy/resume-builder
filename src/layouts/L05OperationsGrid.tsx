import type { CSSProperties } from 'react';
import { Add, Basic, Bullets, EF, Items, P, PF, Skills, TINT, Title, UI, XF } from './parts';

/** 25% gutter + content grid used by every row of this layout. */
const GUTTER = 'grid grid-cols-[25%_minmax(0,1fr)] items-start gap-5';
const rail: CSSProperties = { borderLeft: '2px solid #cbd5e1', paddingLeft: 18 };
/* Timeline dot drawn in normal flow (negative margins pull it onto the rail without taking space).
   Not position:absolute on purpose: positioned boxes are painted, and so written to the PDF, after all
   other content, which made ATS parsers read every date before any role. */
const node: CSSProperties = { display: 'block', width: 10, height: 10, borderRadius: '50%', margin: '4px 0 -14px -24px' };

/** L05 · 25% date gutter with a timeline rail for roles and education. */
export function L05OperationsGrid() {
  const sectionTitle = { color: P };
  return (
    <div className="flex h-full flex-col gap-[18px] px-14 py-[52px] font-sans text-[12px] leading-[1.45] text-ink">
      <header className="grid grid-cols-[minmax(0,1fr)_190px] items-end gap-6 border-b border-[#cbd5e1] pb-4">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <Basic k="fullName" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.15 }} ph="Your Full Name" label="Full name" />
          <Basic k="headline" style={{ fontSize: 14, fontWeight: 500, color: P }} ph="e.g. Senior Product Manager" label="Headline" />
        </div>
        <div className="flex flex-col text-right text-[11px] text-[#334155]">
          <Basic k="email" ph="you@email.com" label="Email" />
          <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
          <Basic k="location" ph="City, Country" label="Location" />
          <Basic k="website" ph="linkedin.com/in/yourname" label="Website" />
        </div>
      </header>

      <section className="side-row grid grid-cols-[25%_minmax(0,1fr)] items-start gap-x-5">
        <Title k="summary" className="st04" style={sectionTitle} />
        <Basic k="summary" multiline rows={2} ph="Product focus: domains, users and the metrics you move." label="Summary" />
      </section>

      <section className="flex flex-col">
        <div className={`${GUTTER} mb-2`}><Title k="exp" className="st04" style={sectionTitle} /><span /></div>
        <Items list="exp" itemClassName={GUTTER}>
          {(x) => (
            <>
              <div className="geist flex flex-col pt-[2px] text-[10.5px] text-[#475569]">
                <XF x={x} k="start" ph="MMM YYYY" label="Start date" />
                <XF x={x} k="end" ph="Present" label="End date" />
                <XF x={x} k="location" style={{ fontFamily: UI, fontSize: 11 }} ph="City / Remote" label="Location" />
              </div>
              <div style={{ ...rail, paddingBottom: 14 }}>
                <span style={{ ...node, background: P, boxShadow: '0 0 0 3px #fff' }} />
                <XF x={x} k="role" style={{ fontWeight: 700, fontSize: 13 }} ph="e.g. Product Manager, Growth" label="Job title" />
                <XF x={x} k="company" style={{ color: '#334155', fontWeight: 500 }} ph="Company and product area" label="Company" />
                <Bullets x={x} marker="•" className="mt-[3px]" ph="Shipped a feature or launch; name the metric and the lift" />
              </div>
            </>
          )}
        </Items>
        <div className={GUTTER}><span /><Add list="exp" style={{ margin: 0 }}>+ Add role</Add></div>
      </section>

      <section className="flex flex-col">
        <div className={`${GUTTER} mb-2`}><Title k="edu" className="st04" style={sectionTitle} /><span /></div>
        <Items list="edu" itemClassName={GUTTER}>
          {(x) => (
            <>
              <EF x={x} k="year" className="geist" style={{ fontSize: 10.5, color: '#475569' }} ph="YYYY – YYYY" label="Years" />
              <div style={{ ...rail, paddingBottom: 12 }}>
                <span style={{ ...node, background: '#fff', border: `2px solid ${P}` }} />
                <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. MBA, Technology Management" label="Degree" />
                <div className="flex gap-2 text-[#334155]">
                  <EF x={x} k="school" ph="University" label="School" />
                  <EF x={x} k="detail" style={{ textAlign: 'right' }} ph="Concentration or awards" label="Details" />
                </div>
              </div>
            </>
          )}
        </Items>
        <div className={GUTTER}><span /><Add list="edu" style={{ margin: 0 }}>+ Add education</Add></div>
      </section>

      <section className="side-row grid grid-cols-[25%_minmax(0,1fr)] items-start gap-x-5">
        <Title k="skills" className="st04" style={sectionTitle} />
        <Skills chipStyle={{ background: TINT, borderRadius: 4 }} ph="e.g. SQL" />
      </section>

      <section className="side-row grid grid-cols-[25%_minmax(0,1fr)] items-start gap-x-5">
        <Title k="projects" className="st04" style={sectionTitle} />
        <div className="flex flex-col gap-[6px]">
          <Items list="projects">
            {(x) => (
              <>
                <div className="flex items-baseline gap-2">
                  <PF x={x} k="name" style={{ fontWeight: 600 }} ph="Launch or analysis name" label="Name" />
                  <PF x={x} k="link" inline style={{ flex: 'none', fontSize: 11, color: P, textAlign: 'right' }} ph="Link to case study" label="Link" />
                </div>
                <PF x={x} k="desc" style={{ color: '#334155' }} ph="Problem, your approach and the result" label="Description" />
              </>
            )}
          </Items>
          <Add list="projects">+ Add project</Add>
        </div>
      </section>
    </div>
  );
}
