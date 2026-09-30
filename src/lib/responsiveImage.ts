export interface ResponsiveImageData {
  src: string; // fallback single URL (largest generated width)
  srcset: string; // "url 128w, url 320w, url 640w, url 1024w"
  width: number; // intrinsic width of the fallback src
  height: number; // intrinsic height of the fallback src
}

/** One entry per generated width from a vite-imagetools `as=meta:src;width;height;format` import. */
export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Collapse a vite-imagetools `as=meta:…` array (one entry per generated width)
 * into a single ResponsiveImageData with a `srcset` and a largest-width fallback.
 */
export function toResponsive(meta: ImageMetadata[]): ResponsiveImageData {
  const sorted = [...meta].sort((a, b) => a.width - b.width);
  const srcset = sorted.map((m) => `${m.src} ${m.width}w`).join(', ');
  const fallback = sorted[sorted.length - 1];
  return { src: fallback.src, srcset, width: fallback.width, height: fallback.height };
}
