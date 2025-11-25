import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-32 bg-background">
        <div className="max-w-[720px] mx-auto px-8 text-center space-y-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-muted/50 mb-6">
            <Clock className="h-12 w-12 text-muted-foreground/60" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
              {title}
            </h1>
            <p className="text-lg text-secondary-label leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <Link to="/early-access">
              <Button size="lg" className="gap-2">
                Get early access
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-tertiary-label">
              Join the waitlist to be notified when this launches
            </p>
          </div>

          <div className="pt-12">
            <Link to="/resources" className="text-sm text-primary hover:text-primary/80 transition-colors">
              ← Browse available resources
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
