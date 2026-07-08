import type { ResponsiveImageData } from '../../types/image';

interface ResponsiveImageProps {
  image: ResponsiveImageData;
  alt: string;
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ResponsiveImage({ image, alt, sizes, className, loading = 'lazy' }: ResponsiveImageProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcset}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
}
