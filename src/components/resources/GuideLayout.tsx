import { ReactNode, useState, useEffect } from "react";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Copy, Check } from "lucide-react";
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
    <ResourcesLayout>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-200 z-50">
        <div 
          className="h-full transition-all duration-150 bg-zinc-900"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="py-20 border-b border-zinc-200">
        <div className="max-w-[1200px] mx-auto px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link to={crumb.href} className="hover:text-zinc-900 transition-colors">
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900 mb-6">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-600 max-w-[800px] mb-8">
            {subtitle}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8">
            <span>{readTime}</span>
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTwitterShare}
              className="gap-2 border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInShare}
              className="gap-2 border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2 border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
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
            <article className="lg:col-span-8 prose prose-zinc prose-lg max-w-none">
              {children}
            </article>

            {/* Sidebar - Related Resources */}
            {relatedResources && relatedResources.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <h3 className="text-lg font-display font-semibold text-zinc-900">
                    Related Resources
                  </h3>
                  <div className="space-y-4">
                    {relatedResources.map((resource) => (
                      <Link
                        key={resource.href}
                        to={resource.href}
                        className="block p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all"
                      >
                        <h4 className="font-semibold text-zinc-900 mb-2">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-zinc-500">
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
    </ResourcesLayout>
  );
};
