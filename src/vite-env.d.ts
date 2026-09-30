/// <reference types="vite/client" />

declare module '*.svg?raw' {
  const content: string;
  export default content;
}

// vite-imagetools: `?...&as=meta:src;width;height;format` returns intrinsic dimensions +
// generated src per width. Always whitelist the keys: bare `as=metadata` also inlines each
// photo's full EXIF/XMP text into the JS chunk (it ballooned Apparel to 2 MB).
declare module '*&as=meta:src;width;height;format' {
  const metadata: { src: string; width: number; height: number; format: string }[];
  export default metadata;
}
