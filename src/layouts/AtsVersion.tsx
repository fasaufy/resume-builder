import type { CSSProperties, ReactNode } from 'react';
import { useResume } from '../store/resume';
import type { LayoutProps } from './types';
import { HANKEN, P, SERIF } from './parts';

/** Display face of the chosen design, so the ATS version still feels like the same resume. */
function nameFont(id: string): CSSProperties {
  if (id === 'L01' || id === 'L03') return SERIF;
  if (['L06', 'L07', 'L08', 'L09', 'L10'].includes(id)) return { fontFamily: HANKEN, fontWeight: 800, letterSpacing: '-.02em' };
  return { fontWeight: 700, letterSpacing: '-.01em' };
}

const has = (...v: string[]) => v.some((x) => x.trim());
const join = (sep: string, ...v: string[]) => v.map((x) => x.trim()).filter(Boolean).join(sep);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="pb-[3px] text-[11px] font-semibold uppercase" style={{ color: P, borderBottom: `1px solid ${P}`, letterSpacing: '.02em' }}>{title}</h2>
      {children}
    </section>
  );
}

/** Text on the left, a date / place on the right of the same line. */
function Line({ left, right, strong }: { left: string; right?: string; strong?: boolean }) {
  if (!has(left, right ?? '')) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <p className={strong ? 'font-semibold text-ink' : 'text-[#334155]'}>{left}</p>
      {right?.trim() && <p className="flex-none text-[11px] text-[#334155]">{right}</p>}
    </div>
  );
}

/**
 * ATS version of the resume: one column, one reading order, real headings and lists.
 * Rendered only while printing it (exporting === 'ats'), from the same content and theme as the chosen layout.
 */
export function AtsVersion({ def }: LayoutProps) {
  const b = useResume((s) => s.basics);
  const t = useResume((s) => s.titles);
  const exp = useResume((s) => s.exp).filter((x) => has(x.role, x.company, x.location, x.start, x.end, ...x.bullets));
  const edu = useResume((s) => s.edu).filter((x) => has(x.degree, x.school, x.year, x.detail));
  const skills = useResume((s) => s.skills).map((k) => k.v.trim()).filter(Boolean);
  const projects = useResume((s) => s.projects).filter((x) => has(x.name, x.link, x.desc));
  const contact = join(' · ', b.email, b.phone, b.location, b.website);

  return (
    <div className="flex flex-col gap-4 font-sans text-[11.5px] leading-[1.45] text-ink">
      <header className="flex flex-col gap-1">
        {b.fullName.trim() && <h1 className="text-[26px] leading-[1.15]" style={{ ...nameFont(def.id), color: P }}>{b.fullName}</h1>}
        {b.headline.trim() && <p className="text-[13px] font-medium text-[#334155]">{b.headline}</p>}
        {contact && <p className="text-[11px] text-[#334155]">{contact}</p>}
      </header>

      {b.summary.trim() && (
        <Section title={t.summary || 'Profile'}>
          <p className="whitespace-pre-wrap">{b.summary}</p>
        </Section>
      )}

      {exp.length > 0 && (
        <Section title={t.exp || 'Experience'}>
          {exp.map((x) => (
            <div key={x.id} className="item flex flex-col gap-[2px]">
              <Line strong left={x.role} right={join(' – ', x.start, x.end)} />
              <Line left={join(' · ', x.company, x.location)} />
              {x.bullets.some((v) => v.trim()) && (
                <ul className="mt-[2px] flex flex-col gap-[1px]">
                  {x.bullets.filter((v) => v.trim()).map((v, j) => (
                    <li key={j} className="flex gap-[6px]"><span aria-hidden="true">•</span><span className="whitespace-pre-wrap">{v}</span></li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {edu.length > 0 && (
        <Section title={t.edu || 'Education'}>
          {edu.map((x) => (
            <div key={x.id} className="item flex flex-col gap-[2px]">
              <Line strong left={x.degree} right={x.year} />
              <Line left={join(' · ', x.school, x.detail)} />
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title={t.skills || 'Skills'}>
          <p>{skills.join(' · ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={t.projects || 'Projects'}>
          {projects.map((x) => (
            <div key={x.id} className="item flex flex-col gap-[2px]">
              <Line strong left={x.name} right={x.link} />
              {x.desc.trim() && <p className="whitespace-pre-wrap">{x.desc}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
