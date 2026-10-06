import { LAYOUTS } from '../data/layouts';
import { THEMES } from '../data/themes';
import { goTo } from '../lib/carousel';
import { useResume } from '../store/resume';
import { useUi, type PanelTab } from '../store/ui';
import { OverBadge, SampleClearButtons, ThemeDots, useActive } from './controls';

const TABS: [PanelTab, string][] = [['layouts', 'Layouts'], ['themes', 'Themes']];

/** Tablet floating bottom panel with Layouts / Themes tabs. */
export function TabletPanel() {
  const tpanel = useUi((s) => s.tpanel);
  const setPanel = useUi((s) => s.setPanel);
  const setTheme = useResume((s) => s.setTheme);
  const { layout, theme, rec } = useActive();

  return (
    <div className="noprint" style={{ flex: 'none', padding: '0 14px 14px' }}>
      <div style={{ background: '#fff', border: '1px solid #d6d9de', borderRadius: 16, boxShadow: '0 8px 28px rgba(15,23,42,.12)', padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="seg big" role="group" aria-label="Panel">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={tpanel === k} onClick={() => setPanel(k)}>{label}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <OverBadge short />
          <SampleClearButtons tall />
        </div>
        <div className="hs">
          {tpanel === 'layouts'
            ? LAYOUTS.map((l, i) => (
                <button key={l.id} type="button" className="pill" aria-pressed={i === layout} onClick={() => goTo(i)}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontSize: 11, color: '#4b5563' }}>{l.id} · {l.cat}</span>
                </button>
              ))
            : THEMES.map((t) => (
                <button key={t.id} type="button" className="sw" style={{ flex: 'none', minHeight: 52, padding: '8px 12px' }} aria-pressed={t.id === theme.id} onClick={() => setTheme(t.id)}>
                  <ThemeDots t={t} />
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span>{t.name}</span>
                    <span style={{ fontSize: 10.5, color: '#4b5563' }}>{t.cat}{rec(t) ? ' · ★' : ''}</span>
                  </span>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}
