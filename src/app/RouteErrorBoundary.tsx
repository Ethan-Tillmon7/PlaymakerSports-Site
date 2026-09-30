import { Component, type ErrorInfo, type ReactNode } from 'react';
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

    // Plain markup on purpose: the crash may have come from PageLayout itself.
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 py-16 bg-pm-paper">
        <div role="alert" className="border border-pm-rule rounded-2xl p-10 sm:p-14 text-center max-w-[560px] w-full">
          <a href="/" aria-label="Playmaker Sports home" className="inline-block">
            <span className="bg-pm-yellow inline-flex items-baseline gap-1 px-2 py-1 font-display text-[22px] leading-none uppercase tracking-[0.005em] rounded-lg">
              <span className="text-white">PLAY</span>
              <span className="text-pm-black">MAKER</span>
            </span>
          </a>
          <h1 className="font-display uppercase text-[clamp(28px,4vw,40px)] leading-[0.9] tracking-[0.005em] text-pm-black mt-8 text-balance">
            This page didn't load
          </h1>
          <p className="text-[15px] leading-[1.6] text-pm-ink mt-4">
            The site may have just updated, or the connection dropped. Reloading usually fixes it.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={buttonClass()}
            >
              Reload page
            </button>
            <a
              href="/"
              className={buttonClass({ variant: 'secondary' })}
            >
              Go home
            </a>
          </div>
        </div>
      </main>
    );
  }
}
