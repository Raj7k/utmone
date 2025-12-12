import * as React from "react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { cn } from "@/lib/utils";

interface LazyAvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

/**
 * LazyAvatar - Avatar with lazy loading for better performance
 * Uses native loading="lazy" to defer off-screen avatar loading
 */
export const LazyAvatar = React.forwardRef<HTMLSpanElement, LazyAvatarProps>(
  ({ src, alt = "", fallback, className, size = "md" }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
      <Avatar ref={ref} className={cn(sizeClasses[size], className)}>
        {src && !hasError ? (
          <AvatarImage
            src={src}
            alt={alt}
            // @ts-ignore - loading is valid but not in types
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "transition-opacity duration-200",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null}
        <AvatarFallback className="text-xs">
          {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
    );
  }
);

LazyAvatar.displayName = "LazyAvatar";
