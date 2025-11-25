import { Helmet } from "react-helmet";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Keyboard, MonitorSpeaker, Mail } from "lucide-react";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Accessibility Statement | utm.one</title>
        <meta name="description" content="utm.one is committed to WCAG AAA compliance and accessible design for all users." />
      </Helmet>

      <main id="main-content" className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
              Accessibility Statement
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              utm.one is committed to ensuring digital accessibility for all users, including those with disabilities.
            </p>
          </div>

          {/* WCAG AAA Compliance */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">WCAG AAA Compliance</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  utm.one conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AAA, the highest standard for web accessibility.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Color contrast ratios exceed 7:1 for all text
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Full keyboard navigation support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Screen reader compatible with ARIA labels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Semantic HTML structure throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Descriptive link text and alt attributes
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <Keyboard className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Keyboard Shortcuts</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  All functionality is accessible via keyboard. Common shortcuts:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Tab</kbd>
                    <span className="ml-3 text-muted-foreground">Navigate forward</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Shift + Tab</kbd>
                    <span className="ml-3 text-muted-foreground">Navigate backward</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Enter</kbd>
                    <span className="ml-3 text-muted-foreground">Activate links/buttons</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Esc</kbd>
                    <span className="ml-3 text-muted-foreground">Close dialogs</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Space</kbd>
                    <span className="ml-3 text-muted-foreground">Toggle checkboxes</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Arrow Keys</kbd>
                    <span className="ml-3 text-muted-foreground">Navigate menus</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Screen Reader Support */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4">
              <MonitorSpeaker className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Screen Reader Compatibility</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  utm.one is tested and compatible with the following screen readers:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JAWS (Windows)</li>
                  <li>• NVDA (Windows)</li>
                  <li>• VoiceOver (macOS, iOS)</li>
                  <li>• TalkBack (Android)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Accessibility Feedback</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We welcome feedback on the accessibility of utm.one. If you encounter any barriers, please contact us:
                </p>
                <a 
                  href="mailto:accessibility@utm.one"
                  className="text-primary hover:underline text-lg font-medium"
                >
                  accessibility@utm.one
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  We aim to respond to accessibility feedback within 2 business days.
                </p>
              </div>
            </div>
          </Card>

          {/* Last Updated */}
          <p className="text-center text-sm text-muted-foreground mt-12">
            Last updated: November 2025
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
