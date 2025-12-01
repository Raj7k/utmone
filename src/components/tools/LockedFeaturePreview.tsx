import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LockedFeaturePreviewProps {
  title: string;
  description: string;
  previewImage?: ReactNode;
  ctaText?: string;
}

export const LockedFeaturePreview = ({ 
  title, 
  description,
  previewImage,
  ctaText = "unlock with pro" 
}: LockedFeaturePreviewProps) => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            what you're missing
          </h2>
          <p className="text-body text-secondary-label max-w-[640px] mx-auto">
            pro users get access to advanced features that make their workflows effortless.
          </p>
        </div>

        <Card className="p-8 md:p-12 relative overflow-hidden">
          {/* Locked Preview */}
          <div className="relative">
            {/* Blur Overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-background/30 z-10 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-secondary-label">
                  {description}
                </p>
                <Link to="/pricing">
                  <Button size="lg" variant="marketing" className="mt-4">
                    {ctaText} →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview Content (Blurred) */}
            <div className="blur-md pointer-events-none">
              {previewImage || (
                <div className="bg-muted rounded-lg p-12 space-y-4">
                  <div className="h-8 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-64 bg-muted-foreground/10 rounded" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-muted-foreground/20 rounded" />
                    <div className="h-24 bg-muted-foreground/20 rounded" />
                    <div className="h-24 bg-muted-foreground/20 rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
