import { useEffect, useState } from 'react';
import { BottomSheet } from './chrome/BottomSheet';
import { DesktopBar, TabletBar } from './chrome/DesktopBar';
import { Inspector } from './chrome/Inspector';
import { MobileBar, MobileTopBar } from './chrome/MobileBar';
import { TabletPanel } from './chrome/TabletPanel';
import { Carousel } from './components/Carousel';
import { CarouselNav } from './components/CarouselNav';
import { PrintPageSize } from './components/PrintPageSize';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useElementSize } from './hooks/useElementSize';
import { useUi } from './store/ui';

export default function App() {
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const { w: appW } = useElementSize(rootEl);
  const mode = useBreakpoint(appW);

  // Keep UI state valid for the current mode: 75/125% exist on desktop only, sheets on mobile only.
  useEffect(() => {
    const { zoom, sheet } = useUi.getState();
    if (mode !== 'desktop' && (zoom === 75 || zoom === 125)) useUi.setState({ zoom: 'fit' });
    if (mode !== 'mobile' && sheet) useUi.setState({ sheet: null });
  }, [mode]);

  return (
    <div ref={setRootEl} className="app" style={{ position: 'relative', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PrintPageSize />
      {mode === 'desktop' && <DesktopBar />}
      {mode === 'tablet' && <TabletBar />}
      {mode === 'mobile' && <MobileTopBar />}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Carousel mode={mode} appW={appW} />
          <CarouselNav mode={mode} />
        </div>
        {mode === 'desktop' && <Inspector />}
      </div>

      {mode === 'tablet' && <TabletPanel />}
      {mode === 'mobile' && <MobileBar />}
      {mode === 'mobile' && <BottomSheet />}
      {mode === 'desktop' && <p className="credit noprint">2026 Built by Fadhil Y 🤙</p>}
    </div>
  );
}
