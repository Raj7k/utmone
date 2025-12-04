import { Helmet } from "react-helmet";
import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle2, Keyboard, MonitorSpeaker, Mail } from "lucide-react";

export default function Accessibility() {
  return (
    <MainLayout showAnnouncement={false}>
      <Helmet>
        <title>Accessibility Statement | utm.one</title>
        <meta name="description" content="utm.one is committed to WCAG AAA compliance and accessible design for all users." />
      </Helmet>

      <main id="main-content" className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="hero-gradient text-5xl md:text-6xl font-bold mb-6">
              accessibility statement
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              utm.one is committed to ensuring digital accessibility for all users, including those with disabilities.
            </p>
          </div>

          {/* WCAG AAA Compliance */}
          <div className="p-8 mb-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: 'rgba(34,197,94,0.8)' }} />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-white">WCAG AAA Compliance</h2>
                <p className="text-lg mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  utm.one conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AAA, the highest standard for web accessibility.
                </p>
                <ul className="space-y-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    Color contrast ratios exceed 7:1 for all text
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    Full keyboard navigation support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    Screen reader compatible with ARIA labels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    Semantic HTML structure throughout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(34,197,94,0.8)' }} />
                    Descriptive link text and alt attributes
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-8 mb-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4">
              <Keyboard className="w-8 h-8 text-white/80 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3 text-white">Keyboard Shortcuts</h2>
                <p className="text-lg mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  All functionality is accessible via keyboard. Common shortcuts:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Tab</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Navigate forward</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Shift + Tab</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Navigate backward</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Enter</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Activate links/buttons</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Esc</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Close dialogs</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Space</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Toggle checkboxes</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 rounded text-sm font-mono" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>Arrow Keys</kbd>
                    <span className="ml-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Navigate menus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Reader Support */}
          <div className="p-8 mb-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4">
              <MonitorSpeaker className="w-8 h-8 text-white/80 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-white">Screen Reader Compatibility</h2>
                <p className="text-lg mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  utm.one is tested and compatible with the following screen readers:
                </p>
                <ul className="space-y-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <li>• JAWS (Windows)</li>
                  <li>• NVDA (Windows)</li>
                  <li>• VoiceOver (macOS, iOS)</li>
                  <li>• TalkBack (Android)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-white/80 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-white">Accessibility Feedback</h2>
                <p className="text-lg mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  We welcome feedback on the accessibility of utm.one. If you encounter any barriers, please contact us:
                </p>
                <a 
                  href="mailto:accessibility@utm.one"
                  className="text-lg font-medium text-white hover:underline"
                >
                  accessibility@utm.one
                </a>
                <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  We aim to respond to accessibility feedback within 2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-center text-sm mt-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Last updated: November 2025
          </p>
        </div>
      </main>
    </MainLayout>
  );
}