import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="dark flex min-h-screen items-center justify-center px-4" style={{ background: '#050505' }}>
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Large 404 watermark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[240px] font-display font-extrabold text-white/5 pointer-events-none select-none">
          404
        </div>
        
        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold hero-gradient">
              page not found
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[600px] mx-auto leading-relaxed">
              the link is fine. the destination isn't.<br />
              let's take you back to where things make sense.
            </p>
          </div>
          
          <Button size="lg" onClick={() => window.location.href = '/'} className="rounded-full">
            go to homepage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-sm text-white/60">
            still stuck? reach us → <a href="mailto:support@utm.one" className="text-white hover:underline">support@utm.one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
