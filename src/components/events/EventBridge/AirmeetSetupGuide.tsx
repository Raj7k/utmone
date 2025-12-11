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
  ArrowRight,
  CheckCircle2,
  Circle,
  Info
} from 'lucide-react';
import { notify } from '@/lib/notify';
import { AirmeetIcon } from '@/components/icons/EventPlatformIcons';

interface AirmeetSetupGuideProps {
  webhookUrl: string;
  flowName: string;
  onComplete?: () => void;
}

export function AirmeetSetupGuide({ webhookUrl, flowName, onComplete }: AirmeetSetupGuideProps) {
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
      title: 'get your Airmeet API key',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            go to your Airmeet dashboard → Settings → Integrations → API Keys
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              window.open('https://platform.airmeet.com/settings/integrations', '_blank');
              markStepComplete(1);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            open Airmeet settings
          </Button>
        </div>
      ),
    },
    {
      number: 2,
      title: 'copy your API key',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            copy the API key from your Airmeet dashboard. you'll need to add this to utm.one secrets.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              the API key is required for utm.one to fetch registrations from your Airmeet events.
            </AlertDescription>
          </Alert>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(2)}
          >
            <Check className="h-4 w-4 mr-2" />
            I have my API key
          </Button>
        </div>
      ),
    },
    {
      number: 3,
      title: 'configure webhook in Airmeet',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            in Airmeet, go to your event → Settings → Webhooks and add this URL:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/50 px-3 py-2 rounded text-xs font-mono truncate">
              {webhookUrl}
            </code>
            <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">select these events:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">attendee.registered</Badge>
              <Badge variant="outline">attendee.checked_in</Badge>
            </div>
          </div>
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
      title: 'test the connection',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            register a test attendee for your Airmeet event to verify the webhook is working.
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(4)}
          >
            <Check className="h-4 w-4 mr-2" />
            done
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
          <AirmeetIcon className="h-5 w-5" />
          <h3 className="font-medium">Airmeet setup guide</h3>
        </div>
        <Badge variant={allComplete ? 'default' : 'secondary'}>
          {completedSteps.length}/4 steps
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        connect your Airmeet events to utm.one for automatic lead enrichment and CRM routing.
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
            new Airmeet registrations will now flow into utm.one.
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
