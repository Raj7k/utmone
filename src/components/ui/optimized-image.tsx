import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
  /** Explicit width for CLS prevention */
  width?: number;
  /** Explicit height for CLS prevention */
  height?: number;
  /** Priority loading (above-the-fold images) */
  priority?: boolean;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  fallback = "/placeholder.svg",
  aspectRatio,
  className,
  wrapperClassName,
  width,
  height,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={{
        aspectRatio: aspectRatio || undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
};
