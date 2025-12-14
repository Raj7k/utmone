import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CleanAuthLayoutProps {
  children: React.ReactNode;
}

export const CleanAuthLayout = ({ children }: CleanAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      {/* Minimal back link */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          back to home
        </Link>
      </div>

      {/* Centered content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
};
