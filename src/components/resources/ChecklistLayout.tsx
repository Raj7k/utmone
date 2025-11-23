import { ReactNode } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";

interface RelatedResource {
  title: string;
  href: string;
}

interface ChecklistLayoutProps {
  title: string;
  description: string;
  totalItems: number;
  estimatedTime: string;
  frequency: string;
  children: ReactNode;
  relatedResources: RelatedResource[];
  storageKey: string;
}

export const ChecklistLayout = ({
  title,
  description,
  totalItems,
  estimatedTime,
  frequency,
  children,
  relatedResources,
}: ChecklistLayoutProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <span className="px-4 py-2 rounded-full bg-muted text-foreground text-sm font-medium">
              {totalItems} items
            </span>
            <span className="px-4 py-2 rounded-full bg-muted text-foreground text-sm font-medium">
              {estimatedTime}
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {frequency}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 print:hidden">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Checklist
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Checklist Content */}
            <div>{children}</div>

            {/* Related Resources Sidebar */}
            <aside className="print:hidden">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl border border-border/50 p-6 bg-card">
                  <h3 className="font-display font-semibold text-foreground mb-4">
                    Related Resources
                  </h3>
                  <div className="space-y-3">
                    {relatedResources.map((resource, index) => (
                      <Link
                        key={index}
                        to={resource.href}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        → {resource.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="rounded-2xl border border-border/50 p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    Automate Your Checks
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    utm.one validates tracking automatically, so you can focus on building campaigns.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/early-access">Get Early Access</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
