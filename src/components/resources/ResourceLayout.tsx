import { ReactNode, useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ResourceLayoutProps {
  type: "guide" | "playbook" | "framework" | "checklist" | "template" | "example";
  title: string;
  subtitle: string;
  readTime?: string;
  lastUpdated?: string;
  badges?: Array<{ text: string; variant?: "default" | "secondary" | "outline" }>;
  breadcrumbs: Array<{ label: string; href: string }>;
  children: ReactNode;
  relatedResources?: Array<{ title: string; href: string; description: string }>;
  showProgress?: boolean;
}

export const ResourceLayout = ({
  type,
  title,
  subtitle,
  readTime,
  lastUpdated,
  badges = [],
  breadcrumbs,
  children,
  relatedResources,
  showProgress = true
}: ResourceLayoutProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showProgress) return;
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showProgress]);

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
    <MainLayout showAnnouncement={false}>
      {/* Reading Progress Bar */}
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
          <div 
            className="h-full transition-all duration-150"
            style={{ width: `${scrollProgress}%`, background: 'rgba(59,130,246,1)' }}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link to={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={badge.variant || "default"}
                  className={badge.text === "NEW" ? "animate-pulse" : ""}
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-[800px] mb-8">
            {subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 mb-8">
            {readTime && <span>{readTime}</span>}
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTwitterShare}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInShare}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className={`prose prose-invert prose-lg max-w-none ${relatedResources && relatedResources.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}`}>
              {children}
            </article>

            {/* Sidebar - Related Resources */}
            {relatedResources && relatedResources.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <h3 className="text-lg font-display font-semibold text-white">
                    Related Resources
                  </h3>
                  <div className="space-y-4">
                    {relatedResources.map((resource) => (
                      <Link
                        key={resource.href}
                        to={resource.href}
                        className="block p-4 bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300"
                      >
                        <h4 className="font-semibold text-white mb-2">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-white/60">
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
    </MainLayout>
  );
};
