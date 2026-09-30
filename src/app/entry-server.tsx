import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import { StrictMode } from 'react';
import App from './App';

// The prelude is a Node Readable (async-iterable of byte chunks). Decode it
// with web-standard TextDecoder so this file needs no Node type definitions.
async function streamToString(stream: AsyncIterable<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  let out = '';
  for await (const chunk of stream) {
    out += decoder.decode(chunk, { stream: true });
  }
  out += decoder.decode();
  return out;
}

// Async prerender (react-dom/static) so lazily-loaded route chunks fully resolve
// into static HTML — renderToString would emit empty Suspense fallbacks instead.
export async function render(url: string): Promise<{ html: string; helmet: HelmetServerState }> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  const html = await streamToString(prelude as unknown as AsyncIterable<Uint8Array>);
  return { html, helmet: helmetContext.helmet! };
}
