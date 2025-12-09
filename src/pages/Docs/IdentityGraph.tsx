import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Smartphone, Monitor, Zap, Shield } from "lucide-react";

export default function IdentityGraph() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Identity Graph - Documentation"
        description="Understand how utm.one's probabilistic identity graph connects cross-device visitor journeys."
        canonical="https://utm.one/docs/identity-graph"
        keywords={['identity graph', 'cross-device tracking', 'visitor matching', 'probabilistic matching']}
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
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Identity Graph</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              connect the dots across devices and sessions with probabilistic matching.
            </p>
          </div>

          {/* What is it */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">What is the Identity Graph?</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground mb-6">
                The Identity Graph is utm.one's solution for connecting anonymous visitors across multiple devices and sessions. Using probabilistic matching techniques, we can identify when the same person visits your links from their phone, tablet, and desktop.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Mobile visit</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Desktop visit</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg text-center border border-primary/30">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-foreground font-medium">Same person</p>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">How It Works</h2>
            
            <div className="space-y-4">
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Signal Collection
                </h3>
                <p className="text-muted-foreground">
                  We collect non-PII signals like device type, browser fingerprint, IP address patterns, and behavioral characteristics to build a probabilistic profile.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Probabilistic Matching
                </h3>
                <p className="text-muted-foreground">
                  Our algorithms analyze these signals to calculate the probability that two visitors are the same person. We only create matches when confidence exceeds 85%.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Real-time Updates
                </h3>
                <p className="text-muted-foreground">
                  New matches are detected in real-time via Supabase Realtime. You'll see new connections appear instantly in your dashboard with visual indicators.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Privacy & Compliance</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Privacy-First Approach</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• No personal data (PII) is collected or stored</li>
                    <li>• All matching is probabilistic, not deterministic</li>
                    <li>• Visitors can opt-out via standard DNT headers</li>
                    <li>• Data is automatically purged after 90 days</li>
                    <li>• Fully GDPR and CCPA compliant</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Viewing matches */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Viewing Identity Matches</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground mb-4">
                Navigate to <strong>Analytics → Attribution → Identity Graph</strong> in your dashboard to view:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All detected cross-device matches</li>
                <li>• Confidence scores for each match</li>
                <li>• Complete journey visualization across devices</li>
                <li>• Real-time notifications for new matches</li>
              </ul>
            </div>
          </section>

          {/* Plan note */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-1">Business Feature</h3>
            <p className="text-sm text-muted-foreground">
              The Identity Graph is available on Business plans and above. <Link to="/pricing" className="text-primary hover:underline">View pricing</Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}