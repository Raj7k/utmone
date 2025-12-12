import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EarlyAccessStepForm } from "./EarlyAccessStepForm";
import { SuccessScreen } from "./SuccessScreen";

interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillEmail?: string | null;
}

interface SuccessData {
  id: string;
  referral_code: string;
  name: string;
  email: string;
  position: number;
}

export const EarlyAccessDialog = ({
  open,
  onOpenChange,
  prefillEmail,
}: EarlyAccessDialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const handleSuccess = (data: { id: string; referral_code: string; name: string; email: string; position: number }) => {
    setSuccessData(data);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setIsSubmitted(false);
      setSuccessData(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className={`${isSubmitted ? 'max-w-4xl' : 'max-w-[680px]'} max-h-[90vh] overflow-y-auto transition-all duration-300`}
      >
        {!isSubmitted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                join the early circle
              </h2>
              <p className="text-base text-muted-foreground">
                be among the first to use utm.one
              </p>
            </div>
            <EarlyAccessStepForm
              onSuccess={handleSuccess}
              prefillEmail={prefillEmail}
            />
          </div>
        ) : successData && (
          <SuccessScreen
            userName={successData.name}
            referralCode={successData.referral_code}
            queuePosition={successData.position}
            email={successData.email}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};