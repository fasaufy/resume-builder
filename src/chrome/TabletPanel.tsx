import { LAYOUTS } from '../data/layouts';
import { THEMES } from '../data/themes';
import { goTo } from '../lib/carousel';
import { useResume } from '../store/resume';
import { useUi, type PanelTab } from '../store/ui';
import { AtsNote, OverBadge, SampleClearButtons, useActive } from './controls';
import { Swatches } from './Inspector';
import starUrl from '../assets/ui/star.svg';

const TABS: [PanelTab, string][] = [['layouts', 'Layouts'], ['themes', 'Themes']];

/** Tablet floating bottom panel with Layouts / Themes tabs (Figma 532:3422). */
export function TabletPanel() {
  const tpanel = useUi((s) => s.tpanel);
  const setPanel = useUi((s) => s.setPanel);
  const setTheme = useResume((s) => s.setTheme);
  const { layout, theme, rec } = useActive();

  return (
    <div className="noprint flex-none px-[14px] pb-[14px]">
      <div className="dock flex flex-col gap-[10px]">
        <div className="flex items-center justify-between gap-2">
          <div className="seg frost wide" role="group" aria-label="Panel">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" className="touch44" aria-pressed={tpanel === k} onClick={() => setPanel(k)}>{label}</button>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 justify-center">
            <AtsNote />
          </div>
          <div className="flex items-center gap-2">
            <OverBadge short />
            <SampleClearButtons />
          </div>
        </div>
        <div className="hs">
          {tpanel === 'layouts'
            ? LAYOUTS.map((l, i) => (
                <button key={l.id} type="button" className="opt layout-opt flex-none" style={{ width: 240 }} aria-pressed={i === layout} onClick={() => goTo(i)}>
                  <span className="code">{l.id}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[12px] font-semibold text-[#111827]">{l.name}</span>
                    <span className="truncate text-[11px] text-[#576984]">{l.grid}</span>
                  </span>
                </button>
              ))
            : THEMES.map((t) => (
                <button key={t.id} type="button" className="opt theme-opt flex-none" style={{ width: 200, height: 50 }} aria-pressed={t.id === theme.id} onClick={() => setTheme(t.id)} title={t.name}>
                  <Swatches t={t} />
                  <span className="name">{t.name}</span>
                  {rec(t) && <img src={starUrl} width={11} height={11} alt="recommended" className="flex-none" />}
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}
