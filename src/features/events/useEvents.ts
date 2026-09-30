import { useCallback, useEffect, useState } from 'react';
import { API } from '@shared/api';
import type { PublicEvent } from '@shared/events';
import { classifyFailure, fetchWithTimeout, type RequestFailure } from '@/lib/http';
import { useLoadingBarStore } from '@/stores/loadingBar';

export type EventsState =
  | { status: 'loading' }
  | { status: 'success'; events: PublicEvent[] }
  | { status: 'error'; reason: RequestFailure };

/**
 * Loads the public event list on mount and again on `retry()`. Aborts on
 * unmount. `showLoadingBar` drives the top progress bar; the homepage ticker
 * leaves it off.
 */
export function useEvents({ showLoadingBar = false }: { showLoadingBar?: boolean } = {}): EventsState & {
  retry: () => void;
} {
  const [state, setState] = useState<EventsState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const bar = useLoadingBarStore.getState();
    if (showLoadingBar) bar.start();
    fetchWithTimeout(API.events, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        setState({ status: 'success', events: data as PublicEvent[] });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', reason: classifyFailure(err) });
      })
      .finally(() => {
        if (showLoadingBar) bar.done();
      });
    return () => controller.abort();
  }, [attempt, showLoadingBar]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
