import { LAYOUTS } from '../data/layouts';
import { THEMES, type ThemeDef } from '../data/themes';
import { goTo } from '../lib/carousel';
import { useResume } from '../store/resume';
import { AtsExportButton, AtsNote, SampleClearButtons, useActive } from './controls';
import swatchRingUrl from '../assets/ui/swatch-ring.svg';
import starUrl from '../assets/ui/star.svg';
import starCaptionUrl from '../assets/ui/star-caption.svg';

/** Desktop floating "Styles" panel (Figma 526:2291): themes, layouts, resume data. */
export function Inspector() {
  const { layout, cur } = useActive();
  return (
    <aside className="panel noprint flex flex-none flex-col overflow-hidden" aria-label="Styles" style={{ width: 316, margin: '24px 14px 37px 0' }}>
      <div className="flex h-12 flex-none items-center justify-between pr-[15px] pl-[17px]" style={{ borderBottom: '1px solid rgba(223,223,223,.6)' }}>
        <span className="panel-lbl">Styles</span>
        <span className="note" style={{ background: '#dfdfdf', fontWeight: 400 }}>{cur.id} · {cur.name}</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-[15px] pt-[17px] pb-[18px]">
        <section className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="panel-lbl uppercase">Theme</span>
            <span className="flex items-center gap-1 text-[10px] text-[#475569]">
              <img src={starCaptionUrl} width={10} height={10} alt="" />
              fits {cur.cat}
            </span>
          </div>
          <span className="panel-sub mt-[11px] mb-2">Corporate</span>
          <ThemeGrid themes={THEMES.filter((t) => t.cat === 'Corporate')} />
          <span className="panel-sub mt-[14px] mb-2">Creative</span>
          <ThemeGrid themes={THEMES.filter((t) => t.cat === 'Creative')} />
        </section>

        <section className="mt-[23px] flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="panel-lbl uppercase">Layouts</span>
            <span className="text-[11px] text-[#475569]">{LAYOUTS.length} total</span>
          </div>
          <AtsNote className="mb-2 self-start" />
          <AtsExportButton className="mb-3 self-start" />
          <div className="flex flex-col gap-1">
            {LAYOUTS.map((l, i) => (
              <button key={l.id} type="button" className="opt layout-opt" aria-pressed={i === layout} onClick={() => goTo(i)}>
                <span className="code">{l.id}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[12px] font-semibold text-[#111827]">{l.name}</span>
                  <span className="truncate text-[11px] text-[#576984]">{l.grid}</span>
                </span>
                <span className="text-[10px] text-[#475569]">{l.cat === 'Corporate' ? 'CORP' : 'CREA'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-[23px] flex flex-col gap-2">
          <span className="panel-lbl uppercase">Resume data</span>
          <div className="grid grid-cols-2 gap-[6px]">
            <SampleClearButtons />
          </div>
          <p className="m-0 text-[11.5px] leading-[1.45] text-[#475569]">
            Edits save on every keystroke. Switching layout or theme never touches your content. Enter adds a bullet or skill; Backspace on an empty one removes it.
          </p>
        </section>
      </div>
    </aside>
  );
}

function ThemeGrid({ themes }: { themes: ThemeDef[] }) {
  const { theme, rec } = useActive();
  const setTheme = useResume((s) => s.setTheme);
  return (
    <div className="grid grid-cols-2 gap-[6px]">
      {themes.map((t) => (
        <button key={t.id} type="button" className="opt theme-opt" aria-pressed={t.id === theme.id} onClick={() => setTheme(t.id)} title={t.name}>
          <Swatches t={t} />
          <span className="name">{t.name}</span>
          {rec(t) && <img src={starUrl} width={11} height={11} alt="recommended" className="flex-none" />}
        </button>
      ))}
    </div>
  );
}

/** Accent + surface dots, each on the white ring from the design. */
export function Swatches({ t }: { t: ThemeDef }) {
  return (
    <span className="swatches" aria-hidden="true">
      <img src={swatchRingUrl} alt="" style={{ left: 0 }} />
      <i style={{ left: 2, background: t.p }} />
      <img src={swatchRingUrl} alt="" style={{ left: 11 }} />
      <i style={{ left: 13, background: t.t }} />
    </span>
  );
}
