import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ArrowRight, Waves, ChevronRight } from "lucide-react";
import { FooterRevealText } from "./FooterRevealText";
import { Button } from "@/components/ui/button";

interface FooterLink {
  label: string;
  href: string;
  featured?: boolean;
  comingSoon?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "product",
    links: [
      { label: "Short Links", href: "/features/short-links", featured: true },
      { label: "UTM Builder", href: "/features/utm-builder", featured: true },
      { label: "QR Generator", href: "/features/qr-generator", featured: true },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Analytics", href: "/features/analytics" },
      { label: "Enterprise Control", href: "/features/enterprise-control" },
      { label: "Permanence", href: "/permanence" },
      { label: "Integrations", href: "/features/integrations" },
    ],
  },
  {
    title: "solutions",
    links: [
      { label: "For Marketers", href: "/solutions/marketers" },
      { label: "For Sales", href: "/solutions/sales" },
      { label: "For Marketing Ops", href: "/solutions/marketing-ops" },
      { label: "For Developers", href: "/solutions/developers" },
      { label: "For Partners", href: "/solutions/partner-managers" },
      { label: "For RevOps", href: "/solutions/revops" },
      { label: "For Startups", href: "/solutions/startups" },
      { label: "For Agencies", href: "/solutions/agencies" },
    ],
  },
  {
    title: "resources",
    links: [
      { label: "Guides", href: "/resources/guides" },
      { label: "Playbooks", href: "/resources/playbooks" },
      { label: "LLM Ranking Playbook", href: "/resources/playbooks/llm-ranking", featured: true },
      { label: "Templates", href: "/resources/templates" },
      { label: "Frameworks", href: "/resources/frameworks" },
      { label: "Glossary", href: "/resources/glossary" },
      { label: "State of GTM Insights 2026", href: "/resources/reports/gtm-insights-2026", comingSoon: true },
      { label: "Tools", href: "/tools" },
      { label: "Docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "compare",
    links: [
      { label: "vs Bitly", href: "/compare/bitly" },
      { label: "vs Rebrandly", href: "/compare/rebrandly" },
      { label: "vs Short.io", href: "/compare/short-io" },
      { label: "vs Bl.ink", href: "/compare/blink" },
      { label: "vs Rewardful", href: "/compare/rewardful" },
      { label: "vs Partnerstack", href: "/compare/partnerstack" },
      { label: "vs Firstpromoter", href: "/compare/firstpromoter" },
      { label: "vs Tolt", href: "/compare/tolt" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "About", href: "/about" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/support" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Data & Security", href: "/legal/data-security" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Acceptable Use", href: "/legal/acceptable-use" },
      { label: "Subprocessors", href: "/legal/subprocessors" },
      { label: "DPA", href: "/legal/dpa" },
      { label: "Support Policy", href: "/legal/support" },
      { label: "Permanence", href: "/legal/permanence-terms" },
    ],
  },
];

const FooterLinkItem = ({ link }: { link: FooterLink }) => {
  return (
    <Link
      to={link.href}
      className={`group flex items-center gap-1.5 text-sm transition-all duration-200 hover:translate-x-1 ${
        link.featured 
          ? "text-white/90 hover:text-white" 
          : "text-white/50 hover:text-white/80"
      }`}
    >
      <span>{link.label}</span>
      {link.featured && (
        <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      )}
      {link.comingSoon && (
        <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/50">
          soon
        </span>
      )}
    </Link>
  );
};

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[hsl(var(--obsidian-bg))]">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Platinum Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-20 relative z-10">
        {/* New Feature Highlight - Event Halo */}
        <div className="mb-12 p-5 md:p-6 rounded-2xl border border-white/20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Waves className="w-6 h-6 text-white/80" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white/90">event halo</h3>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/20 text-white animate-pulse">NEW</span>
              </div>
              <p className="text-sm text-white/50">track the invisible 90% from every offline event — measure booth traffic, calculate halo lift, prove event ROI</p>
            </div>
            <Link to="/features/event-halo" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                learn more <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-6">
            <UtmOneLogo size="md" />
            <p className="text-sm leading-relaxed text-white/50 max-w-[200px]">
              utm.one gives every link a meaning machines can understand and humans can trust.
            </p>
          </div>

          {/* Link Columns */}
          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-white/90">
                {column.title}
              </h3>
              <div className="space-y-2.5">
                {column.links.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} utm.one
          </p>
          
          {/* Role Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40">
            <Link to="/solutions/marketers" className="hover:text-white/70 transition-colors">marketing</Link>
            <span className="text-white/20">·</span>
            <Link to="/solutions/sales" className="hover:text-white/70 transition-colors">sales</Link>
            <span className="text-white/20">·</span>
            <Link to="/solutions/marketing-ops" className="hover:text-white/70 transition-colors">ops</Link>
            <span className="text-white/20">·</span>
            <Link to="/solutions/developers" className="hover:text-white/70 transition-colors">dev</Link>
            <span className="text-white/20">·</span>
            <Link to="/solutions/revops" className="hover:text-white/70 transition-colors">revops</Link>
            <span className="text-white/20">·</span>
            <Link to="/solutions/reporting-team" className="hover:text-white/70 transition-colors">reporting</Link>
          </div>
        </div>

      {/* Massive Brand Reveal - Full Bleed */}
      <div className="mt-24 pt-8 -mx-6 md:-mx-8 lg:-mx-[calc((100vw-1400px)/2+2rem)]">
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <FooterRevealText />
        </div>
      </div>
      </div>
    </footer>
  );
};
