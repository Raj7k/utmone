import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FlaskConical, Send, CheckCircle2, XCircle, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TestEvent {
  id: string;
  eventType: string;
  status: "success" | "error";
  visitorId: string;
  timestamp: Date;
  errorMessage?: string;
}

export function FormTrackingTester() {
  const [eventType, setEventType] = useState("lead");
  const [formName, setFormName] = useState("test-form");
  const [email, setEmail] = useState("");
  const [revenue, setRevenue] = useState("");
  const [stepNumber, setStepNumber] = useState("1");
  const [totalSteps, setTotalSteps] = useState("3");
  const [isLoading, setIsLoading] = useState(false);
  const [testHistory, setTestHistory] = useState<TestEvent[]>([]);

  const generateTestVisitorId = () => {
    return `test_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  };

  const sendTestEvent = async () => {
    setIsLoading(true);
    const testVisitorId = generateTestVisitorId();

    try {
      const payload: Record<string, unknown> = {
        visitor_id: testVisitorId,
        event_type: eventType,
        event_name: formName || "test-form",
        page_url: window.location.href,
        page_title: "Test from Settings",
        user_agent: navigator.userAgent,
        referrer: document.referrer || "",
        metadata: {
          test_mode: true,
          sent_from: "settings_tester",
        },
      };

      // Add event-specific fields
      if (eventType === "identify" && email) {
        payload.email = email;
      }

      if (eventType === "purchase" && revenue) {
        payload.revenue = parseFloat(revenue);
      }

      if (eventType === "form_step") {
        payload.metadata = {
          ...payload.metadata as Record<string, unknown>,
          step: parseInt(stepNumber),
          total_steps: parseInt(totalSteps),
          form_name: formName,
        };
      }

      const { data, error } = await supabase.functions.invoke("track-event", {
        body: payload,
      });

      if (error) throw error;

      const newEvent: TestEvent = {
        id: data?.id || testVisitorId,
        eventType,
        status: "success",
        visitorId: testVisitorId,
        timestamp: new Date(),
      };

      setTestHistory((prev) => [newEvent, ...prev].slice(0, 5));
    } catch (err) {
      const newEvent: TestEvent = {
        id: testVisitorId,
        eventType,
        status: "error",
        visitorId: testVisitorId,
        timestamp: new Date(),
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      };

      setTestHistory((prev) => [newEvent, ...prev].slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setTestHistory([]);
  };

  const eventTypeOptions = [
    { value: "lead", label: "Lead (Form Submission)", description: "Standard lead capture" },
    { value: "form_submit", label: "Form Submit", description: "Generic form completion" },
    { value: "form_step", label: "Form Step", description: "Multi-step progress" },
    { value: "purchase", label: "Purchase", description: "With revenue tracking" },
    { value: "identify", label: "Identify", description: "User identification" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Test Mode</span>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            Live Testing
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Send real test events to verify your tracking is working. Test events use a special <code className="font-mono bg-muted px-1 rounded">test_</code> visitor ID prefix.
        </p>
      </div>

      {/* Event Configuration */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event-type" className="text-sm text-foreground">Event Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger id="event-type" className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {eventTypeOptions.find((o) => o.value === eventType)?.description}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="form-name" className="text-sm text-foreground">Form Name</Label>
          <Input
            id="form-name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g., signup-form, contact-form"
            className="bg-card border-border"
          />
        </div>

        {/* Conditional fields based on event type */}
        {eventType === "identify" && (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="bg-card border-border"
            />
            <p className="text-xs text-muted-foreground">Required for identity linking</p>
          </div>
        )}

        {eventType === "purchase" && (
          <div className="space-y-2">
            <Label htmlFor="revenue" className="text-sm text-foreground">Revenue Amount ($)</Label>
            <Input
              id="revenue"
              type="number"
              min="0"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="99.00"
              className="bg-card border-border"
            />
          </div>
        )}

        {eventType === "form_step" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="step-number" className="text-sm text-foreground">Current Step</Label>
              <Input
                id="step-number"
                type="number"
                min="1"
                value={stepNumber}
                onChange={(e) => setStepNumber(e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-steps" className="text-sm text-foreground">Total Steps</Label>
              <Input
                id="total-steps"
                type="number"
                min="1"
                value={totalSteps}
                onChange={(e) => setTotalSteps(e.target.value)}
                className="bg-card border-border"
              />
            </div>
          </div>
        )}

        <Button
          onClick={sendTestEvent}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Test Event
            </>
          )}
        </Button>
      </div>

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Recent Tests</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            {testHistory.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className={`p-3 rounded-lg border ${
                  event.status === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-destructive/5 border-destructive/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {event.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {event.status === "success" ? "Event tracked" : "Failed"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {event.eventType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {event.visitorId}
                      </p>
                      {event.errorMessage && (
                        <p className="text-xs text-destructive mt-1">{event.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {event.status === "success" && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <a
                      href="/dashboard/analytics"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View in Analytics
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
