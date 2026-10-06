import { Add, Basic, HANKEN, Bullets, EF, Items, P, PF, Skills, TINT, Title, XF } from './parts';

/** Section with the 3px ink top rule. */
const RULED = 'flex flex-col gap-2 border-t-[3px] border-ink pt-[10px]';

/** L08 · Huge name, 8px color bar, hero statement, roles in two columns. */
export function L08TypographicBold() {
  return (
    <div className="flex h-full flex-col gap-[18px] px-14 py-[52px] font-sans text-[12px] leading-[1.5] text-ink">
      <header className="flex flex-col gap-[6px]">
        <Basic k="fullName" style={{ fontFamily: HANKEN, fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: '-.04em' }} ph="Your Name" label="Full name" />
        <div className="flex flex-wrap items-baseline gap-x-[10px] gap-y-[2px]">
          <Basic k="headline" inline style={{ fontSize: 14, fontWeight: 600, color: P, minWidth: '14ch' }} ph="e.g. Senior Copywriter" label="Headline" />
          <span className="geist flex flex-wrap gap-x-2 gap-y-[2px] text-[10.5px] text-[#334155]">
            <Basic k="email" inline ph="you@email.com" label="Email" />
            <Basic k="phone" inline ph="+1 (555) 000-0000" label="Phone" />
            <Basic k="location" inline ph="City, Country" label="Location" />
            <Basic k="website" inline ph="yourwriting.com" label="Website" />
          </span>
        </div>
      </header>
      <div className="h-2" style={{ background: P }} />
      <Basic k="summary" multiline rows={2} style={{ fontFamily: HANKEN, fontSize: 24, fontWeight: 500, lineHeight: 1.22, letterSpacing: '-.015em' }} ph="Write a one-line manifesto: what you make, for whom, and why it matters." label="Hero statement" />

      <section className={`${RULED} !gap-[10px]`}>
        <Title k="exp" className="st08" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-[14px]">
          <Items list="exp" grid>
            {(x) => (
              <>
                <XF x={x} k="role" style={{ fontFamily: HANKEN, fontSize: 17, fontWeight: 700, lineHeight: 1.2 }} ph="e.g. Copy Lead" label="Job title" />
                <XF x={x} k="company" style={{ fontWeight: 600, color: P }} ph="Agency, publication or brand" label="Company" />
                <div className="geist flex items-baseline text-[10px] text-[#475569]">
                  <XF x={x} k="start" inline ph="YYYY" label="Start date" />
                  <span>—</span>
                  <XF x={x} k="end" inline ph="Now" label="End date" />
                  <span className="mx-1">/</span>
                  <XF x={x} k="location" inline ph="City" label="Location" />
                </div>
                <Bullets x={x} marker="+" className="mt-[3px]" ph="Wrote a line, campaign or story; note reach or award" />
              </>
            )}
          </Items>
        </div>
        <Add list="exp">+ Add role</Add>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section className={RULED}>
          <Title k="projects" className="st08" />
          <Items list="projects">
            {(x) => (
              <>
                <PF x={x} k="name" style={{ fontWeight: 700 }} ph="Campaign, article or book" label="Name" />
                <div className="flex gap-[6px] text-[#334155]">
                  <PF x={x} k="desc" ph="Your role and where it ran" label="Description" />
                  <PF x={x} k="link" inline className="geist" style={{ flex: 'none', fontSize: 10, textAlign: 'right' }} ph="Publication" label="Publication or link" />
                </div>
              </>
            )}
          </Items>
          <Add list="projects">+ Add work</Add>
        </section>
        <div className="flex flex-col gap-4">
          <section className={RULED}>
            <Title k="skills" className="st08" />
            <Skills chipStyle={{ background: TINT }} ph="e.g. Long-form editing" />
          </section>
          <section className={RULED}>
            <Title k="edu" className="st08" />
            <Items list="edu" moves={false}>
              {(x) => (
                <>
                  <EF x={x} k="degree" style={{ fontWeight: 700 }} ph="e.g. MFA Creative Writing" label="Degree" />
                  <div className="flex gap-[6px] text-[#334155]">
                    <EF x={x} k="school" ph="University" label="School" />
                    <EF x={x} k="year" inline style={{ flex: 'none', textAlign: 'right' }} ph="YYYY" label="Year" />
                  </div>
                </>
              )}
            </Items>
            <Add list="edu">+ Add education</Add>
          </section>
        </div>
      </div>
    </div>
  );
}
