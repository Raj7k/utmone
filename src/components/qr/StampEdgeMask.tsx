import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StampEdgeMaskProps {
  children: ReactNode;
  className?: string;
  size?: number;
}

/**
 * Creates a postage stamp perforated edge effect using CSS mask
 */
export function StampEdgeMask({ children, className, size = 320 }: StampEdgeMaskProps) {
  // Generate SVG mask for perforated stamp edges
  const circleRadius = 6;
  const circleSpacing = 16;
  const padding = 8;
  
  // Calculate number of circles per side
  const circlesPerSide = Math.floor((size - padding * 2) / circleSpacing);
  
  // Generate circles for each edge
  const generateEdgeCircles = () => {
    const circles: string[] = [];
    
    // Top edge
    for (let i = 0; i <= circlesPerSide; i++) {
      const x = padding + (i * circleSpacing);
      circles.push(`<circle cx="${x}" cy="${circleRadius}" r="${circleRadius}" fill="black"/>`);
    }
    
    // Bottom edge
    for (let i = 0; i <= circlesPerSide; i++) {
      const x = padding + (i * circleSpacing);
      circles.push(`<circle cx="${x}" cy="${size - circleRadius}" r="${circleRadius}" fill="black"/>`);
    }
    
    // Left edge
    for (let i = 1; i < circlesPerSide; i++) {
      const y = padding + (i * circleSpacing);
      circles.push(`<circle cx="${circleRadius}" cy="${y}" r="${circleRadius}" fill="black"/>`);
    }
    
    // Right edge
    for (let i = 1; i < circlesPerSide; i++) {
      const y = padding + (i * circleSpacing);
      circles.push(`<circle cx="${size - circleRadius}" cy="${y}" r="${circleRadius}" fill="black"/>`);
    }
    
    return circles.join('');
  };

  const maskSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      <defs>
        <mask id="stampMask">
          <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
          ${generateEdgeCircles()}
        </mask>
      </defs>
      <rect x="0" y="0" width="${size}" height="${size}" fill="white" mask="url(#stampMask)"/>
    </svg>
  `.trim();

  const maskDataUri = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: maskDataUri,
        maskImage: maskDataUri,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Alternative stamp edge using CSS border-image for simpler implementation
 */
export function StampBorder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Perforated edge effect using repeated radial gradients */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 0 0, transparent 5px, hsl(var(--card)) 5px, hsl(var(--card)) 8px, transparent 8px),
            radial-gradient(circle at 100% 0, transparent 5px, hsl(var(--card)) 5px, hsl(var(--card)) 8px, transparent 8px),
            radial-gradient(circle at 0 100%, transparent 5px, hsl(var(--card)) 5px, hsl(var(--card)) 8px, transparent 8px),
            radial-gradient(circle at 100% 100%, transparent 5px, hsl(var(--card)) 5px, hsl(var(--card)) 8px, transparent 8px)
          `,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 100% 0, 0 100%, 100% 100%',
          backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
        }}
      />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
