import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const ROUTES = ['/', '/events', '/apparel', '/about', '/faq', '/contact'];

interface HelmetState {
  title: { toString(): string };
  meta: { toString(): string };
  link: { toString(): string };
  script: { toString(): string };
}

async function prerender() {
  const entryUrl = pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href;
  const { render } = (await import(entryUrl)) as {
    render: (url: string) => Promise<{ html: string; helmet: HelmetState }>;
  };

  const template = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf-8');

  for (const route of ROUTES) {
    const { html, helmet } = await render(route);

    const headTags = [
      helmet?.title?.toString() ?? '',
      helmet?.meta?.toString() ?? '',
      helmet?.link?.toString() ?? '',
      helmet?.script?.toString() ?? '',
    ].filter(Boolean).join('\n    ');

    const output = template
      .replace('<!--app-head-->', headTags)
      .replace('<!--app-html-->', html);

    const outPath = route === '/'
      ? path.join(root, 'dist/index.html')
      : path.join(root, `dist${route}/index.html`);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output);
    console.log(`  prerendered: ${route}`);
  }

  console.log('\nPrerender complete.');
}

prerender().catch((err: unknown) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
