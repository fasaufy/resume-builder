import type { ReactNode } from 'react';
import { Add, Basic, HANKEN, Bullets, EF, Items, P, PF, Skills, TINT, Title, XF } from './parts';

/** Mono "NN —" badge before a card heading. */
function CardHead({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bdg flex-none whitespace-nowrap">{n} —</span>
      {children}
    </div>
  );
}

/** L10 · 6-column modular card grid with numbered badges. */
export function L10AsymmetricNeo() {
  return (
    <div className="grid h-full auto-rows-min grid-cols-6 content-start gap-3 p-9 font-sans text-[11.5px] leading-[1.45] text-ink">
      <div className="card10 col-span-4 min-h-[150px] justify-end">
        <span className="bdg">00 — Index</span>
        <Basic k="fullName" style={{ fontFamily: HANKEN, fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: '-.035em' }} ph="Your Name" label="Full name" />
        <Basic k="headline" style={{ fontSize: 14, fontWeight: 600, color: P }} ph="e.g. Founder & Creative Director" label="Headline" />
      </div>

      <div className="card10 col-span-2" style={{ background: TINT, borderColor: 'transparent', borderTop: `4px solid ${P}` }}>
        <span className="bdg">01 — Contact</span>
        <div className="flex flex-col">
          <Basic k="email" ph="you@studio.com" label="Email" />
          <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
          <Basic k="location" ph="City, Country" label="Location" />
          <Basic k="website" style={{ fontWeight: 600 }} ph="yourstudio.com" label="Website" />
        </div>
      </div>

      <div className="card10 col-span-6">
        <CardHead n="02"><Title k="summary" className="bdg" /></CardHead>
        <Basic k="summary" multiline rows={2} style={{ fontFamily: HANKEN, fontSize: 17, fontWeight: 500, lineHeight: 1.3 }} ph="Your studio story: what you founded, who you serve and what you are known for." label="Summary" />
      </div>

      <div className="card10 col-span-4 !gap-3">
        <CardHead n="03"><Title k="exp" className="st10" /></CardHead>
        <Items list="exp" itemClassName="border-t border-dashed border-[#cbd5e1] pt-[10px]" ctlStyle={{ top: -1 }}>
          {(x) => (
            <>
              <div className="flex flex-wrap items-center gap-[6px]">
                <span className="chipw geist" style={{ background: TINT, fontSize: 9.5, borderRadius: 0 }}>
                  <XF x={x} k="start" inline ph="YYYY" label="Start date" />
                  <span>→</span>
                  <XF x={x} k="end" inline ph="Now" label="End date" />
                </span>
                <span className="chipw geist" style={{ border: '1px solid #cbd5e1', fontSize: 9.5, borderRadius: 0 }}>
                  <XF x={x} k="location" inline ph="City" label="Location" />
                </span>
              </div>
              <XF x={x} k="role" style={{ fontWeight: 700, fontSize: 13.5, marginTop: 4 }} ph="e.g. Founder" label="Job title" />
              <XF x={x} k="company" style={{ color: P, fontWeight: 600 }} ph="Studio or venture" label="Company" />
              <Bullets x={x} marker="·" className="mt-[2px]" ph="Grew a team, client list or revenue; give the number" />
            </>
          )}
        </Items>
        <Add list="exp">+ Add role</Add>
      </div>

      <div className="col-span-2 flex min-w-0 flex-col gap-3">
        <div className="card10">
          <CardHead n="04"><Title k="skills" className="st10" /></CardHead>
          <Skills chipStyle={{ background: TINT, borderRadius: 0 }} ph="e.g. Creative direction" />
        </div>
        <div className="card10">
          <CardHead n="05"><Title k="edu" className="st10" /></CardHead>
          <Items list="edu" moves={false} itemClassName="flex flex-col">
            {(x) => (
              <>
                <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. BA Design" label="Degree" />
                <EF x={x} k="school" ph="School" label="School" />
                <EF x={x} k="year" className="geist" style={{ fontSize: 10, color: '#475569' }} ph="YYYY" label="Year" />
                <EF x={x} k="detail" style={{ fontSize: 11, color: '#334155' }} ph="Awards, talks or press" label="Details" />
              </>
            )}
          </Items>
          <Add list="edu">+ Add education</Add>
        </div>
      </div>

      <div className="card10 col-span-6">
        <CardHead n="06"><Title k="projects" className="st10" /></CardHead>
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-[10px]">
          <Items list="projects" moves="horizontal">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[6px]">
                  <PF x={x} k="name" style={{ fontWeight: 700 }} ph="Client or venture" label="Name" />
                  <span className="chipw geist flex-none" style={{ border: '1px solid #cbd5e1', fontSize: 9.5, borderRadius: 0 }}>
                    <PF x={x} k="link" inline ph="link" label="Link" />
                  </span>
                </div>
                <PF x={x} k="desc" style={{ color: '#334155' }} ph="Scope and outcome" label="Description" />
              </>
            )}
          </Items>
        </div>
        <Add list="projects">+ Add project</Add>
      </div>
    </div>
  );
}
