import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ArrowRight } from "lucide-react";

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
      { label: "2026 Salary Report", href: "/resources/reports/salary-benchmark-2026", comingSoon: true },
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
        <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/50 lowercase">
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
              <h3 className="text-sm font-semibold lowercase tracking-wide text-white/90">
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
      </div>
    </footer>
  );
};
