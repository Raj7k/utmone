import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateQRMatrix, QRMatrixResult, BrickStyle, BrickColorId } from "@/lib/qrMatrix";
import { StepContent } from "./steps/StepContent";
import { StepStyle } from "./steps/StepStyle";
import { StepPreview } from "./steps/StepPreview";

const STEPS = [
  { id: 1, label: "Content", description: "what to encode" },
  { id: 2, label: "Style", description: "how it looks" },
  { id: 3, label: "Preview", description: "download" },
];

export const BrickBuilderWizard = () => {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [style, setStyle] = useState<BrickStyle>("3d");
  const [foreground, setForeground] = useState<BrickColorId>("black");
  const [background, setBackground] = useState<BrickColorId>("white");
  const [result, setResult] = useState<QRMatrixResult>({
    matrix: [],
    size: 0,
    moduleCount: 0,
    partsCounts: { foreground: 0, background: 0, total: 0 },
    physicalSize: { cm: 0, inches: 0 },
    isValid: false,
    warning: "enter content to generate QR code"
  });

  // Generate QR matrix when content changes
  useEffect(() => {
    const generate = async () => {
      const qrResult = await generateQRMatrix(content);
      setResult(qrResult);
    };
    const debounce = setTimeout(generate, 300);
    return () => clearTimeout(debounce);
  }, [content]);

  const canProceed = () => {
    if (step === 1) return content.length > 0 && result.isValid;
    if (step === 2) return true;
    return false;
  };

  const nextStep = () => {
    if (step < 3 && canProceed()) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              disabled={s.id > step}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : step > s.id
                  ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                step > s.id ? "bg-primary text-primary-foreground" : "bg-background/20"
              )}>
                {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
              </span>
              <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-1",
                step > s.id ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {step === 1 && (
          <StepContent value={content} onChange={setContent} />
        )}
        {step === 2 && (
          <StepStyle
            style={style}
            onStyleChange={setStyle}
            foreground={foreground}
            background={background}
            onForegroundChange={setForeground}
            onBackgroundChange={setBackground}
          />
        )}
        {step === 3 && (
          <StepPreview
            result={result}
            style={style}
            foreground={foreground}
            background={background}
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          back
        </Button>
        
        {step < 3 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setStep(1);
              setContent("");
            }}
            className="gap-2"
          >
            create another
          </Button>
        )}
      </div>
    </div>
  );
};
