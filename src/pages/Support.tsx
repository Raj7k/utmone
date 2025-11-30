import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Mail, MessageSquare, Book, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Support - Get Help"
        description="Get help with utm.one: email support, live chat, documentation, FAQ, and API docs. Response times: 24-48 hours depending on your plan."
        canonical="https://utm.one/support"
        keywords={['utm.one support', 'help', 'contact', 'documentation', 'customer service']}
      />
      <Navigation />

      {/* Hero */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-display font-bold text-foreground mb-6">
            Support
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're here to help. Get answers fast.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Email Support */}
          <div className="border border-border rounded-2xl p-8 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">
                Email Support
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Send us a detailed message and we'll respond within 24 hours (usually much faster).
            </p>
            <a
              href="mailto:support@utm.one"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              support@utm.one
              <ExternalLink className="w-4 h-4" />
            </a>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Response times:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Free plan: 48 hours</li>
                <li>• Pro plan: 24 hours</li>
                <li>• Business plan: 12 hours (priority)</li>
              </ul>
            </div>
          </div>

          {/* Live Chat */}
          <div className="border border-border rounded-2xl p-8 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">
                Live Chat
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Get instant answers during business hours (9am - 5pm EST, Monday - Friday).
            </p>
            <button
              onClick={() => {
                // Placeholder for live chat integration
                alert("Live chat opening soon!");
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Start Live Chat
            </button>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Availability:</strong> Business hours only
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Outside of business hours? Send us an email and we'll respond first thing.
              </p>
            </div>
          </div>
        </div>

        {/* Self-Service Resources */}
        <div className="bg-muted/20 border border-border rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Self-Service Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/docs"
              className="flex flex-col items-start gap-3 p-6 border border-border rounded-xl bg-card hover:bg-muted/20 transition-colors"
            >
              <Book className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground mb-1">Documentation</h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guides and tutorials
                </p>
              </div>
            </Link>

            <Link
              to="/faq"
              className="flex flex-col items-start gap-3 p-6 border border-border rounded-xl bg-card hover:bg-muted/20 transition-colors"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground mb-1">FAQ</h2>
                <p className="text-sm text-muted-foreground">
                  Common questions, answered
                </p>
              </div>
            </Link>

            <Link
              to="/api"
              className="flex flex-col items-start gap-3 p-6 border border-border rounded-xl bg-card hover:bg-muted/20 transition-colors"
            >
              <Book className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground mb-1">API Docs</h2>
                <p className="text-sm text-muted-foreground">
                  Developer reference and examples
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="border border-border rounded-2xl p-8 bg-card">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            System Status
          </h2>
          <p className="text-muted-foreground mb-6">
            Check the real-time status of utm.one services and view historical uptime.
          </p>
          <a
            href="https://status.utm.one"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl text-foreground font-medium hover:bg-muted/20 transition-colors"
          >
            View Status Page
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Feature Requests */}
        <div className="mt-16 border-t border-border pt-16">
          <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Have a Feature Request?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always improving utm.one. Share your ideas and vote on what's next.
            </p>
            <a
              href="mailto:support@utm.one?subject=Feature Request"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Submit Feature Request
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
