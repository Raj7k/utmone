import React from "react";

interface ObsidianLayoutProps {
  children: React.ReactNode;
  showLighting?: boolean;
}

/**
 * ObsidianLayout - The "Unibody" wrapper for Obsidian System pages
 * 
 * Enforces:
 * - Max content width (1400px)
 * - Consistent padding
 * - Global lighting rig
 * - Selection styling
 */
export const ObsidianLayout = ({ children, showLighting = true }: ObsidianLayoutProps) => {
  return (
    <div 
      className="min-h-screen flex flex-col relative selection:bg-white selection:text-black"
      style={{ background: '#050505' }}
    >
      {/* Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 relative z-10">
        {children}
      </main>

      {/* Global Lighting Rig - Subtle top glow */}
      {showLighting && (
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
};

export default ObsidianLayout;
