import { useModal } from "@/contexts/ModalContext";
import { EarlyAccessDialog } from "./EarlyAccessDialog";
import { FullScreenEmailCapture } from "./FullScreenEmailCapture";

export const GlobalEarlyAccessModal = () => {
  const { 
    isEarlyAccessModalOpen, 
    setEarlyAccessModalOpen, 
    earlyAccessPrefillEmail,
    isEmailCaptureOpen,
    setEmailCaptureOpen
  } = useModal();

  return (
    <>
      <FullScreenEmailCapture
        open={isEmailCaptureOpen}
        onOpenChange={setEmailCaptureOpen}
      />
      <EarlyAccessDialog
        open={isEarlyAccessModalOpen}
        onOpenChange={setEarlyAccessModalOpen}
        prefillEmail={earlyAccessPrefillEmail}
      />
    </>
  );
};