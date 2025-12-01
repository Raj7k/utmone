import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Zap,
  Globe,
  TrendingUp,
  BarChart3,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { HowToUse } from "@/components/tools/HowToUse";
import { ToolHero } from "@/components/tools/ToolHero";
import { FreeVsProTable } from "@/components/tools/FreeVsProTable";
import { LockedFeaturePreview } from "@/components/tools/LockedFeaturePreview";
import { ToolUseCases } from "@/components/tools/ToolUseCases";

interface HealthCheckResult {
  url: string;
  status: 'healthy' | 'slow' | 'broken' | 'insecure';
  responseTime: number;
  statusCode: number;
  ssl: boolean;
  redirectChain: string[];
  issues: string[];
}

export default function LinkHealthChecker() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthCheckResult | null>(null);

  const steps = [
    {
      title: "Paste the URL to check",
      description: "Any link you want to verify"
    },
    {
      title: "Click 'Check Link Health'",
      description: "We'll test status, SSL, and response time"
    },
    {
      title: "Review results",
      description: "See issues and get recommendations"
    }
  ];

  const freeVsProFeatures = [
    { name: "One-time link health check", free: true, pro: true },
    { name: "HTTP status code detection", free: true, pro: true },
    { name: "SSL verification", free: true, pro: true },
    { name: "Response time measurement", free: true, pro: true },
    { name: "24/7 automated monitoring", free: false, pro: true },
    { name: "Uptime alerts & notifications", free: false, pro: true },
    { name: "Historical performance data", free: false, pro: true },
    { name: "Bulk link checking", free: false, pro: "1000+ links" },
    { name: "Link Immunity auto-failover", free: false, pro: true },
  ];

  const useCases = [
    {
      icon: TrendingUp,
      title: "marketers",
      description: "Verify all campaign links are working before launch to avoid wasted ad spend.",
      example: "Check 50 campaign URLs before launch"
    },
    {
      icon: BarChart3,
      title: "seo specialists",
      description: "Monitor backlinks and redirect chains to prevent link rot hurting rankings.",
      example: "Track 500 backlinks for 404s and broken redirects"
    },
    {
      icon: Bell,
      title: "devops teams",
      description: "Get instant alerts when critical landing pages go down or SSL expires.",
      example: "Slack alert: pricing page returned 500 error"
    },
    {
      icon: Shield,
      title: "compliance teams",
      description: "Ensure all public-facing links meet security standards with SSL verification.",
      example: "Audit 1000+ links for HTTPS compliance"
    }
  ];

  const checkHealth = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to check",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const { data, error } = await supabase.functions.invoke('check-link-health', {
        body: { url }
      });

      if (error) throw error;

      setResult(data);
    } catch (error) {
      toast({
        title: "Check Failed",
        description: error instanceof Error ? error.message : "Couldn't check link health",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'slow': return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'broken': return <XCircle className="h-12 w-12 text-red-500" />;
      case 'insecure': return <Shield className="h-12 w-12 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'link is healthy';
      case 'slow': return 'link is slow';
      case 'broken': return 'link is broken';
      case 'insecure': return 'link is insecure';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'slow': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'broken': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'insecure': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      default: return '';
    }
  };

  const toolContent = (
    <div className="max-w-4xl mx-auto space-y-8">
          {/* Input */}
          <Card className="p-8">
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg"
                onKeyDown={(e) => e.key === 'Enter' && checkHealth()}
              />
              <Button
                onClick={checkHealth}
                disabled={loading || !url}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    checking...
                  </>
                ) : (
                  'check link health'
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {result && (
            <Card className="p-8">
              <div className="space-y-6">
                {/* Status */}
                <div className="text-center space-y-4">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {getStatusText(result.status)}
                    </h3>
                    <Badge className={getStatusColor(result.status)}>
                      HTTP {result.statusCode}
                    </Badge>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        response time
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.responseTime}ms
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        ssl
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.ssl ? '✓' : '✗'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        redirects
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.redirectChain.length}
                    </p>
                  </div>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div className="pt-6 border-t border-border/40">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      issues detected
                    </h4>
                    <ul className="space-y-2">
                      {result.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-secondary-label">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

    </div>
  );

  return (
    <MarketingLayout
      title="Free Link Health Checker - Verify URL Status & Security | utm.one"
      description="Check if your links are working, secure, and fast. Free link health scanner with SSL verification and response time analysis. No signup required."
    >
      {/* Hero with Tool */}
      <ToolHero
        title="check if your links work."
        description="verify link status, SSL, and response time instantly. no signup required."
      >
        {toolContent}
      </ToolHero>

      {/* How To Use */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <HowToUse steps={steps} />
        </div>
      </section>

      {/* Free vs Pro Comparison */}
      <FreeVsProTable features={freeVsProFeatures} />

      {/* Locked Feature Preview */}
      <LockedFeaturePreview
        title="24/7 automated monitoring"
        description="Pro users get automated health checks, uptime monitoring with instant alerts, historical performance data, bulk link checking (1000+ links), and Link Immunity auto-failover."
      />

      {/* Use Cases */}
      <ToolUseCases useCases={useCases} />

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            ready for more?
          </h2>
          <p className="text-body text-secondary-label mb-8">
            upgrade to pro and unlock 24/7 monitoring, instant alerts, bulk checking, and Link Immunity failover.
          </p>
          <Link to="/pricing">
            <Button size="lg" variant="marketing">
              see pro features →
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
