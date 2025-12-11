import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { notify } from '@/lib/notify';

interface ZapierSetupGuideProps {
  webhookUrl: string;
  flowName: string;
  onComplete?: () => void;
}

const FIELD_MAPPINGS = [
  { zapierField: 'Email', webhookField: 'email', required: true },
  { zapierField: 'First Name', webhookField: 'first_name', required: false },
  { zapierField: 'Last Name', webhookField: 'last_name', required: false },
  { zapierField: 'Company', webhookField: 'company', required: false },
  { zapierField: 'Event ID', webhookField: 'external_id', required: false },
];

export function ZapierSetupGuide({ webhookUrl, flowName, onComplete }: ZapierSetupGuideProps) {
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
    // Auto-expand next step
    if (step < 5) {
      setExpandedStep(step + 1);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'create a new zap in Zapier',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            go to Zapier and click "Create Zap" or use the button below.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              window.open('https://zapier.com/app/editor', '_blank');
              markStepComplete(1);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            open Zapier
          </Button>
        </div>
      ),
    },
    {
      number: 2,
      title: 'set trigger: Luma → New Guest',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            search for "Luma" in the trigger apps and select "New Guest Registration" as the trigger event.
          </p>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">trigger configuration:</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">App: Luma</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Event: New Guest</Badge>
            </div>
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
      title: 'set action: Webhooks → POST',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            add an action step and search for "Webhooks by Zapier". select "POST" as the action event.
          </p>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">action configuration:</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">App: Webhooks</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Action: POST</Badge>
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
      title: 'paste your webhook URL',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            in the URL field, paste this webhook URL:
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
            <p className="text-xs text-muted-foreground">additional settings:</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Payload Type:</strong> JSON</p>
              <p>• <strong>Headers:</strong> Content-Type: application/json</p>
            </div>
          </div>
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
    {
      number: 5,
      title: 'map the data fields',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            in the "Data" section, map these fields from Luma to your webhook:
          </p>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2 font-medium">Luma Field</th>
                  <th className="text-left p-2 font-medium">Webhook Key</th>
                  <th className="text-left p-2 font-medium">Required</th>
                </tr>
              </thead>
              <tbody>
                {FIELD_MAPPINGS.map((field, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2">{field.zapierField}</td>
                    <td className="p-2 font-mono">{field.webhookField}</td>
                    <td className="p-2">
                      {field.required ? (
                        <Badge variant="destructive" className="text-[10px]">required</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">optional</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => markStepComplete(5)}
          >
            <Check className="h-4 w-4 mr-2" />
            done
          </Button>
        </div>
      ),
    },
  ];

  const allComplete = completedSteps.length === 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Zapier setup guide</h3>
        </div>
        <Badge variant={allComplete ? 'default' : 'secondary'}>
          {completedSteps.length}/5 steps
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        Luma doesn't have native webhooks, so we use Zapier as a bridge. follow these steps to connect your Luma event to utm.one.
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
            turn on your Zap and test with a new registration.
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
