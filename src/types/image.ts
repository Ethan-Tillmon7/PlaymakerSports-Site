export interface ResponsiveImageData {
  src: string; // fallback single URL (largest generated width)
  srcset: string; // "url 128w, url 320w, url 640w, url 1024w"
  width: number; // intrinsic width of the fallback src
  height: number; // intrinsic height of the fallback src
}
