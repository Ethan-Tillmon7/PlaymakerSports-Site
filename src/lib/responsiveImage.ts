import type { ResponsiveImageData } from '../types/image';

interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Collapse a vite-imagetools `as=metadata` array (one entry per generated width)
 * into a single ResponsiveImageData with a `srcset` and a largest-width fallback.
 */
export function toResponsive(meta: ImageMetadata[]): ResponsiveImageData {
  const sorted = [...meta].sort((a, b) => a.width - b.width);
  const srcset = sorted.map((m) => `${m.src} ${m.width}w`).join(', ');
  const fallback = sorted[sorted.length - 1];
  return { src: fallback.src, srcset, width: fallback.width, height: fallback.height };
}
