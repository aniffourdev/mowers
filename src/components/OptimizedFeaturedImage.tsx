import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedFeaturedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}

export const OptimizedFeaturedImage = ({
  src,
  alt,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedFeaturedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      <div
        className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse',
          isLoading ? 'opacity-100' : 'opacity-0'
        )}
      />
      
      {/* Optimized image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={true}
        quality={85}
        sizes={sizes}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
          `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#e5e7eb"/>
          </svg>`
        ).toString('base64')}`}
      />
    </div>
  );
}; 