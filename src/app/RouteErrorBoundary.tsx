import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Brand } from '@/components/layout/Brand';
import { buttonClass } from '@/components/ui/buttonClass';

const RELOAD_KEY = 'pm-chunk-reload-at';

/**
 * Every route but Home is a lazy chunk with a content-hashed filename. After a
 * deploy, a tab that was already open asks for the old hash, gets the SPA
 * fallback HTML instead, and the import throws. One hard reload picks up the new
 * build; the timestamp guard stops a genuinely broken chunk from reload-looping.
 */
function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Importing a module script failed|Failed to fetch module|ChunkLoadError/i.test(msg);
}

function reloadedRecently(): boolean {
  try {
    const at = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    return Date.now() - at < 10_000;
  } catch {
    return true; // storage blocked: don't risk a loop
  }
}

interface Props {
  children: ReactNode;
}

interface State {
  error: unknown;
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (isChunkLoadError(error) && !reloadedRecently()) {
      try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        return;
      }
      window.location.reload();
      return;
    }
    console.error('Route render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    // Plain markup on purpose: the crash may have come from PageLayout itself, so
    // this borrows the 404's night header (black ground, lockup, page title) without
    // the nav, the lamp or anything else that runs a hook.
    return (
      <main className="night-ground on-night min-h-[100dvh] flex flex-col">
        <div className="flex-1 w-full max-w-[1480px] mx-auto px-6 sm:px-10 pt-6 pb-16 lg:pb-24">
          <a href="/" aria-label="Playmaker Sports home" className="inline-block">
            <Brand sizeClass="text-[17px] lg:text-[18px]" />
          </a>
          <div role="alert" className="mt-14 lg:mt-20">
            <h1 className="page-h1 enter">This page didn't load</h1>
            <p className="page-lede mt-5 enter enter-2">
              The site may have just updated, or the connection dropped. Reloading usually fixes it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 enter enter-2">
              <button type="button" onClick={() => window.location.reload()} className={buttonClass({ size: 'lg' })}>
                Reload page
              </button>
              <a href="/" className={buttonClass({ variant: 'ghost', size: 'lg' })}>
                Go home
              </a>
            </div>
          </div>
        </div>
        <div className="awning" aria-hidden="true" />
      </main>
    );
  }
}
