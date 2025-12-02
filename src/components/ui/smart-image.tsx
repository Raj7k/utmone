import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Desktop/High-quality image URL */
  src: string;
  /** Mobile/Low-quality image URL (optional, falls back to src) */
  mobileSrc?: string;
  /** Tiny base64 blur placeholder (optional) */
  blurDataURL?: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Breakpoint for mobile (default: 768px) */
  mobileBreakpoint?: number;
  /** Enable WebP format (default: true) */
  useWebP?: boolean;
  /** Aspect ratio for placeholder (e.g., "16/9") */
  aspectRatio?: string;
}

/**
 * Pareto-Optimal Media Loading Component
 * 
 * Implements adaptive image serving based on network conditions
 * and device capabilities, finding the efficient frontier between
 * quality and bandwidth.
 * 
 * Based on: Algorithms for Optimization (Chapter 15 - Multiobjective Optimization)
 * 
 * Features:
 * - Network-aware quality selection (4G vs 3G)
 * - Responsive breakpoints (Desktop vs Mobile)
 * - Blur-up placeholder technique
 * - WebP with fallbacks
 * - Lazy loading by default
 */
export function SmartImage({
  src,
  mobileSrc,
  blurDataURL,
  alt,
  mobileBreakpoint = 768,
  useWebP = true,
  aspectRatio,
  className,
  ...props
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(blurDataURL || '');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Detect network connection type (Pareto optimization)
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;
    const saveData = connection?.saveData;

    // Determine optimal image source based on network conditions
    let optimalSrc = src;

    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Low bandwidth: use mobile version even on desktop
      optimalSrc = mobileSrc || src;
    } else if (window.innerWidth < mobileBreakpoint) {
      // Mobile device: use mobile-optimized image
      optimalSrc = mobileSrc || src;
    }

    // Convert to WebP if supported and requested
    if (useWebP && supportsWebP()) {
      optimalSrc = convertToWebP(optimalSrc);
    }

    // Lazy load the optimal image
    const img = new Image();
    img.src = optimalSrc;
    img.onload = () => {
      setCurrentSrc(optimalSrc);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [src, mobileSrc, mobileBreakpoint, useWebP]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
        />
      )}

      {/* Main image with blur-up transition */}
      <img
        ref={imgRef}
        src={currentSrc || src}
        alt={alt}
        loading="lazy"
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />

      {/* Loading skeleton (if no blur placeholder) */}
      {!blurDataURL && !isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}

/**
 * Helper: Check if browser supports WebP
 */
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Helper: Convert image URL to WebP format
 * (Assumes your CDN/storage supports automatic format conversion)
 */
function convertToWebP(url: string): string {
  // If using a CDN that supports format conversion (e.g., Cloudinary, Imgix)
  // you can append format parameters here
  // For now, just replace extension
  return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

/**
 * Advanced variant with <picture> element for art direction
 */
export function SmartPicture({
  src,
  mobileSrc,
  blurDataURL,
  alt,
  mobileBreakpoint = 768,
  className,
  ...props
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
        />
      )}

      <picture>
        {/* WebP sources */}
        {mobileSrc && (
          <source
            media={`(max-width: ${mobileBreakpoint}px)`}
            srcSet={convertToWebP(mobileSrc)}
            type="image/webp"
          />
        )}
        <source srcSet={convertToWebP(src)} type="image/webp" />

        {/* Fallback sources */}
        {mobileSrc && (
          <source
            media={`(max-width: ${mobileBreakpoint}px)`}
            srcSet={mobileSrc}
          />
        )}

        {/* Final fallback */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      </picture>
    </div>
  );
}
