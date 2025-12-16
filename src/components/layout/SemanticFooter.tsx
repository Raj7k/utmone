import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

const footerSections: FooterSection[] = [
  {
    title: "features",
    links: [
      { label: "short links", href: "/features/short-links" },
      { label: "UTM builder", href: "/features/utm-builder" },
      { label: "AI Revenue Intelligence", href: "/intelligence" },
      { label: "AI QR", href: "/features/qr-generator" },
      { label: "brick QR", href: "/features/brick-builder" },
      { label: "link pages", href: "/features/link-pages" },
      { label: "event halo", href: "/features/event-halo" },
      { label: "analytics", href: "/features/analytics" },
      { label: "custom domains", href: "/features/custom-domains" },
      { label: "workspaces", href: "/features/workspaces" },
      { label: "sentinel mode", href: "/features/sentinel" },
      { label: "clean track", href: "/features/clean-track" },
      { label: "smart routing", href: "/features/smart-routing" },
    ],
  },
  {
    title: "resources",
    links: [
      { label: "documentation", href: "/docs" },
      { label: "referral playbook", href: "/resources/playbooks/hr-katalyst-referral" },
      { label: "blog", href: "/blog" },
      { label: "changelog", href: "/changelog" },
      { label: "support", href: "/support" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "about", href: "/about" },
      { label: "contact", href: "/contact" },
      { label: "careers", href: "/careers" },
      { label: "pricing", href: "/pricing" },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "privacy policy", href: "/legal/privacy" },
      { label: "terms of service", href: "/legal/terms" },
      { label: "data & security", href: "/legal/security" },
      { label: "DPA", href: "/legal/dpa" },
    ],
  },
];

const CollapsibleSection = ({ section }: { section: FooterSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border md:border-none">
      {/* Mobile: Collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 md:hidden"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-foreground">{section.title}</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Desktop: Always visible header */}
      <h3 className="hidden md:block font-semibold text-foreground mb-4">
        {section.title}
      </h3>

      {/* Links - collapsible on mobile, always visible on desktop */}
      <ul
        className={cn(
          "space-y-2 overflow-hidden transition-all duration-300 md:!max-h-none md:!opacity-100 md:!pb-0",
          isOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0"
        )}
      >
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors block py-1 md:py-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SemanticFooter = () => {
  const currentDate = new Date();
  const lastUpdated = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  return (
    <footer
      className="bg-muted/20 border-t border-border mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Mobile: Collapsible sections | Desktop: Grid */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 mb-8">
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={`${section.title} navigation`}>
              <CollapsibleSection section={section} />
            </nav>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 pb-20 md:pb-0 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <UtmOneLogo size="sm" />
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © {currentDate.getFullYear()} utm.one. all rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>
        
        {/* Mobile fade gradient indicating floating nav overlay */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-40 md:hidden"
          style={{
            background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)) 30%, transparent 100%)'
          }}
          aria-hidden="true"
        />
      </div>
    </footer>
  );
};