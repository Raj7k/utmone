import { ReactNode, useState, useEffect } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  readTime: string;
  lastUpdated?: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  children: ReactNode;
  relatedResources?: Array<{ title: string; href: string; description: string }>;
}

export const GuideLayout = ({
  title,
  subtitle,
  readTime,
  lastUpdated,
  breadcrumbs,
  children,
  relatedResources
}: GuideLayoutProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = `Just read: ${title} on @utmone`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 z-50">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link to={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground mb-6">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
            {subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <span>{readTime}</span>
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTwitterShare}
              className="gap-2"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInShare}
              className="gap-2"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8 prose prose-lg max-w-none">
              {children}
            </article>

            {/* Sidebar - Related Resources */}
            {relatedResources && relatedResources.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <h3 className="text-lg font-display font-semibold text-foreground">
                    Related Resources
                  </h3>
                  <div className="space-y-4">
                    {relatedResources.map((resource) => (
                      <Link
                        key={resource.href}
                        to={resource.href}
                        className="block p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all"
                      >
                        <h4 className="font-semibold text-foreground mb-2">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-[13px] text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};