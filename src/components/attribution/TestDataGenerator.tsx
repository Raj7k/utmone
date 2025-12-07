import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, Play, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestDataGeneratorProps {
  workspaceId: string | undefined;
  onComplete?: () => void;
}

interface JourneyStep {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
}

export const TestDataGenerator = ({ workspaceId, onComplete }: TestDataGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<JourneyStep[]>([
    { name: "Creating visitor identity", status: 'pending' },
    { name: "LinkedIn campaign click", status: 'pending' },
    { name: "Google organic visit", status: 'pending' },
    { name: "Direct return visit", status: 'pending' },
    { name: "Email newsletter click", status: 'pending' },
    { name: "Conversion with revenue", status: 'pending' },
    { name: "Building attribution journey", status: 'pending' },
  ]);

  const updateStep = (index: number, status: JourneyStep['status']) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status } : step
    ));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateTestData = async () => {
    if (!workspaceId) {
      toast.error("No workspace selected");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setSteps(steps.map(s => ({ ...s, status: 'pending' })));

    try {
      // Generate a unique visitor ID for this test journey
      const visitorId = `test_v_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const testEmail = `test-${Date.now()}@example.com`;
      
      // Step 1: Create visitor identity
      updateStep(0, 'running');
      await supabase.from('visitor_identities').insert({
        visitor_id: visitorId,
        workspace_id: workspaceId,
        email: testEmail,
        name: "Test User",
        first_seen_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        last_seen_at: new Date().toISOString(),
      });
      updateStep(0, 'complete');
      setProgress(14);
      await delay(300);

      // Step 2: LinkedIn campaign click (first touch)
      updateStep(1, 'running');
      await supabase.from('journey_events').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'pageview',
        event_name: 'landing_page',
        source: 'linkedin',
        medium: 'social',
        campaign: 'brand-awareness-q4',
        landing_page: 'https://example.com/landing?utm_source=linkedin',
        referrer: 'https://linkedin.com/feed',
        device_type: 'desktop',
        browser: 'chrome',
        os: 'Mac OS',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      });
      updateStep(1, 'complete');
      setProgress(28);
      await delay(300);

      // Step 3: Google organic visit
      updateStep(2, 'running');
      await supabase.from('journey_events').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'pageview',
        event_name: 'blog_post',
        source: 'google',
        medium: 'organic',
        campaign: null,
        landing_page: 'https://example.com/blog/utm-best-practices',
        referrer: 'https://google.com/search?q=utm+tracking',
        device_type: 'mobile',
        browser: 'safari',
        os: 'iOS',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      });
      updateStep(2, 'complete');
      setProgress(42);
      await delay(300);

      // Step 4: Direct return visit
      updateStep(3, 'running');
      await supabase.from('journey_events').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'pageview',
        event_name: 'pricing_page',
        source: 'direct',
        medium: 'none',
        campaign: null,
        landing_page: 'https://example.com/pricing',
        referrer: null,
        device_type: 'desktop',
        browser: 'chrome',
        os: 'Mac OS',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      });
      updateStep(3, 'complete');
      setProgress(56);
      await delay(300);

      // Step 5: Email newsletter click
      updateStep(4, 'running');
      await supabase.from('journey_events').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'pageview',
        event_name: 'special_offer',
        source: 'newsletter',
        medium: 'email',
        campaign: 'holiday-promo-2024',
        landing_page: 'https://example.com/offer?utm_source=newsletter',
        referrer: null,
        device_type: 'desktop',
        browser: 'chrome',
        os: 'Windows',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      });
      updateStep(4, 'complete');
      setProgress(70);
      await delay(300);

      // Step 6: Conversion with revenue
      updateStep(5, 'running');
      const conversionId = crypto.randomUUID();
      await supabase.from('journey_events').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'purchase',
        event_name: 'subscription_purchase',
        source: 'newsletter',
        medium: 'email',
        campaign: 'holiday-promo-2024',
        landing_page: 'https://example.com/checkout/success',
        referrer: 'https://example.com/offer',
        device_type: 'desktop',
        browser: 'chrome',
        os: 'Windows',
        revenue: 299.00,
        created_at: new Date().toISOString(),
      });
      
      // Also create conversion event
      await supabase.from('conversion_events').insert({
        id: conversionId,
        workspace_id: workspaceId,
        visitor_id: visitorId,
        event_type: 'purchase',
        event_name: 'subscription_purchase',
        event_value: 299.00,
        currency: 'USD',
        metadata: {
          test_data: true,
          plan: 'Pro Annual',
        },
      });
      updateStep(5, 'complete');
      setProgress(84);
      await delay(300);

      // Step 7: Build attribution journey
      updateStep(6, 'running');
      const touchpoints = [
        { source: 'linkedin', medium: 'social', campaign: 'brand-awareness-q4', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { source: 'google', medium: 'organic', campaign: null, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { source: 'direct', medium: 'none', campaign: null, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { source: 'newsletter', medium: 'email', campaign: 'holiday-promo-2024', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      ];
      
      await supabase.from('attribution_journeys').insert({
        workspace_id: workspaceId,
        visitor_id: visitorId,
        conversion_event_id: conversionId,
        converted: true,
        revenue: 299.00,
        touchpoints: touchpoints,
        journey_start_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        journey_end_at: new Date().toISOString(),
      });
      updateStep(6, 'complete');
      setProgress(100);

      toast.success("Test journey created successfully! Refresh to see attribution data.");
      onComplete?.();

    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error("Failed to generate test data");
      steps.forEach((_, i) => {
        if (steps[i].status === 'running') updateStep(i, 'error');
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearTestData = async () => {
    if (!workspaceId) return;

    setIsClearing(true);
    try {
      // Delete test attribution journeys
      await supabase
        .from('attribution_journeys')
        .delete()
        .eq('workspace_id', workspaceId)
        .like('visitor_id', 'test_v_%');

      // Delete test conversion events
      await supabase
        .from('conversion_events')
        .delete()
        .eq('workspace_id', workspaceId)
        .like('visitor_id', 'test_v_%');

      // Delete test journey events
      await supabase
        .from('journey_events')
        .delete()
        .eq('workspace_id', workspaceId)
        .like('visitor_id', 'test_v_%');

      // Delete test visitor identities
      await supabase
        .from('visitor_identities')
        .delete()
        .eq('workspace_id', workspaceId)
        .like('visitor_id', 'test_v_%');

      toast.success("Test data cleared");
      setSteps(steps.map(s => ({ ...s, status: 'pending' })));
      setProgress(0);
      onComplete?.();
    } catch (error) {
      console.error('Error clearing test data:', error);
      toast.error("Failed to clear test data");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FlaskConical className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">test data generator</CardTitle>
              <CardDescription className="text-muted-foreground">
                create a sample multi-touch journey to see attribution in action
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-amber-600 border-amber-500/30">
            testing tool
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">{progress}% complete</p>
          </div>
        )}

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-2 text-xs p-2 rounded-md ${
                step.status === 'complete' ? 'bg-emerald-500/10 text-emerald-600' :
                step.status === 'running' ? 'bg-primary/10 text-primary' :
                step.status === 'error' ? 'bg-destructive/10 text-destructive' :
                'bg-muted/50 text-muted-foreground'
              }`}
            >
              {step.status === 'complete' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
              {step.status === 'running' && <Loader2 className="h-3 w-3 shrink-0 animate-spin" />}
              {step.status === 'pending' && <div className="h-3 w-3 rounded-full border border-current shrink-0" />}
              <span className="truncate">{step.name}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={generateTestData} 
            disabled={isGenerating || isClearing}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                generate sample journey
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearTestData}
            disabled={isGenerating || isClearing}
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          this creates a realistic 5-day customer journey: LinkedIn → Google → Direct → Email → Purchase ($299). 
          the data uses "test_v_" prefix and can be cleared anytime.
        </p>
      </CardContent>
    </Card>
  );
};
