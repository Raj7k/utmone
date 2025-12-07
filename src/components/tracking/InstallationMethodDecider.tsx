import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Code, Layers, CheckCircle2, ArrowRight } from "lucide-react";

interface InstallationMethodDeciderProps {
  onMethodSelect: (method: 'direct' | 'gtm') => void;
}

export const InstallationMethodDecider = ({ onMethodSelect }: InstallationMethodDeciderProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'direct' | 'gtm' | null>(null);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-3 mb-4">
        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">which installation method should I use?</h3>
          <p className="text-sm text-muted-foreground">
            choose based on how your website is set up
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Direct Install Option */}
        <button
          onClick={() => {
            setSelectedMethod('direct');
            onMethodSelect('direct');
          }}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            selectedMethod === 'direct'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedMethod === 'direct' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Code className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">direct install</p>
              <p className="text-xs text-muted-foreground">paste in your HTML</p>
            </div>
            {selectedMethod === 'direct' && (
              <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            best if you <strong>don't use</strong> Google Tag Manager, or prefer to paste code directly into your website's &lt;head&gt; tag
          </p>
        </button>

        {/* GTM Option */}
        <button
          onClick={() => {
            setSelectedMethod('gtm');
            onMethodSelect('gtm');
          }}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            selectedMethod === 'gtm'
              ? 'border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedMethod === 'gtm' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">via google tag manager</p>
              <p className="text-xs text-muted-foreground">add as GTM tag</p>
            </div>
            {selectedMethod === 'gtm' && (
              <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            best if you <strong>already use</strong> GTM to manage your tracking scripts and marketing tags
          </p>
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <span className="text-amber-600 dark:text-amber-400 text-lg">⚠️</span>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>choose one method only!</strong> installing both will cause duplicate tracking events
        </p>
      </div>

      {selectedMethod && (
        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
          <ArrowRight className="h-4 w-4" />
          <span>
            scroll down to see the {selectedMethod === 'direct' ? 'step-by-step installation' : 'GTM installation'} guide
          </span>
        </div>
      )}
    </Card>
  );
};
