import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { formatText } from "@/utils/textFormatter";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="max-w-[1280px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12">
          
          {/* Brand Column (spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <UtmOneLogo size="lg" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              utm.one gives every link a meaning machines can understand and humans can trust.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground/90">
              {formatText("product")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/features/short-links" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Short Links
                </Link>
              </li>
              <li>
                <Link to="/features/utm-builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  UTM Builder
                </Link>
              </li>
              <li>
                <Link to="/features/qr-generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link to="/features/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/features/governance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Enterprise Control
                </Link>
              </li>
              <li>
                <Link to="/permanence" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Permanence Guarantee
                </Link>
              </li>
              <li>
                <Link to="/#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground/90">
              {formatText("solutions")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/marketers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  For Marketers
                </Link>
              </li>
              <li>
                <Link to="/solutions/sales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  For Sales
                </Link>
              </li>
              <li>
                <Link to="/solutions/marketing-ops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  For Marketing Ops
                </Link>
              </li>
              <li>
                <Link to="/solutions/developers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  For Developers
                </Link>
              </li>
              <li>
                <Link to="/solutions/partner-managers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  For Partner Managers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground/90">
              {formatText("resources")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/playbooks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Playbooks
                </Link>
              </li>
              <li>
                <Link to="/resources/playbooks/llm-ranking" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  LLM Ranking Playbook →
                </Link>
              </li>
              <li>
                <Link to="/resources/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/resources/frameworks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Frameworks
                </Link>
              </li>
              <li>
                <Link to="/resources/glossary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50 cursor-not-allowed flex items-center gap-2">
                  2026 Salary Report
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Coming Soon</span>
                </span>
              </li>
              <li>
                <Link to="/resources/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground/90">
              {formatText("company")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <a href="mailto:hello@utm.one" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground/90">
              {formatText("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/data-security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Data & Security
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/acceptable-use" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link to="/legal/subprocessors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Subprocessors
                </Link>
              </li>
              <li>
                <Link to="/legal/dpa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  DPA
                </Link>
              </li>
              <li>
                <Link to="/legal/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/permanence-terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Permanence Guarantee
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/50 text-center space-y-4">
          <p className="text-sm text-muted-foreground font-medium">
            clarity creates confidence.
          </p>
          
          {/* Social Links */}
          <a 
            href="https://www.linkedin.com/company/utmone/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Follow utm.one on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          
          <p className="text-xs text-muted-foreground/60">
            © 2025 utm.one. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
