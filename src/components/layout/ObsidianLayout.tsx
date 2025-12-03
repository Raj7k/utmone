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
    <div className="min-h-screen flex flex-col relative selection:bg-white selection:text-black">
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 relative z-10">
        {children}
      </main>

      {/* Global Lighting Rig - Subtle top glow */}
      {showLighting && (
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      )}
    </div>
  );
};

export default ObsidianLayout;
