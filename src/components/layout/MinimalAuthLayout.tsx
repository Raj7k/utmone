import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

interface MinimalAuthLayoutProps {
  children: React.ReactNode;
}

export const MinimalAuthLayout = ({ children }: MinimalAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header with back link and centered logo */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-8">
        {children}
      </main>
    </div>
  );
};
