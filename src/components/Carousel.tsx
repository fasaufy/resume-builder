import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { LAYOUTS } from '../data/layouts';
import { getTheme } from '../data/themes';
import { useElementSize } from '../hooks/useElementSize';
import type { Mode } from '../hooks/useBreakpoint';
import { stageGeometry, type StageGeometry } from '../hooks/useStageGeometry';
import { registerGoTo } from '../lib/carousel';
import { LAYOUT_COMPONENTS } from '../layouts';
import { useResume } from '../store/resume';
import { useUi } from '../store/ui';
import { Page } from './Page';

const LAST = LAYOUTS.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(LAST, i));

/* timings from the wireframe */
const PROG_SMOOTH_MS = 700; // max length of a programmatic smooth scroll
const PROG_IDLE_MS = 160; // scroll must be idle this long before we trust scroll events again
const PROG_JUMP_MS = 120; // after an instant re-align
const WHEEL_GESTURE_MS = 220; // gap between wheel events that starts a new gesture
const WHEEL_STEP_MS = 750; // within one long gesture, step at most this often

interface CarouselProps {
  mode: Mode;
  appW: number;
}

/**
 * Horizontal scroll-snap track of all layouts. The active index lives in meta.layout.
 * Desktop at Fit zoom turns vertical wheel/trackpad into one-layout-per-gesture.
 */
export function Carousel({ mode, appW }: CarouselProps) {
  const [stageEl, setStageEl] = useState<HTMLDivElement | null>(null);
  const [trackEl, setTrackEl] = useState<HTMLDivElement | null>(null);
  const { w: stageW, h: stageH } = useElementSize(stageEl);

  const layout = useResume((s) => s.meta.layout);
  const paper = useResume((s) => s.meta.paper);
  const theme = getTheme(useResume((s) => s.meta.theme));
  const setLayout = useResume((s) => s.setLayout);
  const zoom = useUi((s) => s.zoom);
  const setOver = useUi((s) => s.setOver);

  const g = stageGeometry(mode, paper, zoom, stageW, stageH, appW);
  const { sw, sh, gap, spacer, focus, scale, pw, ph } = g;

  // Latest values for event handlers registered outside React.
  const geo = useRef<StageGeometry & { mode: Mode; stageW: number; stageH: number }>({ ...g, mode, stageW, stageH });
  geo.current = { ...g, mode, stageW, stageH };

  /* "programmatic scroll in progress": ignore scroll events so the highlight
     doesn't flicker through the layouts in between */
  const prog = useRef(false);
  const progT = useRef<ReturnType<typeof setTimeout>>();
  const holdProg = (ms: number) => {
    prog.current = true;
    clearTimeout(progT.current);
    progT.current = setTimeout(() => (prog.current = false), ms);
  };
  useEffect(() => () => clearTimeout(progT.current), []);

  const goTo = useCallback(
    (target: number) => {
      const i = clamp(target);
      setLayout(i);
      const { sw, gap, focus } = geo.current;
      if (!trackEl || focus) return;
      holdProg(PROG_SMOOTH_MS);
      try {
        trackEl.scrollTo({ left: i * (sw + gap), behavior: 'smooth' });
      } catch {
        trackEl.scrollLeft = i * (sw + gap);
      }
    },
    [trackEl, setLayout],
  );

  useEffect(() => {
    registerGoTo(goTo);
    return () => registerGoTo(null);
  }, [goTo]);

  /* When geometry changes (resize, paper, zoom, mode), jump to the active slide instantly. */
  const alignKey = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (!trackEl) return;
    if (focus) {
      alignKey.current = null;
      return;
    }
    const key = `${sw}|${gap}|${spacer}`;
    if (key === alignKey.current) return;
    alignKey.current = key;
    holdProg(PROG_JUMP_MS);
    trackEl.scrollLeft = useResume.getState().meta.layout * (sw + gap);
  });

  const onScroll = () => {
    if (prog.current) {
      holdProg(PROG_IDLE_MS);
      return;
    }
    const { sw, gap, focus, stageW, stageH } = geo.current;
    if (!trackEl || !stageEl || focus) return;
    // Scroll events fire before the ResizeObserver: while the stage has a new size the
    // geometry above is stale, so don't infer an index. The re-align effect will run next.
    if (stageEl.clientWidth !== stageW || stageEl.clientHeight !== stageH) return;
    const i = clamp(Math.round(trackEl.scrollLeft / (sw + gap)));
    if (i !== useResume.getState().meta.layout) setLayout(i);
  };

  /* Desktop-only wheel jacking: vertical wheel/trackpad -> one layout per gesture. */
  useEffect(() => {
    if (!trackEl) return;
    let lastWheel = 0;
    let lastStep = 0;
    const onWheel = (e: WheelEvent) => {
      const { mode, focus } = geo.current;
      if (mode !== 'desktop' || focus) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal swipe + snap
      e.preventDefault();
      if (Math.abs(e.deltaY) < 3) return;
      const now = Date.now();
      const newGesture = now - lastWheel > WHEEL_GESTURE_MS;
      lastWheel = now;
      if (newGesture || now - lastStep > WHEEL_STEP_MS) {
        lastStep = now;
        goTo(useResume.getState().meta.layout + (e.deltaY > 0 ? 1 : -1));
      }
    };
    trackEl.addEventListener('wheel', onWheel, { passive: false });
    return () => trackEl.removeEventListener('wheel', onWheel);
  }, [trackEl, goTo]);

  /* Overflow badge: does the active page's content run past one page? */
  const checkOverflow = useCallback(() => {
    const p = trackEl?.querySelector<HTMLElement>('.slide.is-active .page');
    if (p) setOver(p.scrollHeight > p.clientHeight + 2);
  }, [trackEl, setOver]);
  useLayoutEffect(checkOverflow);
  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(checkOverflow);
    };
    const unsub = useResume.subscribe(schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [checkOverflow]);

  const trackStyle: CSSProperties = focus
    ? { minHeight: '100%', overflow: 'visible', scrollSnapType: 'none', width: 'max-content', minWidth: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 16px' }
    : { minHeight: '100%', height: '100%', alignItems: 'center', gap };
  const spacerStyle: CSSProperties = focus ? { display: 'none' } : { flex: 'none', width: spacer, height: 1 };

  return (
    <div ref={setStageEl} className="stage" style={{ flex: 1, minHeight: 0, overflow: focus ? 'auto' : 'hidden' }}>
      <div ref={setTrackEl} className="track" onScroll={onScroll} aria-label="Resume layouts carousel" style={trackStyle}>
        <div aria-hidden="true" style={spacerStyle} />
        {LAYOUTS.map((def, i) => {
          const on = i === layout;
          const Layout = LAYOUT_COMPONENTS[i];
          return (
            <div
              key={def.id}
              className={on ? 'slide is-active' : 'slide'}
              style={{ flex: 'none', width: sw, height: sh, display: focus && !on ? 'none' : undefined, opacity: !focus && !on ? 0.2 : undefined }}
              onFocus={() => {
                if (useResume.getState().meta.layout !== i) goTo(i);
              }}
            >
              <Page pw={pw} ph={ph} scale={scale} theme={theme}>
                <Layout def={def} />
              </Page>
              {!on && <button type="button" className="hit noprint" onClick={() => goTo(i)} aria-label={`Switch to layout ${def.id}, ${def.name}`} />}
            </div>
          );
        })}
        <div aria-hidden="true" style={spacerStyle} />
      </div>
    </div>
  );
}
