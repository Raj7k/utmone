import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Brain, Lightbulb, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function SmartInsights() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Smart Insights - Documentation"
        description="Learn how utm.one's AI-powered Smart Insights help you understand your link performance."
        canonical="https://utm.one/docs/smart-insights"
        keywords={['smart insights', 'AI analytics', 'automated insights', 'link intelligence']}
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
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Smart Insights</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              AI-powered analysis that tells you what matters—without you having to ask.
            </p>
          </div>

          {/* Overview */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">What Are Smart Insights?</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground">
                Smart Insights is utm.one's AI Command Center that continuously analyzes your link performance data and surfaces actionable recommendations. Instead of digging through dashboards, get clear, prioritized insights delivered to you.
              </p>
            </div>
          </section>

          {/* Insight types */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Types of Insights</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-foreground">Performance Trends</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Your email links are outperforming social by 42% this week. Consider allocating more budget to email campaigns."
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-foreground">Anomaly Detection</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Traffic to your promo link dropped 65% in the last 2 hours. This might indicate a broken page or campaign issue."
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-foreground">Timing Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Your audience is most active between 10am-12pm EST. Schedule campaigns for this window for maximum engagement."
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold text-foreground">Recommendations</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Links with branded slugs get 23% more clicks. Consider updating your generic slugs to branded alternatives."
                </p>
              </div>
            </div>
          </section>

          {/* Configuration */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Configuring Insights</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground mb-6">
                Smart Insights can be customized in <strong>Settings → Alerts & Insights</strong>:
              </p>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span><strong className="text-foreground">Time periods:</strong> Compare performance over 7, 14, or 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span><strong className="text-foreground">Notification preferences:</strong> Email, Slack, or in-app only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span><strong className="text-foreground">Insight categories:</strong> Enable/disable specific insight types</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span><strong className="text-foreground">Quiet hours:</strong> Pause non-critical insights during off-hours</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Viewing insights */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Viewing Insights</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground">
                Access your Smart Insights from:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">Dashboard home:</strong> AI Command Center widget shows top 3 insights</li>
                <li>• <strong className="text-foreground">Analytics → Overview:</strong> Full insights panel with history</li>
                <li>• <strong className="text-foreground">Link detail pages:</strong> Link-specific insights and recommendations</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}