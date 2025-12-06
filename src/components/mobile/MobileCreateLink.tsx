import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileCreateLinkProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const MobileCreateLink = ({ onClose, onSubmit }: MobileCreateLinkProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    destinationUrl: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-system-background z-50 md:hidden">
      {/* Header */}
      <div className="h-14 border-b border-separator flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold ml-4">Create Link</h2>
      </div>

      {/* Progress */}
      <div className="flex gap-2 px-4 py-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              s <= step ? "bg-primary" : "bg-fill-tertiary"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="px-4 py-6 space-y-6"
      >
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Link Title</Label>
              <Input
                id="title"
                placeholder="My Campaign Link"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url" className="text-base">Destination URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.destinationUrl}
                onChange={(e) => updateField("destinationUrl", e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="source" className="text-base">UTM Source</Label>
              <Input
                id="source"
                placeholder="google, facebook, email"
                value={formData.utmSource}
                onChange={(e) => updateField("utmSource", e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium" className="text-base">UTM Medium</Label>
              <Input
                id="medium"
                placeholder="cpc, social, email"
                value={formData.utmMedium}
                onChange={(e) => updateField("utmMedium", e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="campaign" className="text-base">UTM Campaign</Label>
              <Input
                id="campaign"
                placeholder="summer-sale-2025"
                value={formData.utmCampaign}
                onChange={(e) => updateField("utmCampaign", e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>

            <div className="p-4 bg-fill-tertiary rounded-lg space-y-2">
              <p className="text-sm text-secondary-label">Preview</p>
              <p className="text-sm font-mono break-all">
                {formData.destinationUrl}
                {formData.utmSource && `?utm_source=${formData.utmSource}`}
                {formData.utmMedium && `&utm_medium=${formData.utmMedium}`}
                {formData.utmCampaign && `&utm_campaign=${formData.utmCampaign}`}
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-separator bg-system-background">
        {step < 3 ? (
          <Button
            onClick={handleNext}
            className="w-full h-12"
            disabled={
              (step === 1 && (!formData.title || !formData.destinationUrl)) ||
              (step === 2 && !formData.utmSource)
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="w-full h-12">
            Create Link
          </Button>
        )}
      </div>
    </div>
  );
};
