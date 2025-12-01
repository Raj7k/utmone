import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Extract slug from path (e.g., /abc123 -> abc123)
    const pathSlug = location.pathname.split('/').filter(Boolean)[0];
    if (pathSlug && pathSlug.length > 2 && pathSlug.length < 50) {
      setSlug(pathSlug);
    }
  }, [location.pathname]);

  const handleClaimLink = () => {
    // Navigate to signup with slug pre-filled
    navigate(`/auth?slug=${slug}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Large 404 watermark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[240px] font-display font-extrabold text-foreground/5 pointer-events-none select-none">
          404
        </div>
        
        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground brand-lowercase">
              page not found
            </h1>
            <p className="text-lg md:text-xl text-secondary-label max-w-[600px] mx-auto leading-relaxed">
              the link is fine. the destination isn't.<br />
              let's take you back to where things make sense.
            </p>
          </div>
          
          {/* Growth Hook: Claim Link */}
          {slug && (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <LinkIcon className="h-5 w-5" />
                <p className="font-semibold">This link is available!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Want to claim <span className="font-mono font-semibold text-primary">utm.one/{slug}</span> for your brand?
              </p>
              <Button 
                size="lg" 
                variant="marketing"
                onClick={handleClaimLink}
                className="w-full sm:w-auto"
              >
                claim this link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button size="lg" variant="outline" onClick={() => window.location.href = '/'} className="rounded-full">
            go to homepage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-sm text-secondary-label">
            still stuck? reach us → <a href="mailto:support@utm.one" className="text-primary hover:underline">support@utm.one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
