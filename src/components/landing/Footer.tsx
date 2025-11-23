import { Link } from "react-router-dom";
import utmOneLogo from "@/assets/utm-one-logo.svg";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="max-w-[1280px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
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
              product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  how it works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  features
                </Link>
              </li>
              <li>
                <Link to="/#governance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  link governance
                </Link>
              </li>
              <li>
                <Link to="/resources/guides/utm-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  naming system
                </Link>
              </li>
              <li>
                <Link to="/resources/frameworks/clean-track-model" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LLM metadata
                </Link>
              </li>
              <li>
                <Link to="/#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  integrations
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  docs
                </Link>
              </li>
              <li>
                <Link to="/resources/academy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  tutorials
                </Link>
              </li>
              <li>
                <Link to="/resources/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  templates
                </Link>
              </li>
              <li>
                <Link to="/resources/guides/tracking-architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  taxonomy guide
                </Link>
              </li>
              <li>
                <Link to="/resources/playbooks/naming-convention-playbook" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  campaign naming framework
                </Link>
              </li>
              <li>
                <Link to="/resources/guides/llm-seo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LLM ranking playbook
                </Link>
              </li>
              <li>
                <Link to="/resources/playbooks/ai-marketing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI playbook
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  about
                </Link>
              </li>
              <li>
                <Link to="/about#philosophy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  brand philosophy
                </Link>
              </li>
              <li>
                <Link to="/about#design" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  design system
                </Link>
              </li>
              <li>
                <Link to="/about#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  roadmap
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column - moved to its own row on mobile/tablet */}
          <div className="space-y-4 md:col-start-1 lg:col-start-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
              legal
            </h3>
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
