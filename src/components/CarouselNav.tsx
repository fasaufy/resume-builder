import { LAYOUTS } from '../data/layouts';
import type { Mode } from '../hooks/useBreakpoint';
import { goTo } from '../lib/carousel';
import { useResume } from '../store/resume';
import { useUi } from '../store/ui';
import { OverBadge } from '../chrome/controls';
import navPrevUrl from '../assets/ui/nav-prev.svg';
import navNextUrl from '../assets/ui/nav-next.svg';

/** Below the stage: a frosted pill with prev/next, layout id + name and a hint (Figma 526:3409). */
export function CarouselNav({ mode }: { mode: Mode }) {
  const layout = useResume((s) => s.meta.layout);
  const focus = useUi((s) => s.zoom !== 'fit');
  const cur = LAYOUTS[layout];
  const isMob = mode === 'mobile';
  const hint =
    mode === 'desktop'
      ? focus
        ? 'Zoomed: use arrows to switch layout'
        : 'Scroll or swipe to browse layouts · click any text to edit'
      : 'Swipe to browse layouts · tap any text to edit';

  return (
    <div className="noprint flex flex-none justify-center" style={{ padding: isMob ? '6px 10px' : '8px 16px 10px' }}>
      <div className="panel relative flex max-w-full items-start gap-4 p-[3px]">
        {!isMob && (
          <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
            <OverBadge />
          </div>
        )}
        <button type="button" className="pillbtn" onClick={() => goTo(layout - 1)} disabled={layout === 0} aria-label="Previous layout">
          <img src={navPrevUrl} width={44} height={44} alt="" />
        </button>
        <div className={`flex min-w-0 flex-col items-center justify-center gap-2 ${isMob ? 'flex-1 py-[9px]' : 'w-[300px] py-3'}`}>
          <div className="flex min-w-0 max-w-full items-center gap-[10px]" aria-live="polite">
            <span className="note geist flex-none" style={{ background: '#dfdfdf', fontWeight: 400 }}>{cur.id}</span>
            <strong className="truncate text-[13px] leading-[1.2] font-bold text-[#101828]">{cur.name}</strong>
          </div>
          {!isMob && <span className="text-center text-[11.5px] leading-[1.2] text-[#475467]">{hint}</span>}
        </div>
        <button type="button" className="pillbtn" onClick={() => goTo(layout + 1)} disabled={layout === LAYOUTS.length - 1} aria-label="Next layout">
          <img src={navNextUrl} width={44} height={44} alt="" />
        </button>
      </div>
    </div>
  );
}
