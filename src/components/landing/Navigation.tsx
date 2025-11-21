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

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Solutions Dropdown */}
            <div className="relative group">
              <button className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple">
                Solutions
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-apple">
                <div className="bg-white border border-border rounded-xl shadow-apple p-2 min-w-[200px]">
                  <Link 
                    to="/solutions/marketers" 
                    className="block px-4 py-2 text-[14px] text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-apple"
                  >
                    marketing teams
                  </Link>
                  <Link 
                    to="/solutions/sales" 
                    className="block px-4 py-2 text-[14px] text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-apple"
                  >
                    sales teams
                  </Link>
                  <Link 
                    to="/solutions/marketing-ops" 
                    className="block px-4 py-2 text-[14px] text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-apple"
                  >
                    marketing ops
                  </Link>
                  <Link 
                    to="/solutions/developers" 
                    className="block px-4 py-2 text-[14px] text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-apple"
                  >
                    developers
                  </Link>
                </div>
              </div>
            </div>
            
            <a 
              href="/#features" 
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
            >
              Features
            </a>
            <Link 
              to="/pricing" 
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
            >
              About
            </Link>
            <Link 
              to="/docs" 
              className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
            >
              Docs
            </Link>
          </div>

          {/* Right Side CTAs */}
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button 
                variant="ghost" 
                className="text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-transparent px-3"
              >
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="default"
                className="bg-foreground hover:bg-foreground/90 text-background text-[14px] font-medium px-6 h-10 rounded-full transition-apple hover:scale-[1.02] hidden sm:flex"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
