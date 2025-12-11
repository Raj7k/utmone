import { useState } from "react";
import { X, HelpCircle, Book, MessageSquare, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useHelpKeyboard } from "@/hooks/useHelpKeyboard";

export const HelpPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Add keyboard shortcut support
  useHelpKeyboard({
    onToggle: () => setIsOpen(prev => !prev),
  });

  const getContextualHelp = () => {
    const path = location.pathname;
    
    if (path.includes("/dashboard")) {
      return {
        title: "Dashboard Help",
        items: [
          { label: "Understanding your metrics", href: "/docs#analytics" },
          { label: "Creating your first link", href: "/docs#first-link" },
          { label: "Quick start guide", href: "/docs#quick-start" },
        ],
      };
    }
    
    if (path.includes("/links")) {
      return {
        title: "Links Help",
        items: [
          { label: "How to create a link", href: "/docs#first-link" },
          { label: "Understanding UTM parameters", href: "/docs#utm-basics" },
          { label: "Link expiration settings", href: "/docs" },
        ],
      };
    }
    
    if (path.includes("/analytics")) {
      return {
        title: "Analytics Help",
        items: [
          { label: "Reading your analytics", href: "/docs#analytics" },
          { label: "Exporting data", href: "/docs" },
          { label: "Campaign tracking", href: "/docs#utm-basics" },
        ],
      };
    }

    if (path.includes("/qr-codes")) {
      return {
        title: "QR Codes Help",
        items: [
          { label: "Generating QR codes", href: "/docs#first-qr" },
          { label: "Customization options", href: "/docs#first-qr" },
          { label: "Tracking QR scans", href: "/docs" },
        ],
      };
    }
    
    return {
      title: "Help & Resources",
      items: [
        { label: "Getting started", href: "/docs#quick-start" },
        { label: "View FAQ", href: "/faq" },
        { label: "Contact support", href: "/support" },
      ],
    };
  };

  const contextHelp = getContextualHelp();

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-20 md:bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full",
          "shadow-lg hover:shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-200",
          "hover:scale-110",
          "bg-primary text-primary-foreground",
          isOpen && "scale-0"
        )}
        aria-label="Open help panel"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Slide-out Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 shadow-2xl z-50",
          "transform transition-transform duration-300 ease-out",
          "bg-card backdrop-blur-xl border-l border-border",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold text-foreground">
            Help & Support
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-muted"
            aria-label="Close help panel"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-80px)]">
          {/* Context-aware help */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              {contextHelp.title}
            </h3>
            <div className="space-y-2">
              {contextHelp.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Book className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link
                to="/docs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-3 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Book className="w-4 h-4 flex-shrink-0" />
                Documentation
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-3 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                FAQ
              </Link>
              <Link
                to="/changelog"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-3 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                What's New
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-xl p-6 bg-muted/50 border border-border">
            <h3 className="text-sm font-semibold mb-2 text-foreground">
              Need More Help?
            </h3>
            <p className="text-sm mb-4 text-muted-foreground">
              Our support team is here to help you succeed.
            </p>
            <Link
              to="/support"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Contact Support
            </Link>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="text-xs text-center pt-4 text-muted-foreground border-t border-border">
            Press <kbd className="px-2 py-1 rounded font-mono bg-muted">?</kbd> to open help
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 bg-background/80"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
