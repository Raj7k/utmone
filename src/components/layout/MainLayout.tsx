import { ReactNode } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { SemanticFooter } from "./SemanticFooter";

interface MainLayoutProps {
  children: ReactNode;
  showAnnouncement?: boolean;
}

export const MainLayout = ({ children, showAnnouncement = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showAnnouncement && <AnnouncementBar dismissible={true} />}
      
      <header role="banner">
        <Navigation />
        <FloatingNavigation />
      </header>

      <main role="main" className="flex-1">
        {children}
      </main>

      <SemanticFooter />
    </div>
  );
};