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
    <div className="dark min-h-screen flex flex-col relative bg-[#050505]">
      {/* Fixed Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Cool White/Blue Spotlight at Top */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2] bg-[radial-gradient(ellipse_at_center_top,_hsl(0_0%_100%_/_0.06)_0%,_hsl(220_50%_90%_/_0.03)_30%,_transparent_70%)]"
      />

      {/* Vertical Center Axis Line */}
      <div 
        className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-[2] hidden lg:block bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
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
