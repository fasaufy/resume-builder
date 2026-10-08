import type { ReactNode } from 'react';
import type { Titles } from '../store/resume';
import { Add, Basic, Bullets, EF, Items, P, PF, SERIF, Skills, Title, XF } from './parts';

/** 118px italic serif label column + content, hairline between rows. */
function Row({ k, last, children }: { k: keyof Titles; last?: boolean; children: ReactNode }) {
  return (
    <section className={`side-row grid grid-cols-[118px_minmax(0,1fr)] items-start gap-[14px] ${last ? '' : 'border-b border-[#e2e8f0] pb-3'}`}>
      <Title k={k} className="st03" ph="Title" />
      {children}
    </section>
  );
}

/** L03 · Serif header, dense rows with a 118px label column. */
export function L03MinimalIvy() {
  return (
    <div className="flex h-full flex-col gap-[14px] px-16 py-14 font-sans text-[11.5px] leading-[1.42] text-ink">
      <header className="flex flex-col items-center gap-[2px] pb-3 text-center" style={{ borderBottom: `2px solid ${P}` }}>
        <Basic k="fullName" style={{ ...SERIF, fontSize: 36, lineHeight: 1.15, textAlign: 'center' }} ph="Your Full Name" label="Full name" />
        <Basic k="headline" style={{ ...SERIF, fontSize: 15, textAlign: 'center', color: P }} ph="e.g. Engagement Manager, Strategy Consulting" label="Headline" />
        <div className="mt-1 flex flex-wrap justify-center gap-x-2 gap-y-[2px] text-[11px] text-[#334155]">
          <Basic k="email" inline ph="you@email.com" label="Email" /><span aria-hidden="true">|</span>
          <Basic k="phone" inline ph="+1 (555) 000-0000" label="Phone" /><span aria-hidden="true">|</span>
          <Basic k="location" inline ph="City, Country" label="Location" /><span aria-hidden="true">|</span>
          <Basic k="website" inline ph="linkedin.com/in/yourname" label="Website" />
        </div>
      </header>

      <Row k="summary">
        <Basic k="summary" multiline rows={2} ph="Problem-solving profile: industries, functions and the client questions you answer best." label="Summary" />
      </Row>

      <Row k="edu">
        <div className="flex flex-col gap-2">
          <Items list="edu">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[10px]">
                  <EF x={x} k="school" style={{ fontWeight: 700 }} ph="University" label="School" />
                  <EF x={x} k="year" inline style={{ flex: 'none', textAlign: 'right' }} ph="YYYY – YYYY" label="Years" />
                </div>
                <div className="flex gap-[10px]">
                  <EF x={x} k="degree" style={{ fontStyle: 'italic' }} ph="e.g. PhD, Economics" label="Degree" />
                  <EF x={x} k="detail" style={{ textAlign: 'right', color: '#334155' }} ph="Dissertation, honors or GPA" label="Details" />
                </div>
              </>
            )}
          </Items>
          <Add list="edu">+ Add education</Add>
        </div>
      </Row>

      <Row k="exp">
        <div className="flex flex-col gap-[10px]">
          <Items list="exp">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[10px]">
                  <XF x={x} k="company" style={{ fontWeight: 700 }} ph="Firm and practice area" label="Company" />
                  <XF x={x} k="location" inline style={{ flex: 'none', textAlign: 'right' }} ph="City, Country" label="Location" />
                </div>
                <div className="flex items-baseline gap-[10px]">
                  <XF x={x} k="role" style={{ fontStyle: 'italic' }} ph="e.g. Senior Consultant" label="Job title" />
                  <div className="flex flex-none items-baseline">
                    <XF x={x} k="start" inline style={{ textAlign: 'right' }} ph="MMM YYYY" label="Start date" />
                    <span>–</span>
                    <XF x={x} k="end" inline ph="Present" label="End date" />
                  </div>
                </div>
                <Bullets x={x} marker="–" ph="Advised a client on a decision; state the value delivered" />
              </>
            )}
          </Items>
          <Add list="exp">+ Add role</Add>
        </div>
      </Row>

      <Row k="projects">
        <div className="flex flex-col gap-[6px]">
          <Items list="projects">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[6px]">
                  <PF x={x} k="name" style={{ fontWeight: 600 }} ph="Publication or research title" label="Title" />
                  <PF x={x} k="link" inline style={{ flex: 'none', fontStyle: 'italic', textAlign: 'right' }} ph="Journal or DOI" label="Venue" />
                </div>
                <PF x={x} k="desc" style={{ color: '#334155' }} ph="Co-authors, year and key finding" label="Description" />
              </>
            )}
          </Items>
          <Add list="projects">+ Add entry</Add>
        </div>
      </Row>

      <Row k="skills" last>
        <Skills chipStyle={{ border: '1px solid #cbd5e1' }} ph="e.g. Financial modeling" />
      </Row>
    </div>
  );
}
