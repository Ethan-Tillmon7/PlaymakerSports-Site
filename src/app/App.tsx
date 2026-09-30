import { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingBar } from '@/components/ui/LoadingBar';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { RouteTransition } from './RouteTransition';
import { AppRoutes } from './routes';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <LoadingBar />
      <ScrollToTop />
      <RouteTransition>
        {/* RouteTransition remounts per pathname, which also clears a caught error. */}
        <RouteErrorBoundary>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </RouteErrorBoundary>
      </RouteTransition>
    </>
  );
}
