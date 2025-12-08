import { ReactNode } from "react";
import { ResourcesNavigation } from "@/components/landing/ResourcesNavigation";
import { ResourcesFooter } from "@/components/landing/ResourcesFooter";

interface ResourcesLayoutProps {
  children: ReactNode;
}

/**
 * ResourcesLayout - Light theme layout for Resources section
 * White background with black text, optimized for reading
 */
export const ResourcesLayout = ({ children }: ResourcesLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      {/* Subtle texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <header role="banner" className="relative z-50">
        <ResourcesNavigation />
      </header>

      <main role="main" className="flex-1 relative z-10">
        {children}
      </main>

      <ResourcesFooter />
    </div>
  );
};
