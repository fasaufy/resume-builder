import { Add, Basic, Bullets, EF, Items, P, PF, Sep, Skills, TINT, Title, XF } from './parts';

/** L04 · Dense 50 / 50 columns under a heavy-ruled header. */
export function L04CompactPro() {
  const sectionTitle = { color: P };
  return (
    <div className="flex h-full flex-col gap-[14px] px-11 py-10 font-sans text-[11.5px] leading-[1.38] text-ink">
      <header className="flex flex-col gap-[6px] pb-[10px]" style={{ borderBottom: `3px solid ${P}` }}>
        <div className="flex items-baseline gap-[14px]">
          <Basic k="fullName" style={{ flex: 1.2, fontSize: 26, fontWeight: 700, letterSpacing: '-.015em', lineHeight: 1.15 }} ph="Your Full Name" label="Full name" />
          <Basic k="headline" style={{ flex: 1, fontSize: 13, fontWeight: 600, color: P, textAlign: 'right' }} ph="e.g. Operations Manager" label="Headline" />
        </div>
        <div className="grid grid-cols-4 gap-2 text-[10.5px] text-[#334155]">
          <Basic k="email" ph="you@email.com" label="Email" />
          <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
          <Basic k="location" ph="City, Country" label="Location" />
          <Basic k="website" style={{ textAlign: 'right' }} ph="linkedin.com/in/yourname" label="Website" />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-[26px]">
        <section className="flex min-w-0 flex-col gap-[9px]">
          <Title k="exp" className="st04" style={sectionTitle} />
          <Items list="exp" itemClassName="border-b border-[#e2e8f0] pb-2">
            {(x) => (
              <>
                <XF x={x} k="role" style={{ fontWeight: 700, fontSize: 12 }} ph="e.g. Senior Project Manager" label="Job title" />
                <div className="flex items-baseline gap-[6px] text-[10.5px] text-[#334155]">
                  <XF x={x} k="company" style={{ fontWeight: 500 }} ph="Company or site" label="Company" />
                  <XF x={x} k="start" inline style={{ flex: 'none', textAlign: 'right' }} ph="MM/YY" label="Start date" />
                  <Sep vals={[x.start, x.end]} i={0}>–</Sep>
                  <XF x={x} k="end" inline style={{ flex: 'none' }} ph="Present" label="End date" />
                </div>
                <Bullets x={x} marker="•" className="mt-[2px]" ph="Cut cost, lead time or defects by a measurable amount" />
              </>
            )}
          </Items>
          <Add list="exp">+ Add role</Add>
        </section>

        <div className="flex min-w-0 flex-col gap-[14px]">
          <section className="flex flex-col gap-[6px]">
            <Title k="summary" className="st04" style={sectionTitle} />
            <Basic k="summary" multiline rows={3} ph="Operational strengths: sites, budgets and processes you have run." label="Summary" />
          </section>
          <section className="flex flex-col gap-[6px]">
            <Title k="skills" className="st04" style={sectionTitle} />
            <Skills chipStyle={{ background: TINT, borderRadius: 4 }} ph="e.g. Lean Six Sigma" />
          </section>
          <section className="flex flex-col gap-[6px]">
            <Title k="edu" className="st04" style={sectionTitle} />
            <Items list="edu">
              {(x) => (
                <>
                  <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. BS Industrial Engineering" label="Degree" />
                  <div className="flex gap-[6px] text-[10.5px] text-[#334155]">
                    <EF x={x} k="school" ph="University" label="School" />
                    <EF x={x} k="year" inline style={{ flex: 'none', textAlign: 'right' }} ph="YYYY" label="Year" />
                  </div>
                  <EF x={x} k="detail" style={{ fontSize: 10.5, color: '#334155' }} ph="Certifications, e.g. PMP, APICS CSCP" label="Details" />
                </>
              )}
            </Items>
            <Add list="edu">+ Add education</Add>
          </section>
          <section className="flex flex-col gap-[6px]">
            <Title k="projects" className="st04" style={sectionTitle} />
            <Items list="projects">
              {(x) => (
                <>
                  <div className="flex items-baseline gap-[6px]">
                    <PF x={x} k="name" style={{ fontWeight: 700 }} ph="Program or rollout" label="Name" />
                    <PF x={x} k="link" inline style={{ flex: 'none', fontSize: 10.5, textAlign: 'right', color: '#334155' }} ph="Scope, e.g. 12 sites" label="Scope" />
                  </div>
                  <PF x={x} k="desc" multiline style={{ fontSize: 10.5, color: '#334155' }} ph="Budget, timeline and outcome" label="Description" />
                </>
              )}
            </Items>
            <Add list="projects">+ Add program</Add>
          </section>
        </div>
      </div>
    </div>
  );
}
