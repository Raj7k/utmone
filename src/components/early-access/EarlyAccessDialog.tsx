import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EarlyAccessStepForm } from "./EarlyAccessStepForm";
import { CheckCircle2 } from "lucide-react";

interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillEmail?: string | null;
}

export const EarlyAccessDialog = ({
  open,
  onOpenChange,
  prefillEmail,
}: EarlyAccessDialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const handleSuccess = (data: { id: string; referral_code: string }) => {
    setReferralCode(data.referral_code);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setIsSubmitted(false);
      setReferralCode("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[680px] max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground brand-lowercase">
                join the early circle
              </h2>
              <p className="text-base text-muted-foreground brand-lowercase">
                be among the first to use utm.one
              </p>
            </div>
            <EarlyAccessStepForm
              onSuccess={handleSuccess}
              prefillEmail={prefillEmail}
            />
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto text-primary/80" />
            <h2 className="text-2xl md:text-3xl font-display font-bold brand-lowercase">
              thanks — we'll reach out soon.
            </h2>
            <p className="text-base text-muted-foreground brand-lowercase">
              your request has been received. we'll be in touch when a spot opens.
            </p>
            {referralCode && (
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-sm text-muted-foreground mb-2 brand-lowercase">
                  share your referral link
                </p>
                <code className="text-sm px-3 py-2 rounded border block break-all" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                  {window.location.origin}/early-access?ref={referralCode}
                </code>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};