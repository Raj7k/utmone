import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

export const SemanticFooter = () => {
  const currentDate = new Date();
  const lastUpdated = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  return (
    <footer className="bg-muted/20 border-t border-border mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <nav aria-label="Product navigation">
            <h3 className="font-semibold text-foreground mb-4">product</h3>
            <ul className="space-y-2">
              <li><Link to="/features/short-links" className="text-muted-foreground hover:text-foreground transition-colors">short links</Link></li>
              <li><Link to="/features/utm-builder" className="text-muted-foreground hover:text-foreground transition-colors">utm builder</Link></li>
              <li><Link to="/features/qr-generator" className="text-muted-foreground hover:text-foreground transition-colors">qr codes</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">pricing</Link></li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources navigation">
            <h3 className="font-semibold text-foreground mb-4">resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">documentation</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">blog</Link></li>
              <li><Link to="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">changelog</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">support</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company navigation">
            <h3 className="font-semibold text-foreground mb-4">company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">about</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">contact</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">careers</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal navigation">
            <h3 className="font-semibold text-foreground mb-4">legal</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">privacy policy</Link></li>
              <li><Link to="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">terms of service</Link></li>
              <li><Link to="/legal/security" className="text-muted-foreground hover:text-foreground transition-colors">data & security</Link></li>
              <li><Link to="/legal/dpa" className="text-muted-foreground hover:text-foreground transition-colors">DPA</Link></li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <UtmOneLogo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {currentDate.getFullYear()} utm.one. all rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
};