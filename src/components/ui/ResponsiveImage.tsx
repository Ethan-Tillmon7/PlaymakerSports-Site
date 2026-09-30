import type { ResponsiveImageData } from '@/lib/responsiveImage';

interface ResponsiveImageProps {
  image: ResponsiveImageData;
  alt: string;
  sizes: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function ResponsiveImage({ image, alt, sizes, className, loading = 'lazy', fetchPriority }: ResponsiveImageProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcset}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      className={className}
    />
  );
}
