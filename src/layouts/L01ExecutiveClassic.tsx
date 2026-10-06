import type { CSSProperties } from 'react';
import { Add, Basic, Bullets, EF, Items, P, PF, SERIF, Skills, TINT, Title, XF } from './parts';

/** L01 · Single column, centered serif header, ruled section titles. */
export function L01ExecutiveClassic() {
  const rule: CSSProperties = { borderBottom: `1px solid ${P}`, paddingBottom: 3 };
  return (
    <div className="flex h-full flex-col gap-[18px] px-[68px] py-[60px] font-sans text-[12.5px] leading-[1.5] text-ink">
      <header className="flex flex-col items-center gap-[3px] text-center">
        <Basic k="fullName" style={{ ...SERIF, fontSize: 32, lineHeight: 1.2, textAlign: 'center', color: P }} ph="Your Full Name" label="Full name" />
        <Basic k="headline" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', textAlign: 'center', color: '#334155' }} ph="Title, e.g. Chief Operating Officer" label="Headline" />
        <div className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-[2px] text-[11.5px] text-[#334155]">
          <Basic k="email" inline ph="you@email.com" label="Email" /><span aria-hidden="true">·</span>
          <Basic k="phone" inline ph="+1 (555) 000-0000" label="Phone" /><span aria-hidden="true">·</span>
          <Basic k="location" inline ph="City, Country" label="Location" /><span aria-hidden="true">·</span>
          <Basic k="website" inline ph="linkedin.com/in/yourname" label="Website" />
        </div>
      </header>

      <section className="flex flex-col gap-[6px]">
        <div style={rule}><Title k="summary" className="st01" /></div>
        <Basic k="summary" multiline rows={2} ph="Executive summary: years in leadership, sectors served and the scale you have owned (P&L, deal value, team size)." label="Summary" />
      </section>

      <section className="flex flex-col gap-3">
        <div style={rule}><Title k="exp" className="st01" /></div>
        <Items list="exp">
          {(x) => (
            <>
              <div className="flex items-baseline gap-3">
                <XF x={x} k="role" style={{ fontWeight: 700, fontSize: 13 }} ph="Title, e.g. Managing Director, Investment Banking" label="Job title" />
                <div className="flex flex-none items-baseline text-[11.5px] text-[#334155]">
                  <XF x={x} k="start" inline style={{ textAlign: 'right' }} ph="MMM YYYY" label="Start date" />
                  <span>–</span>
                  <XF x={x} k="end" inline ph="Present" label="End date" />
                </div>
              </div>
              <div className="flex gap-3 italic text-[#334155]">
                <XF x={x} k="company" ph="Firm or company" label="Company" />
                <XF x={x} k="location" style={{ flex: 'none', width: '32%', textAlign: 'right' }} ph="City, Country" label="Location" />
              </div>
              <Bullets x={x} marker="•" className="mt-[3px] gap-px" ph="Led a deal, program or turnaround; quantify the outcome ($, %, team size)" />
            </>
          )}
        </Items>
        <Add list="exp">+ Add role</Add>
      </section>

      <section className="flex flex-col gap-[10px]">
        <div style={rule}><Title k="edu" className="st01" /></div>
        <Items list="edu">
          {(x) => (
            <>
              <div className="flex items-baseline gap-3">
                <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="Degree, e.g. JD or MBA" label="Degree" />
                <EF x={x} k="year" inline style={{ flex: 'none', textAlign: 'right', fontSize: 11.5 }} ph="YYYY – YYYY" label="Years" />
              </div>
              <div className="flex gap-3 text-[#334155]">
                <EF x={x} k="school" style={{ fontStyle: 'italic' }} ph="University or law school" label="School" />
                <EF x={x} k="detail" style={{ textAlign: 'right' }} ph="Honors or bar admission" label="Details" />
              </div>
            </>
          )}
        </Items>
        <Add list="edu">+ Add education</Add>
      </section>

      <section className="flex flex-col gap-2">
        <div style={rule}><Title k="skills" className="st01" /></div>
        <Skills chipStyle={{ background: TINT }} ph="e.g. M&A strategy" label="Competency" />
      </section>

      <section className="flex flex-col gap-2">
        <div style={rule}><Title k="projects" className="st01" /></div>
        <Items list="projects" itemClassName="flex items-baseline gap-[10px]">
          {(x) => (
            <>
              <PF x={x} k="name" style={{ flex: 'none', width: '34%', fontWeight: 700 }} ph="Board seat or initiative" label="Name" />
              <PF x={x} k="desc" ph="One line on your role and the result" label="Description" />
              <PF x={x} k="link" inline style={{ flex: 'none', textAlign: 'right', color: '#334155' }} ph="Organization" label="Organization or link" />
            </>
          )}
        </Items>
        <Add list="projects">+ Add entry</Add>
      </section>
    </div>
  );
}
