import { Add, Basic, Bullets, EF, Items, P, PF, Skills, TINT, Title, XF } from './parts';

const Square = () => <span className="size-2 flex-none" style={{ background: P }} />;

/** L02 · 65 / 35 split with a tinted right sidebar, small caps section labels. */
export function L02TechnicalModern() {
  return (
    // Reading order for ATS: name, headline, summary, contact, experience, projects, skills, education.
    // The grid keeps the look: 65 / 35 with a full-height tinted sidebar drawn by the background.
    <div className="grid h-full grid-cols-[65fr_35fr] grid-rows-[auto_1fr] font-sans text-[12px] leading-[1.5] text-ink" style={{ background: `linear-gradient(90deg, transparent 65%, ${TINT} 65%)` }}>
      <header className="col-start-1 row-start-1 flex min-w-0 flex-col gap-1 pt-[52px] pr-8 pl-[52px]">
        <Basic k="fullName" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.15 }} ph="Your Full Name" label="Full name" />
        <Basic k="headline" style={{ fontSize: 14, fontWeight: 500, color: P }} ph="e.g. Senior Software Engineer, Platform" label="Headline" />
        <Basic k="summary" multiline rows={2} style={{ marginTop: 6, color: '#1e293b' }} ph="Engineering focus: languages, systems you build and the scale they run at." label="Summary" />
      </header>

      <section className="col-start-2 row-start-1 flex min-w-0 flex-col gap-1 px-7 pt-[52px] text-[11.5px]">
        <div className="st02 mb-1 px-[3px]">Contact</div>
        <Basic k="email" ph="you@email.com" label="Email" />
        <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
        <Basic k="location" ph="City, Country" label="Location" />
        <Basic k="website" className="geist" style={{ fontSize: 10.5 }} ph="github.com/yourname" label="Website" />
      </section>

      <div className="col-start-1 row-start-2 flex min-w-0 flex-col gap-5 pt-5 pr-8 pb-12 pl-[52px]">
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2"><Square /><Title k="exp" className="st02" /></div>
          <Items list="exp">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[10px]">
                  <XF x={x} k="role" style={{ fontWeight: 600, fontSize: 13 }} ph="e.g. Staff Software Engineer" label="Job title" />
                  <div className="geist flex flex-none items-baseline text-[10.5px] text-[#475569]">
                    <XF x={x} k="start" inline style={{ textAlign: 'right' }} ph="YYYY-MM" label="Start date" />
                    <span>→</span>
                    <XF x={x} k="end" inline ph="Present" label="End date" />
                  </div>
                </div>
                <div className="flex gap-[6px] text-[#334155]">
                  <XF x={x} k="company" style={{ fontWeight: 500 }} ph="Company" label="Company" />
                  <XF x={x} k="location" style={{ flex: 'none', width: '30%', textAlign: 'right' }} ph="Remote / City" label="Location" />
                </div>
                <Bullets x={x} marker="▸" markerStyle={{ color: P }} className="mt-[3px] gap-px" ph="Built or scaled a system; cite latency, uptime or cost impact" />
              </>
            )}
          </Items>
          <Add list="exp">+ Add role</Add>
        </section>

        <section className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-2"><Square /><Title k="projects" className="st02" /></div>
          <Items list="projects">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[10px]">
                  <PF x={x} k="name" style={{ fontWeight: 600 }} ph="Project or open-source repo" label="Project name" />
                  <PF x={x} k="link" inline className="geist" style={{ flex: 'none', fontSize: 10.5, color: P, textAlign: 'right' }} ph="github.com/you/repo" label="Link" />
                </div>
                <PF x={x} k="desc" multiline style={{ color: '#334155' }} ph="Stack, what it does and one usage number" label="Description" />
              </>
            )}
          </Items>
          <Add list="projects">+ Add project</Add>
        </section>
      </div>

      <div className="col-start-2 row-start-2 flex min-w-0 flex-col gap-[22px] px-7 pt-[22px] pb-12">
        <section className="flex flex-col gap-2">
          <Title k="skills" className="st02" />
          <Skills chipClass="geist" chipStyle={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4 }} ph="e.g. TypeScript" />
        </section>
        <section className="flex flex-col gap-[10px]">
          <Title k="edu" className="st02" />
          <Items list="edu" moves={false} itemClassName="flex flex-col">
            {(x) => (
              <>
                <EF x={x} k="degree" style={{ fontWeight: 600 }} ph="e.g. BSc Computer Science" label="Degree" />
                <EF x={x} k="school" ph="University" label="School" />
                <EF x={x} k="year" className="geist" style={{ fontSize: 10.5, color: '#475569' }} ph="YYYY – YYYY" label="Years" />
                <EF x={x} k="detail" style={{ fontSize: 11, color: '#334155' }} ph="Relevant coursework or thesis" label="Details" />
              </>
            )}
          </Items>
          <Add list="edu">+ Add education</Add>
        </section>
      </div>
    </div>
  );
}
