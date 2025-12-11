import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Circle,
  Info
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { GoldcastIcon } from '@/components/icons/EventPlatformIcons';

interface GoldcastSetupGuideProps {
  webhookUrl: string;
  flowName: string;
  onComplete?: () => void;
}

export function GoldcastSetupGuide({ webhookUrl, flowName, onComplete }: GoldcastSetupGuideProps) {
  const [copied, setCopied] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    notify.success('webhook URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 4) {
      setExpandedStep(step + 1);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'access Goldcast integrations',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            log in to Goldcast and navigate to Settings → Integrations → Webhooks
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              window.open('https://app.goldcast.io/settings/integrations', '_blank');
              markStepComplete(1);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            open Goldcast settings
          </Button>
        </div>
      ),
    },
    {
      number: 2,
      title: 'create a new webhook',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            click "Add Webhook" and paste this URL:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/50 px-3 py-2 rounded text-xs font-mono truncate">
              {webhookUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(2)}
          >
            <Check className="h-4 w-4 mr-2" />
            done
          </Button>
        </div>
      ),
    },
    {
      number: 3,
      title: 'select webhook events',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            enable these event types for the webhook:
          </p>
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">registration.created</Badge>
              <Badge variant="outline">attendee.joined</Badge>
              <Badge variant="outline">attendee.left</Badge>
            </div>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Goldcast sends rich engagement data including session attendance and poll responses.
            </AlertDescription>
          </Alert>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(3)}
          >
            <Check className="h-4 w-4 mr-2" />
            done
          </Button>
        </div>
      ),
    },
    {
      number: 4,
      title: 'verify the connection',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            use Goldcast's "Test Webhook" button to send a test payload, then check that it appears in utm.one.
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(4)}
          >
            <Check className="h-4 w-4 mr-2" />
            verified
          </Button>
        </div>
      ),
    },
  ];

  const allComplete = completedSteps.length === 4;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GoldcastIcon className="h-5 w-5" />
          <h3 className="font-medium">Goldcast setup guide</h3>
        </div>
        <Badge variant={allComplete ? 'default' : 'secondary'}>
          {completedSteps.length}/4 steps
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        connect your Goldcast events to utm.one for B2B event attribution and lead enrichment.
      </p>

      <div className="space-y-2">
        {steps.map((step) => {
          const isComplete = completedSteps.includes(step.number);
          const isExpanded = expandedStep === step.number;

          return (
            <div 
              key={step.number} 
              className={`border rounded-lg transition-colors ${
                isComplete ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                    {step.title}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 pl-11">
                  {step.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allComplete && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="font-medium">setup complete!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Goldcast registrations will now sync to utm.one automatically.
          </p>
          {onComplete && (
            <Button onClick={onComplete} className="mt-3">
              done
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
