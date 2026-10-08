import { Add, Basic, HANKEN, Bullets, EF, Items, P, PF, Skills, TINT, Title, XF } from './parts';

/** L07 · Tinted 33% sidebar with a color mark, generous main column. */
export function L07StudioSplit() {
  const label = { color: '#334155' };
  const sectionTitle = { color: P };
  return (
    <div className="grid h-full grid-cols-[33%_minmax(0,1fr)] font-sans text-[12px] leading-[1.5] text-ink">
      <aside className="flex min-w-0 flex-col gap-6 px-[26px] py-12" style={{ background: TINT }}>
        <div className="flex flex-col gap-[6px]">
          <span aria-hidden="true" className="mb-[6px] ml-[3px] size-14 rounded-full" style={{ background: P }} />
          <Basic k="fullName" multiline rows={2} style={{ fontFamily: HANKEN, fontSize: 28, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-.03em' }} ph="Your Name" label="Full name" />
          <Basic k="headline" multiline style={{ fontSize: 13, fontWeight: 600 }} ph="e.g. Brand Strategist" label="Headline" />
        </div>
        <section className="flex flex-col gap-[2px] text-[11.5px]">
          <div className="bdg mb-1 px-[3px]" style={label}>Contact</div>
          <Basic k="email" ph="you@email.com" label="Email" />
          <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
          <Basic k="location" ph="City, Country" label="Location" />
          <Basic k="website" style={{ fontWeight: 600 }} ph="yourstudio.com" label="Website" />
        </section>
        <section className="flex flex-col gap-[6px]">
          <Title k="skills" className="bdg" style={label} />
          <Skills chipStyle={{ background: '#fff' }} ph="e.g. Brand positioning" />
        </section>
        <section className="flex flex-col gap-2">
          <Title k="edu" className="bdg" style={label} />
          <Items list="edu" moves={false} itemClassName="flex flex-col">
            {(x) => (
              <>
                <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. BA Communications" label="Degree" />
                <EF x={x} k="school" ph="University" label="School" />
                <EF x={x} k="year" style={{ fontSize: 11, color: '#334155' }} ph="YYYY – YYYY" label="Years" />
              </>
            )}
          </Items>
          <Add list="edu">+ Add education</Add>
        </section>
      </aside>

      <div className="flex min-w-0 flex-col gap-[22px] px-10 py-12">
        <section className="flex flex-col gap-[6px]">
          <Title k="summary" className="st07" style={sectionTitle} />
          <Basic k="summary" multiline rows={3} style={{ fontSize: 13 }} ph="What brands hire you for: positioning, campaigns and the audiences you know best." label="Summary" />
        </section>
        <section className="flex flex-col gap-[14px]">
          <Title k="exp" className="st07" style={sectionTitle} />
          <Items list="exp">
            {(x) => (
              <>
                <div className="flex items-baseline gap-[10px]">
                  <XF x={x} k="role" style={{ fontWeight: 700, fontSize: 13.5 }} ph="e.g. Creative Producer" label="Job title" />
                  <div className="flex flex-none items-baseline text-[11px] text-[#475569]">
                    <XF x={x} k="start" inline style={{ textAlign: 'right' }} ph="YYYY" label="Start date" />
                    <span>–</span>
                    <XF x={x} k="end" inline ph="Now" label="End date" />
                  </div>
                </div>
                <div className="flex gap-2 text-[#334155]">
                  <XF x={x} k="company" style={{ fontWeight: 500 }} ph="Agency or brand" label="Company" />
                  <XF x={x} k="location" style={{ flex: 'none', width: '30%', textAlign: 'right' }} ph="City" label="Location" />
                </div>
                <Bullets x={x} className="mt-[3px]" marker="•" markerStyle={{ color: P }} ph="Shaped a campaign or rebrand; cite reach, awareness or awards" />
              </>
            )}
          </Items>
          <Add list="exp">+ Add role</Add>
        </section>
        <section className="flex flex-col gap-[10px]">
          <Title k="projects" className="st07" style={sectionTitle} />
          <Items list="projects">
            {(x) => (
              <>
                <div className="flex items-baseline gap-2">
                  <PF x={x} k="name" style={{ fontWeight: 700 }} ph="Campaign or brand name" label="Name" />
                  <PF x={x} k="link" inline style={{ flex: 'none', fontSize: 11, color: P, fontWeight: 600, textAlign: 'right' }} ph="Link to work" label="Link" />
                </div>
                <PF x={x} k="desc" style={{ color: '#334155' }} ph="Brief, idea and result" label="Description" />
              </>
            )}
          </Items>
          <Add list="projects">+ Add work</Add>
        </section>
      </div>
    </div>
  );
}
