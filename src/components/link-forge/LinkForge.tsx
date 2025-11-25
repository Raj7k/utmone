import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StepIndicator } from "./StepIndicator";
import { Step1UTMBuilder } from "./Step1UTMBuilder";
import { Step2Shortener } from "./Step2Shortener";
import { Step3QRCode } from "./Step3QRCode";
import { LinkJourneySummary } from "./LinkJourneySummary";

interface LinkForgeProps {
  workspaceId: string;
  onSuccess?: (linkId: string, shortUrl: string) => void;
}

interface WorkflowUrls {
  original: string;
  utm: string;
  shortened: string;
  linkId: string;
}

export const LinkForge = ({ workspaceId, onSuccess }: LinkForgeProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowUrls, setWorkflowUrls] = useState<WorkflowUrls>({
    original: "",
    utm: "",
    shortened: "",
    linkId: "",
  });

  const steps = [
    { number: 1, label: "utm builder" },
    { number: 2, label: "shortener" },
    { number: 3, label: "qr code" },
  ];

  const completedSteps = [
    !!workflowUrls.utm,
    !!workflowUrls.shortened,
    false, // QR is optional
  ];

  const handleUTMComplete = (original: string, utm: string) => {
    setWorkflowUrls((prev) => ({ ...prev, original, utm }));
    setCurrentStep(2);
  };

  const handleShortenerComplete = (linkId: string, shortUrl: string) => {
    setWorkflowUrls((prev) => ({ ...prev, shortened: shortUrl, linkId }));
    setCurrentStep(3);
    onSuccess?.(linkId, shortUrl);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setWorkflowUrls({
      original: "",
      utm: "",
      shortened: "",
      linkId: "",
    });
  };

  return (
    <div className="space-y-6">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={3}
        completedSteps={completedSteps}
        onStepClick={(step) => {
          if (step === 1) setCurrentStep(1);
          if (step === 2 && workflowUrls.utm) setCurrentStep(2);
          if (step === 3 && workflowUrls.shortened) setCurrentStep(3);
        }}
        steps={steps}
      />

      <Card className="p-6 md:p-8">
        {currentStep === 1 && (
          <Step1UTMBuilder
            workspaceId={workspaceId}
            onComplete={handleUTMComplete}
          />
        )}

        {currentStep === 2 && (
          <Step2Shortener
            workspaceId={workspaceId}
            utmUrl={workflowUrls.utm}
            originalUrl={workflowUrls.original}
            onComplete={handleShortenerComplete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3QRCode
            linkId={workflowUrls.linkId}
            shortUrl={workflowUrls.shortened}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </Card>

      {(workflowUrls.utm || workflowUrls.shortened) && (
        <LinkJourneySummary
          original={workflowUrls.original}
          utm={workflowUrls.utm}
          shortened={workflowUrls.shortened}
          onReset={handleReset}
        />
      )}
    </div>
  );
};
