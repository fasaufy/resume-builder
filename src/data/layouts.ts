export type LayoutCat = 'Corporate' | 'Creative';

/** Per-layout placeholders used by the mobile edit sheet. */
export interface LayoutPlaceholders {
  headline: string;
  website: string;
  summary: string;
  role: string;
  bullet: string;
  skill: string;
}

export interface LayoutDef {
  id: string;
  name: string;
  cat: LayoutCat;
  grid: string;
  /** Single reading order that applicant tracking systems parse cleanly. */
  ats: boolean;
  /** Background painted on every page of this layout (full-height sidebars), as a CSS background. */
  sheet?: string;
  ph: LayoutPlaceholders;
}

export const LAYOUTS: LayoutDef[] = [
  { id: 'L01', ats: true, name: 'Executive Classic', cat: 'Corporate', grid: 'Single column, centered header', ph: { headline: 'Title, e.g. Chief Operating Officer', website: 'linkedin.com/in/yourname', summary: 'Executive summary: years in leadership, sectors and the scale you have owned.', role: 'e.g. Managing Director', bullet: 'Led a deal or turnaround; quantify the outcome', skill: 'e.g. M&A strategy' } },
  { id: 'L02', ats: false, sheet: 'linear-gradient(90deg, transparent 65%, var(--theme-tint) 65%)', name: 'Technical Modern', cat: 'Corporate', grid: '65 / 35 split, right sidebar', ph: { headline: 'e.g. Senior Software Engineer', website: 'github.com/yourname', summary: 'Engineering focus: languages, systems and scale.', role: 'e.g. Staff Software Engineer', bullet: 'Built or scaled a system; cite latency, uptime or cost', skill: 'e.g. TypeScript' } },
  { id: 'L03', ats: true, name: 'Minimal Ivy', cat: 'Corporate', grid: 'Serif header, dense rows', ph: { headline: 'e.g. Engagement Manager', website: 'linkedin.com/in/yourname', summary: 'Industries, functions and client questions you answer.', role: 'e.g. Senior Consultant', bullet: 'Advised a client on a decision; state the value', skill: 'e.g. Financial modeling' } },
  { id: 'L04', ats: false, name: 'Compact Pro', cat: 'Corporate', grid: 'Balanced 50 / 50 columns', ph: { headline: 'e.g. Operations Manager', website: 'linkedin.com/in/yourname', summary: 'Sites, budgets and processes you have run.', role: 'e.g. Senior Project Manager', bullet: 'Cut cost, lead time or defects by a measurable amount', skill: 'e.g. Lean Six Sigma' } },
  { id: 'L05', ats: true, name: 'Operations Grid', cat: 'Corporate', grid: 'Timeline rail, 25 / 75 gutter', ph: { headline: 'e.g. Senior Product Manager', website: 'linkedin.com/in/yourname', summary: 'Domains, users and the metrics you move.', role: 'e.g. Product Manager, Growth', bullet: 'Shipped a launch; name the metric and the lift', skill: 'e.g. SQL' } },
  { id: 'L06', ats: false, name: 'Swiss Editorial', cat: 'Creative', grid: '30 / 70, oversized headers', ph: { headline: 'e.g. Senior Product Designer', website: 'yourportfolio.com', summary: 'Your design point of view and how you work.', role: 'e.g. Lead Product Designer', bullet: 'Redesigned a flow; show the effect on users', skill: 'e.g. Figma' } },
  { id: 'L07', ats: false, sheet: 'linear-gradient(90deg, var(--theme-tint) 33%, transparent 33%)', name: 'Studio Split', cat: 'Creative', grid: 'Tinted 33% sidebar', ph: { headline: 'e.g. Brand Strategist', website: 'yourstudio.com', summary: 'What brands hire you for and the audiences you know.', role: 'e.g. Creative Producer', bullet: 'Shaped a campaign; cite reach or awards', skill: 'e.g. Brand positioning' } },
  { id: 'L08', ats: false, name: 'Typographic Bold', cat: 'Creative', grid: 'Hero statement, heavy rules', ph: { headline: 'e.g. Senior Copywriter', website: 'yourwriting.com', summary: 'A one-line manifesto: what you make and why it matters.', role: 'e.g. Copy Lead', bullet: 'Wrote a campaign or story; note reach or award', skill: 'e.g. Long-form editing' } },
  { id: 'L09', ats: false, name: 'Portfolio Link', cat: 'Creative', grid: 'Project-first, link tags', ph: { headline: 'e.g. Design Engineer', website: 'yoursite.dev', summary: 'What you build where design meets code.', role: 'e.g. Frontend Engineer', bullet: 'Built a tool or component; cite adoption', skill: 'e.g. React' } },
  { id: 'L10', ats: false, name: 'Asymmetric Neo', cat: 'Creative', grid: 'Modular cards, micro badges', ph: { headline: 'e.g. Founder & Creative Director', website: 'yourstudio.com', summary: 'Your studio story and what you are known for.', role: 'e.g. Founder', bullet: 'Grew a team, client list or revenue; give the number', skill: 'e.g. Creative direction' } },
];
