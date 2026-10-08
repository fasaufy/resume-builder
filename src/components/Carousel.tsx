import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { LAYOUTS } from '../data/layouts';
import { getTheme } from '../data/themes';
import { useElementSize } from '../hooks/useElementSize';
import type { Mode } from '../hooks/useBreakpoint';
import { slideWidth, spacerFor, stageGeometry, type StageGeometry } from '../hooks/useStageGeometry';
import { registerGoTo } from '../lib/carousel';
import { LAYOUT_COMPONENTS } from '../layouts';
import { AtsVersion } from '../layouts/AtsVersion';
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

/** Slides in track order. */
const slidesOf = (track: HTMLElement) => track.querySelectorAll<HTMLElement>(':scope > .slide');

/** scrollLeft that centres slide i (slides can differ in width: multi-page resumes are wider). */
function centerLeft(track: HTMLElement, i: number) {
  const s = slidesOf(track)[i];
  return s ? s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2 : 0;
}

/** Slide whose centre is nearest the middle of the track. */
function nearestSlide(track: HTMLElement) {
  const mid = track.scrollLeft + track.clientWidth / 2;
  let best = 0;
  let dist = Infinity;
  slidesOf(track).forEach((s, i) => {
    const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
    if (d < dist) [best, dist] = [i, d];
  });
  return best;
}

/**
 * Pages a layout's content currently fills. The page is a multi-column box with one column per page,
 * and the content box (.flow) returns one client rect per page it is split across. (Not the page's
 * scrollWidth: the sheets drawn for the current page count would keep it from ever shrinking.)
 */
function measurePages(slide: HTMLElement) {
  const flow = slide.querySelector<HTMLElement>('.flow');
  return flow ? Math.max(1, flow.getClientRects().length) : 1;
}

/**
 * Horizontal scroll-snap track of all layouts. The active index lives in meta.layout.
 * Desktop at Fit zoom turns vertical wheel/trackpad into one-layout-per-gesture.
 * A resume that needs more than one page shows its pages side by side in its slide.
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
  const setActivePages = useUi((s) => s.setPages);
  const exporting = useUi((s) => s.exporting);
  const printAts = exporting === 'ats';

  /* pages per layout, measured after each render / edit */
  const [pages, setPages] = useState<number[]>(() => LAYOUTS.map(() => 1));

  const g = stageGeometry(mode, paper, zoom, stageW, stageH, appW, pages[layout]);
  const { sh, gap, focus, scale, pw, ph } = g;
  const widths = pages.map((n) => slideWidth(g, n));
  const lead = spacerFor(g, widths[0]);
  const trail = spacerFor(g, widths[LAST]);

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
      if (!trackEl || geo.current.focus) return;
      holdProg(PROG_SMOOTH_MS);
      // after React has resized the slides for the new active layout
      requestAnimationFrame(() => {
        const left = centerLeft(trackEl, i);
        try {
          trackEl.scrollTo({ left, behavior: 'smooth' });
        } catch {
          trackEl.scrollLeft = left;
        }
      });
    },
    [trackEl, setLayout],
  );

  useEffect(() => {
    registerGoTo(goTo);
    return () => registerGoTo(null);
  }, [goTo]);

  /* When geometry changes (resize, paper, zoom, mode, a page added or removed), jump to the active slide instantly. */
  const alignKey = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (!trackEl) return;
    if (focus) {
      alignKey.current = null;
      return;
    }
    const key = `${scale}|${gap}|${widths.join(',')}|${lead}|${trail}|${g.sW}`;
    if (key === alignKey.current) return;
    alignKey.current = key;
    holdProg(PROG_JUMP_MS);
    trackEl.scrollLeft = centerLeft(trackEl, useResume.getState().meta.layout);
  });

  const onScroll = () => {
    if (prog.current) {
      holdProg(PROG_IDLE_MS);
      return;
    }
    const { focus, stageW, stageH } = geo.current;
    if (!trackEl || !stageEl || focus) return;
    // Scroll events fire before the ResizeObserver: while the stage has a new size the
    // geometry above is stale, so don't infer an index. The re-align effect will run next.
    if (stageEl.clientWidth !== stageW || stageEl.clientHeight !== stageH) return;
    const i = clamp(nearestSlide(trackEl));
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

  /* Page count: measure every layout after each render and edit (pages are added / removed automatically). */
  const measure = useCallback(() => {
    if (!trackEl || useUi.getState().exporting) return; // printing swaps content; keep the screen layout as it was
    const next = [...slidesOf(trackEl)].map(measurePages);
    setPages((prev) => (next.length === prev.length && next.every((n, i) => n === prev[i]) ? prev : next));
  }, [trackEl]);
  useLayoutEffect(measure);
  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const unsub = useResume.subscribe(schedule);
    document.fonts?.ready.then(schedule);
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [measure]);
  useEffect(() => setActivePages(pages[layout]), [pages, layout, setActivePages]);

  const trackStyle: CSSProperties = focus
    ? { position: 'relative', minHeight: '100%', overflow: 'visible', scrollSnapType: 'none', width: 'max-content', minWidth: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 16px 160px' } // bottom room so the page can scroll clear of the floating navigator
    : { position: 'relative', minHeight: '100%', height: '100%', alignItems: 'center', gap };
  const spacerStyle = (w: number): CSSProperties => (focus ? { display: 'none' } : { flex: 'none', width: w, height: 1 });

  return (
    <div ref={setStageEl} className="stage" style={{ flex: 1, minHeight: 0, overflow: focus ? 'auto' : 'hidden' }}>
      <div ref={setTrackEl} className="track" onScroll={onScroll} aria-label="Resume layouts carousel" style={trackStyle}>
        <div aria-hidden="true" style={spacerStyle(lead)} />
        {LAYOUTS.map((def, i) => {
          const on = i === layout;
          // the ATS export swaps the active page for the single-column version of the same content
          const Layout = on && printAts ? AtsVersion : LAYOUT_COMPONENTS[i];
          return (
            <div
              key={def.id}
              className={on ? 'slide is-active' : 'slide'}
              style={{ flex: 'none', width: widths[i], height: sh, display: focus && !on ? 'none' : undefined, opacity: !focus && !on ? 0.2 : undefined }}
              onFocus={() => {
                if (useResume.getState().meta.layout !== i) goTo(i);
              }}
            >
              <Page pw={pw} ph={ph} scale={scale} theme={theme} pages={pages[i]} sheet={on && printAts ? undefined : def.sheet} ats={on && printAts}>
                <Layout def={def} />
              </Page>
              {!on && <button type="button" className="hit noprint" onClick={() => goTo(i)} aria-label={`Switch to layout ${def.id}, ${def.name}`} />}
            </div>
          );
        })}
        <div aria-hidden="true" style={spacerStyle(trail)} />
      </div>
    </div>
  );
}
