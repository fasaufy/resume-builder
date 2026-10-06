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
  /** Active page content runs past one page. */
  over: boolean;
  confirmClear: boolean;
  setZoom: (z: Zoom) => void;
  setSheet: (s: Sheet) => void;
  setTab: (t: EditTab) => void;
  setPanel: (t: PanelTab) => void;
  setOver: (o: boolean) => void;
  /** Two-tap clear: the first tap arms it for 3.5s, the second clears (meta is kept). */
  clearAll: () => void;
}

let clearTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiState>()((set, get) => ({
  zoom: 'fit',
  sheet: null,
  tab: 'profile',
  tpanel: 'layouts',
  over: false,
  confirmClear: false,
  setZoom: (zoom) => set({ zoom }),
  setSheet: (sheet) => set({ sheet }),
  setTab: (tab) => set({ tab }),
  setPanel: (tpanel) => set({ tpanel }),
  setOver: (over) => {
    if (get().over !== over) set({ over });
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
