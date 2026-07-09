/// <reference types="vite/client" />

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

// vite-imagetools: `?...&as=metadata` returns intrinsic dimensions + generated src per width.
declare module '*&as=metadata' {
  const metadata: { src: string; width: number; height: number; format: string }[];
  export default metadata;
}
