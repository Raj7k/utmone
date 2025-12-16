import { ReactNode, useState, useEffect, lazy, Suspense } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Footer } from "@/components/landing/Footer";

// Lazy load FloatingNavigation - only imported after scroll
const FloatingNavigation = lazy(() => 
  import("@/components/landing/FloatingNavigation").then(m => ({ default: m.FloatingNavigation }))
);

interface MainLayoutProps {
  children: ReactNode;
  showAnnouncement?: boolean;
}

export const MainLayout = ({ children, showAnnouncement = true }: MainLayoutProps) => {
  const [showFloating, setShowFloating] = useState(false);

  // Single scroll listener - only loads FloatingNavigation after 500px scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500 && !showFloating) {
        setShowFloating(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showFloating]);

  return (
    <div className="dark marketing-root min-h-screen flex flex-col relative bg-[#050505]">
      {/* Noise Texture - CSS pseudo-element via class, no inline SVG parsing */}
      <div className="marketing-noise-overlay" aria-hidden="true" />

      {/* Spotlight - deferred render, uses CSS contain for paint isolation */}
      <div 
        className="marketing-spotlight"
        aria-hidden="true"
      />

      {/* Vertical Center Axis Line - lightweight CSS only */}
      <div 
        className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-[2] hidden lg:block bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
        aria-hidden="true"
      />

      {showAnnouncement && <AnnouncementBar dismissible={true} />}
      
      <header role="banner" className="relative z-50">
        <Navigation />
        {/* FloatingNavigation lazy-loaded only after scroll */}
        {showFloating && (
          <Suspense fallback={null}>
            <FloatingNavigation />
          </Suspense>
        )}
      </header>

      <main role="main" className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
