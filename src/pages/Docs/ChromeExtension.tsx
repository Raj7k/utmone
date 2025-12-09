import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Chrome, Zap, Clock, Copy, QrCode, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChromeExtension() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Chrome Extension - Documentation"
        description="Install and use the utm.one Chrome Extension for zero-friction link creation from any tab."
        canonical="https://utm.one/docs/chrome-extension"
        keywords={['chrome extension', 'browser extension', 'quick link creation', 'utm.one sidebar']}
      />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <Link to="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          back to docs
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Chrome className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Chrome Extension</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              create links in under 5 seconds without leaving your current tab.
            </p>
          </div>

          {/* Installation */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Installation</h2>
            
            <div className="space-y-4">
              {[
                { step: 1, title: "Visit Chrome Web Store", desc: "Search for 'utm.one Sidebar' or use the direct link from your dashboard." },
                { step: 2, title: "Click 'Add to Chrome'", desc: "Accept the permissions to enable the side panel functionality." },
                { step: 3, title: "Pin the extension", desc: "Click the puzzle icon in Chrome and pin utm.one for quick access." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-6 bg-card border border-border rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Features</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: "Auto-capture URL", desc: "Automatically grabs the current page URL and title" },
                { icon: Clock, title: "Smart context detection", desc: "Detects platform (Twitter, LinkedIn, YouTube) and sets utm_source" },
                { icon: Copy, title: "One-click copy", desc: "Copy short link to clipboard instantly" },
                { icon: QrCode, title: "Quick QR generation", desc: "Generate and download QR code without opening dashboard" },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 bg-card border border-border rounded-xl">
                    <Icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Usage */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">How to Use</h2>
            
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Open the sidebar</h3>
                <p className="text-muted-foreground">
                  Click the utm.one icon in your Chrome toolbar, or use the keyboard shortcut <code className="px-2 py-1 bg-muted rounded text-sm">Cmd+Shift+U</code> (Mac) / <code className="px-2 py-1 bg-muted rounded text-sm">Ctrl+Shift+U</code> (Windows).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Review pre-filled data</h3>
                <p className="text-muted-foreground">
                  The extension automatically captures the current URL, page title, and detects the platform for smart UTM suggestions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Create & copy</h3>
                <p className="text-muted-foreground">
                  Click "Create Link" to generate your short link. It's automatically copied to your clipboard.
                </p>
              </div>
            </div>
          </section>

          {/* Settings */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Extension Settings</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-start gap-4">
                <Settings className="w-6 h-6 text-muted-foreground mt-1" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    Access extension settings from Settings → Apps & Extensions → Browser Extension in your dashboard.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong className="text-foreground">Default workspace:</strong> Choose which workspace to create links in</li>
                    <li>• <strong className="text-foreground">Default domain:</strong> Set your preferred short domain</li>
                    <li>• <strong className="text-foreground">Auto-UTM:</strong> Enable/disable smart UTM detection</li>
                    <li>• <strong className="text-foreground">Keyboard shortcut:</strong> Customize the hotkey</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to install?</h3>
            <p className="text-muted-foreground mb-6">Get the extension and start creating links faster.</p>
            <Button variant="marketing">
              <Chrome className="w-4 h-4 mr-2" />
              Add to Chrome
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}