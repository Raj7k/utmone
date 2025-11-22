import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-8 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-[17px] font-semibold tracking-tight text-foreground">
              utm.one
            </span>
          </Link>

          {/* Right: Status + CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="w-2 h-2 bg-accent-yellow-green rounded-full animate-pulse" />
              <span>open for early access</span>
            </div>
            <Link to="/early-access">
              <Button 
                variant="glow-pink"
                size="sm"
                className="font-medium rounded-full"
              >
                get early access
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
