import { ReactNode, useState, useEffect } from "react";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Copy, Check, ArrowLeft, Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TOCSection {
  id: string;
  title: string;
  number: string;
  subtitle?: string;
}

interface Author {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
}

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  readTime: string;
  lastUpdated?: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  children: ReactNode;
  relatedResources?: Array<{ title: string; href: string; description: string }>;
  tableOfContents?: TOCSection[];
  backLink?: string;
  backLabel?: string;
  author?: Author;
  publishedDate?: string;
}

// Section Navigation Cards - horizontal card-based TOC matching stats dashboard style
const SectionNavCards = ({ 
  sections, 
  activeSection, 
  scrollToSection 
}: { 
  sections: TOCSection[]; 
  activeSection: string;
  scrollToSection: (id: string) => void;
}) => {
  return (
    <div className="not-prose mb-12">
      <div className="flex items-center gap-3 mb-4">
        <List className="w-5 h-5 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Jump to section</span>
      </div>
      
      {/* Horizontal scroll on mobile, grid on larger screens */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:overflow-visible md:pb-0">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                flex-shrink-0 snap-start
                w-[160px] md:w-auto
                p-4 rounded-xl border text-left
                transition-all duration-200
                group
                ${isActive 
                  ? 'bg-zinc-900 border-zinc-900 shadow-lg' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                }
              `}
            >
              {/* Section Number */}
              <span className={`
                text-xs font-bold block mb-2
                ${isActive ? 'text-zinc-400' : 'text-zinc-300 group-hover:text-zinc-400'}
              `}>
                {section.number}
              </span>
              
              {/* Section Title */}
              <span className={`
                text-sm font-semibold block leading-tight
                ${isActive ? 'text-white' : 'text-zinc-900'}
              `}>
                {section.title}
              </span>
              
              {/* Section Subtitle */}
              {section.subtitle && (
                <span className={`
                  text-xs block mt-1.5 leading-relaxed line-clamp-2
                  ${isActive ? 'text-zinc-400' : 'text-zinc-500'}
                `}>
                  {section.subtitle}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const GuideLayout = ({
  title,
  subtitle,
  readTime,
  lastUpdated,
  breadcrumbs,
  children,
  relatedResources,
  tableOfContents,
  backLink,
  backLabel,
  author,
  publishedDate
}: GuideLayoutProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Update active section for TOC
      if (tableOfContents) {
        const scrollPosition = window.scrollY + 200;
        for (let i = tableOfContents.length - 1; i >= 0; i--) {
          const section = document.getElementById(tableOfContents[i].id);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(tableOfContents[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          {/* Back Navigation */}
          {backLink && backLabel && (
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          )}
          
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

          {/* Author Section */}
          {author && (
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={author.avatarUrl} 
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200"
              />
              <div>
                <div className="font-semibold text-zinc-900">{author.name}</div>
                <div className="text-sm text-zinc-500">{author.role}, {author.company}</div>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8">
            <span>{readTime}</span>
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Published {publishedDate}
              </span>
            )}
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
          {/* Section Navigation Cards */}
          {tableOfContents && tableOfContents.length > 0 && (
            <SectionNavCards 
              sections={tableOfContents} 
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            />
          )}

          {/* Main Content - Full Width */}
          <article className="prose prose-zinc prose-lg max-w-none">
            {children}
          </article>

          {/* Related Resources - shown when no TOC */}
          {(!tableOfContents || tableOfContents.length === 0) && relatedResources && relatedResources.length > 0 && (
            <aside className="mt-12 pt-12 border-t border-zinc-200">
              <h3 className="text-lg font-display font-semibold text-zinc-900 mb-6">
                Related Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </aside>
          )}
        </div>
      </section>
    </ResourcesLayout>
  );
};