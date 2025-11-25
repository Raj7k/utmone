import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Info } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RelatedTool {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  relatedTools?: RelatedTool[];
}

export const ToolLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  relatedTools 
}: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-secondary-label">
            <Link to="/resources" className="hover:text-foreground transition-apple">
              resources
            </Link>
            <span>/</span>
            <Link to="/resources/tools" className="hover:text-foreground transition-apple">
              tools
            </Link>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-xl text-secondary-label max-w-[640px]">
            {description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Content Area */}
            <div className="space-y-8">
              {children}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {relatedTools && relatedTools.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-display font-bold mb-4 text-foreground">
                    related tools
                  </h3>
                  <div className="space-y-3">
                    {relatedTools.map((tool) => (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <tool.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm flex-1 group-hover:text-primary transition-colors">
                          {tool.title}
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Data Sources:</strong> Salary benchmarks based on aggregated data from 1,000+ companies across marketing and sales operations roles.
                </AlertDescription>
              </Alert>

              <Card className="p-6 bg-muted/30 border-border/50 opacity-60 pointer-events-none">
                <h3 className="text-lg font-display font-bold mb-2 text-foreground">
                  2026 salary report
                </h3>
                <p className="text-sm text-secondary-label mb-4">
                  comprehensive salary data — coming soon
                </p>
                <Badge className="bg-muted text-muted-foreground border border-border">
                  Coming Soon
                </Badge>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};