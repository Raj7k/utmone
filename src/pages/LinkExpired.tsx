import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LinkExpired() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            link expired
          </h1>
          <p className="text-lg text-muted-foreground">
            this short link has been removed or is no longer active
          </p>
          <p className="text-sm text-muted-foreground">
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
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            powered by{" "}
            <a 
              href="https://utm.one" 
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              utm.one
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            enterprise link management with safety nets
          </p>
        </div>
      </div>
    </div>
  );
}