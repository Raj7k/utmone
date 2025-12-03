import React from "react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";

interface ObsidianMarketingLayoutProps {
  children: React.ReactNode;
  showFloatingNav?: boolean;
}

/**
 * ObsidianMarketingLayout - Global wrapper for all marketing/landing pages
 * 
 * Enforces the "Obsidian & Platinum" design system:
 * - Obsidian Base: Warm black #050505
 * - Noise Texture: Film grain overlay for physical depth
 * - Center Axis: Precision spine
 * - Moonlight Spotlight: Cool white/blue glow from top
 * - Navigation & Footer included
 */
export const ObsidianMarketingLayout = ({ 
  children, 
  showFloatingNav = true 
}: ObsidianMarketingLayoutProps) => {
  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Noise Texture Overlay - Film Grain for "Physical" texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Center Axis - "Spine of Precision" */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent 100%)'
        }}
      />

      {/* Primary Spotlight - Cool White/Blue "Moonlight" */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)'
        }}
      />

      <Navigation />
      {showFloatingNav && <FloatingNavigation />}
      
      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default ObsidianMarketingLayout;
