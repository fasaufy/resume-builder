# Canvas Resume Builder — Implementation Handoff

Free, no-login resume builder with direct on-canvas editing. The approved interactive wireframe is in `design-reference/`. **`design-reference/Main.dc.html` is the source of truth** for every layout's markup, styles, placeholders and behavior. Read it fully before writing components. The other `.dc.html` files are only device frames that embed Main at fixed sizes. They reference `./support.js`, a design-tool runtime that is not included, so do not try to run them.

How to read a `.dc.html` file: the markup is a template. `{{x}}` is a value from `renderVals()`, `<sc-if value>` is a conditional, and `<sc-for list as>` is a loop. The `<script type="text/x-dc">` block holds the logic class. Port it to React with TypeScript and keep the visuals identical.

## Stack (from PRD)
- Vite, React 18, TypeScript
- Tailwind CSS. Map theme colors to CSS variables (`--theme-primary`, `--theme-secondary`, `--theme-tint`) set on the page root.
- Zustand with `persist` middleware. Use localStorage, key `canvas-resume-builder:v1`, and save on every keystroke.
- `@dnd-kit/core` and `@dnd-kit/sortable` to replace the wireframe's up/down buttons for reordering items. Keep the buttons as the keyboard-accessible fallback.
- Fonts from Google Fonts (overrides the wireframe): **Inclusive Sans** is the main UI and body font; **Hedvig Letters Serif** replaces Merriweather and Playfair Display (it has one weight, 400, and no italic, so never fake bold or italic); eyebrow labels (small all-caps text: `.st01 .st02 .st04 .st08 .bdg .lbl`) use Inclusive Sans in all caps. **Hanken Grotesk** is the display face for L06–L10 names, headlines and section titles; **Geist** (class `.geist`) is used for links, dates and ID tags.
- Export: `window.print()` with the print stylesheet (Phase 1). `@react-pdf/renderer` comes later (Phase 3).

## UI guideline
App chrome follows Figma file `00Ki7M7ca1cxfHl3uz45K8` ("Daybük"): screen 512:772, toolbar 515:780, Styles panel 526:2291, tablet panel + mobile tool dock 532:3705. Carousel navigator: frosted pill 526:3409 (prev/next, layout ID + name, hint); it replaces the wireframe's category, "n / 10" and dots. The glass navigator 526:2799 was tried and reverted. Tokens and classes live in the "UI guideline" block at the end of `src/styles/app.css`; static assets are in `src/assets/ui/`.

## Suggested structure
```
src/
  store/resume.ts            # Zustand store, schema, blank(), sample(), normalize()
  data/layouts.ts            # LAYOUTS (id, name, cat, grid, mobile placeholders)
  data/themes.ts             # THEMES (p, s, t)
  hooks/useBreakpoint.ts     # mobile / tablet / desktop from container width
  hooks/useStageGeometry.ts  # scale, slide size, padding
  components/Editable.tsx    # auto-growing input/textarea with placeholder (.ed / .edi)
  components/ItemControls.tsx
  components/Carousel.tsx    # scroll-snap track, wheel jacking, active index sync
  components/Page.tsx        # paper box, transform scale, theme vars
  layouts/L01ExecutiveClassic.tsx … L10AsymmetricNeo.tsx
  chrome/DesktopBar.tsx, Inspector.tsx, TabletPanel.tsx, MobileBar.tsx, BottomSheet.tsx
  styles/print.css
```

## Data schema
This extends the PRD contract. Keep these names.
```ts
meta: { version: '1.0.0'; layout: number /*0–9*/; theme: ThemeId; paper: 'A4' | 'Letter' }
basics: { fullName, headline, email, phone, location, website, summary }
titles: { summary, exp, edu, skills, projects }   // editable section titles
exp: { id, role, company, location, start, end, bullets: string[] }[]
edu: { id, degree, school, year, detail }[]
skills: { id, v }[]
projects: { id, name, link, desc }[]
```
- Blank state: 2 roles with 3 empty bullets each, 1 education entry, 6 empty skills and 2 projects. All values start empty so every field shows its placeholder.
- When rehydrating, always run `normalize()` so old or corrupt data cannot break the layout.

## Breakpoints
Measure the **app root container width** with a ResizeObserver. Do not use window media queries; the app must behave correctly inside an embedded frame.

| Range | Mode | Canvas | Input | Chrome |
|---|---|---|---|---|
| ≤767 | mobile | Page fits the stage width (also capped by height), true paper proportions | Native touch swipe (scroll-snap) | Top bar with Export icon. Bottom bar: Edit, Layout, Theme, Zoom toggle. Bottom sheets. |
| 768–1023 | tablet | Desktop canvas scaled with the transform stage | Touch swipe only. **No wheel hijack.** | Top bar with zoom (Fit/100%), paper and Export. Floating bottom panel with Layouts and Themes tabs. |
| ≥1024 | desktop | Page scales to fit height | Vertical wheel/trackpad = 1 layout per gesture | Top bar with zoom (Fit/75/100/125), paper and Export. Floating inspector on the right (316px). |

Foldables: the folded screen (466×678) uses mobile rules and the unfolded screen (890×626) uses tablet rules. DPR 3x needs nothing special because everything is text and vector. Never rasterize the page.

## Stage geometry
These formulas are copied from the wireframe's `renderVals()`.
```
paper: A4 = 794×1123 px, Letter = 816×1056 px
fit = desktop: min((stageH-40)/ph, stageW*0.64/pw)
      tablet:  min((stageH-28)/ph, (stageW-120)/pw)
      mobile:  min((stageW-40)/pw, (stageH-20)/ph)
fit = max(0.18, fit);  scale = zoom==='fit' ? fit : zoom/100
slideW = round(pw*scale), slideH = round(ph*scale), gap = desktop ? 56 : 20
leading/trailing spacer = max(0, max(16, (stageW-slideW)/2) - gap)
```
The page is rendered at full paper size with `transform: scale()` and `transform-origin: 0 0`, inside a slide box of size slideW × slideH.

## Carousel behavior
- Use a horizontal flex track with `scroll-snap-type: x mandatory`. Slides use `scroll-snap-align: center` and `scroll-snap-stop: always`. Hide the scrollbar.
- Active index = `round(scrollLeft / (slideW + gap))`. Write it to `meta.layout`.
- Programmatic `goTo(i)` uses a smooth `scrollTo`. Ignore scroll events until scrolling has been idle for about 160ms, otherwise the highlight flickers through the layouts in between.
- When the geometry changes (resize, paper or zoom), jump to `layout*(slideW+gap)` instantly.
- Wheel listener on desktop at Fit zoom only, registered with `{passive:false}`:
  - If the gesture is mostly horizontal (`|deltaX| > |deltaY|`), let the native swipe and snap handle it.
  - Otherwise call `preventDefault`. Step one layout when a new gesture starts (more than 220ms since the last wheel event), or when more than 750ms have passed since the last step.
- Inactive slides: 20% opacity (UI guideline), with a full-size invisible button that activates that layout. Focusing any field inside an inactive slide also activates it.
- When zoom is not Fit (focus mode), hide the inactive slides, disable snapping, and let the stage scroll in both directions.
- Carousel navigator below the stage: previous/next buttons (44px), layout id, name, category, "n / 10", dots, and a hint line (hidden on mobile).

## Editing rules
- Every text node is an `<input>` or `<textarea>` with a transparent background, `font: inherit`, and `field-sizing: content` so it grows with its text. On focus it gets a blue inset outline.
- Placeholders differ per layout and are written in Main.dc.html. Copy them exactly.
- Bullets and skills:
  - Enter inserts a new item after the current one and focuses it.
  - Backspace on an empty item removes it and focuses the previous one, as long as at least one item remains.
  - Find the focus target with `data-bid` / `data-sid` inside the closest `[data-scope]`.
- Item controls appear on hover or `:focus-within`: add bullet (roles only), move up, move down, delete.
- "Load sample" fills in Alex Mercer and keeps `meta`. "Clear all" needs a second tap within 3.5s and also keeps `meta`.
- Overflow badge: after each render, check whether the active page's `scrollHeight` is greater than its `clientHeight`. If so, show "Content runs past one page".

## Themes
Body text is always `#0f172a`.

| id | primary | secondary | tint (backgrounds) | persona |
|---|---|---|---|---|
| wall-street | #1e3a8a | #e2e8f0 | #e2e8f0 | Corporate |
| terminal-mono | #1f2937 | #9ca3af | #f3f4f6 | Corporate |
| british-racing | #064e3b | #fef3c7 | #fef3c7 | Corporate |
| obsidian-black | #000000 | #71717a | #f4f4f5 | Corporate |
| bauhaus-studio | #2563eb | #fef08a | #fef08a | Creative |
| terracotta-calm | #c2410c | #f5f5f4 | #f5f5f4 | Creative |
| sage-modern | #0d9488 | #f0fdfa | #f0fdfa | Creative |
| electric-atelier | #4338ca | #ede9fe | #ede9fe | Creative |

Mark with ★ the themes whose persona matches the active layout's category.

## Layouts
Build each from the matching `<!-- ===== Lxx ===== -->` block in Main.dc.html.
L01 Executive Classic · L02 Technical Modern (65/35, right sidebar) · L03 Minimal Ivy (serif header, 118px label column) · L04 Compact Pro (50/50) · L05 Operations Grid (25% date gutter + timeline rail) · L06 Swiss Editorial (30/70, 30px headers) · L07 Studio Split (33% tinted sidebar) · L08 Typographic Bold (hero statement, 8px/3px rules, 2-col roles) · L09 Portfolio Link (project cards first, link chips) · L10 Asymmetric Neo (6-col modular cards, mono badges).

## Print / export
Copy the `@media print` block from Main.dc.html:
- Hide everything except the active page.
- Remove the page's transform and shadow.
- Hide `.noprint`, `.rowctl`, `.add` and `.is-empty`.
- Make placeholders transparent.
- Set `@page { size: A4 | letter; margin: 0 }` according to `meta.paper`. Inject this rule dynamically, which the wireframe could not do.
- Add `break-inside: avoid` on items.

## Stretch test (acceptance checklist)
Drag the browser width slowly from 320 up to 1920 px, then repeat in DevTools at each device size: 390×844, 466×678 @3x, 768×1024, 820×1180, 890×626 @3x, 1023×768, 1024×768, 1440×900.

1. The mode switches exactly at 767→768 and 1023→1024. Nothing flickers or loops at the boundary.
2. The page always keeps true paper proportions. There is no horizontal page scroll, no edge bleed, and no clipped chrome.
3. After any resize, the active layout stays centered. It never jumps to a different layout.
4. The wheel advances exactly one layout per gesture on desktop and never hijacks the wheel on tablet or mobile. Touch swipe snaps one layout at a time on tablet and mobile.
5. Typed content survives switching layout, theme, paper size, zoom, mode, and a page reload.
6. Every field shows its placeholder when empty. Nothing is invisible or zero-width.
7. All touch targets on tablet and mobile are at least 44px. Bottom sheets scroll internally and close on the backdrop or ✕.
8. Print preview shows exactly one page with selectable text, and no UI or placeholder text.
9. Short-landscape case at 890×626: the page fits the height and the bottom panel does not cover the page.
