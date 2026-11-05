import { Suspense, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingBar } from '@/components/ui/LoadingBar';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { RouteTransition } from './RouteTransition';
import { AppRoutes } from './routes';

/**
 * Scroll position across navigations. A new page starts at the top. A link
 * with a hash (/apparel#accessories, /#contact) lands on that section instead,
 * waiting a few frames if the lazy route hasn't mounted it yet.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef(pathname);

  useEffect(() => {
    const pageChanged = lastPath.current !== pathname;
    lastPath.current = pathname;
    // 'instant': the page-wide smooth scrolling is for in-page jumps, not for arriving somewhere new.
    if (pageChanged) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let frame = 0;
    const seek = () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: pageChanged ? 'instant' : 'auto', block: 'start' });
      else if (tries++ < 120) frame = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <>
      <LoadingBar />
      <ScrollManager />
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
