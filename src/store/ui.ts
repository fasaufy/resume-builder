import { create } from 'zustand';
import { useResume } from './resume';

export type Zoom = 'fit' | 75 | 100 | 125;
export type Sheet = null | 'edit' | 'layout' | 'theme';
export type EditTab = 'profile' | 'exp' | 'edu' | 'skills' | 'projects';
export type PanelTab = 'layouts' | 'themes';

interface UiState {
  zoom: Zoom;
  sheet: Sheet;
  tab: EditTab;
  tpanel: PanelTab;
  /** Number of pages the active resume runs to. */
  pages: number;
  confirmClear: boolean;
  /**
   * Set while printing. Fields render as plain text (h1/h2/p/li) instead of inputs, for ATS-readable PDFs.
   * 'design' prints the chosen layout; 'ats' prints the single-column ATS version of the same content.
   */
  exporting: false | 'design' | 'ats';
  /** Export waiting on the "sample text in [brackets]" confirmation, or null. */
  confirmExport: null | 'design' | 'ats';
  setZoom: (z: Zoom) => void;
  setSheet: (s: Sheet) => void;
  setTab: (t: EditTab) => void;
  setPanel: (t: PanelTab) => void;
  setPages: (n: number) => void;
  /** Two-tap clear: the first tap arms it for 3.5s, the second clears (meta is kept). */
  clearAll: () => void;
}

let clearTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>()((set, get) => ({
  zoom: 'fit',
  sheet: null,
  tab: 'profile',
  tpanel: 'layouts',
  pages: 1,
  confirmClear: false,
  exporting: false,
  confirmExport: null,
  setZoom: (zoom) => set({ zoom }),
  setSheet: (sheet) => set({ sheet }),
  setTab: (tab) => set({ tab }),
  setPanel: (tpanel) => set({ tpanel }),
  setPages: (pages) => {
    if (get().pages !== pages) set({ pages });
  },
  clearAll: () => {
    clearTimeout(clearTimer);
    if (!get().confirmClear) {
      set({ confirmClear: true });
      clearTimer = setTimeout(() => set({ confirmClear: false }), 3500);
      return;
    }
    useResume.getState().clearAll();
  },
}));

// Any content edit disarms a pending "Clear all", as in the wireframe.
useResume.subscribe((s, prev) => {
  if (s !== prev && useUi.getState().confirmClear) {
    clearTimeout(clearTimer);
    useUi.setState({ confirmClear: false });
  }
});
