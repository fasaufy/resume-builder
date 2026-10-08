import { Add, Basic, Bullets, EF, HANKEN, Items, P, PF, Sep, Skills, Title, XF } from './parts';

/** 30 / 70 row with a hard top rule; the oversized title sits in the 30% column. */
const ROW = 'side-row grid grid-cols-[30%_minmax(0,1fr)] items-start gap-6 border-t border-ink pt-[14px]';

/** L06 · 30 / 70 Swiss grid with oversized 30px section headers. */
export function L06SwissEditorial() {
  const big = { color: P };
  return (
    <div className="flex h-full flex-col gap-6 px-14 py-[60px] font-sans text-[12px] leading-[1.5] text-ink">
      {/* name first in reading order; the contact column is placed on the left by the grid */}
      <header className="grid grid-cols-[30%_minmax(0,1fr)] gap-6">
        <div className="col-start-2 row-start-1 flex min-w-0 flex-col gap-[6px]">
          <Basic k="fullName" style={{ fontFamily: HANKEN, fontSize: 50, fontWeight: 800, lineHeight: 1, letterSpacing: '-.035em' }} ph="Your Name" label="Full name" />
          <Basic k="headline" style={{ fontSize: 16, fontWeight: 500, color: P }} ph="e.g. Senior Product Designer" label="Headline" />
          <Basic k="summary" multiline rows={2} style={{ fontSize: 13, color: '#1e293b', marginTop: 4 }} ph="Design point of view: the problems you love and how you partner with product and engineering." label="Summary" />
        </div>
        <div className="geist col-start-1 row-start-1 flex flex-col pt-2 text-[10.5px] text-[#334155]">
          <Basic k="email" ph="you@email.com" label="Email" />
          <Basic k="phone" ph="+1 (555) 000-0000" label="Phone" />
          <Basic k="location" ph="City, Country" label="Location" />
          <Basic k="website" style={{ color: P }} ph="yourportfolio.com" label="Website" />
        </div>
      </header>

      <section className={ROW}>
        <Title k="exp" className="st06" style={big} ph="Title" />
        <div className="flex min-w-0 flex-col gap-[14px]">
          <Items list="exp">
            {(x) => (
              <>
                <div className="flex items-baseline text-[10px] uppercase tracking-[.08em] text-[#475569]">
                  <XF x={x} k="start" inline ph="YYYY" label="Start date" />
                  <Sep vals={[x.start, x.end, x.location]} i={0}>/</Sep>
                  <XF x={x} k="end" inline ph="Now" label="End date" />
                  <Sep vals={[x.start, x.end, x.location]} i={1} className="mx-1">·</Sep>
                  <XF x={x} k="location" inline ph="City" label="Location" />
                </div>
                <XF x={x} k="role" style={{ fontFamily: HANKEN, fontSize: 16, fontWeight: 700, lineHeight: 1.25 }} ph="e.g. Lead Product Designer" label="Job title" />
                <XF x={x} k="company" style={{ color: '#334155', fontWeight: 500 }} ph="Studio or company" label="Company" />
                <Bullets x={x} marker="—" className="mt-[3px]" ph="Redesigned a flow or system; show the effect on users or the business" />
              </>
            )}
          </Items>
          <Add list="exp">+ Add role</Add>
        </div>
      </section>

      <section className={ROW}>
        <Title k="projects" className="st06" style={big} ph="Title" />
        <div className="grid grid-cols-2 content-start gap-x-5 gap-y-3">
          <Items list="projects" grid>
            {(x) => (
              <>
                <PF x={x} k="name" style={{ fontWeight: 700 }} ph="Case study title" label="Name" />
                <PF x={x} k="link" className="geist" style={{ fontSize: 10, color: P }} ph="portfolio.com/case-study" label="Link" />
                <PF x={x} k="desc" multiline rows={2} style={{ color: '#334155' }} ph="Role, team and outcome" label="Description" />
              </>
            )}
          </Items>
          <Add list="projects">+ Add case study</Add>
        </div>
      </section>

      <section className={ROW}>
        <Title k="skills" className="st06" style={big} ph="Title" />
        <Skills chipStyle={{ border: '1px solid #0f172a' }} ph="e.g. Figma" />
      </section>

      <section className={ROW}>
        <Title k="edu" className="st06" style={big} ph="Title" />
        <div className="flex flex-col gap-3">
          <Items list="edu" moves={false} itemClassName="flex items-baseline gap-[10px]">
            {(x) => (
              <>
                <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. BFA Interaction Design" label="Degree" />
                <EF x={x} k="school" style={{ color: '#334155' }} ph="School" label="School" />
                <EF x={x} k="year" inline className="geist" style={{ flex: 'none', fontSize: 10, textAlign: 'right' }} ph="YYYY" label="Year" />
              </>
            )}
          </Items>
          <Add list="edu">+ Add education</Add>
        </div>
      </section>
    </div>
  );
}
