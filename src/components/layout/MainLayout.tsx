import { ReactNode } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Footer } from "@/components/landing/Footer";

interface MainLayoutProps {
  children: ReactNode;
  showAnnouncement?: boolean;
}

export const MainLayout = ({ children, showAnnouncement = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#050505' }}>
      {/* Fixed Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Cool White/Blue Spotlight at Top */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)',
        }}
      />

      {/* Vertical Center Axis Line */}
      <div 
        className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-[2] hidden lg:block"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.03) 80%, transparent)'
        }}
      />

      {showAnnouncement && <AnnouncementBar dismissible={true} />}
      
      <header role="banner" className="relative z-50">
        <Navigation />
        <FloatingNavigation />
      </header>

      <main role="main" className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};
