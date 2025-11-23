import { Link } from "react-router-dom";
import utmOneLogo from "@/assets/utm-one-logo.svg";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="max-w-[1280px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          
          {/* Brand Column (spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <img src={utmOneLogo} alt="utm.one" className="h-10 w-auto" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              utm.one gives every link a meaning machines can understand and humans can trust.
            </p>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              Product
            </h3>
            <ul className="space-y-3">
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
                <Link to="/#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              Solutions
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
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              Resources
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
                <Link to="/resources/reports/salary-benchmark-2026" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  2026 Salary Report
                </Link>
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              Company
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
                <Link to="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  terms
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  data & security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/50 text-center space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            clarity creates confidence.
          </p>
          <p className="text-xs text-muted-foreground/60">
            © 2025 utm.one. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
