import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LinkExpired() {
  return (
    <div className="dark min-h-screen flex items-center justify-center p-4" style={{ background: '#050505' }}>
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-900/30">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold hero-gradient">
            link expired
          </h1>
          <p className="text-lg text-white/60">
            this short link has been removed or is no longer active
          </p>
          <p className="text-sm text-white/60">
            if you believe this is an error, please contact the link owner
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              go home
            </Link>
          </Button>
        </div>

        {/* Branding */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/60">
            powered by{" "}
            <a 
              href="https://utm.one" 
              className="text-white hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              utm.one
            </a>
          </p>
          <p className="text-xs text-white/40 mt-2">
            enterprise link management with safety nets
          </p>
        </div>
      </div>
    </div>
  );
}