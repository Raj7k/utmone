import { useModal } from "@/contexts/ModalContext";
import { EarlyAccessDialog } from "./EarlyAccessDialog";

export const GlobalEarlyAccessModal = () => {
  const { isEarlyAccessModalOpen, setEarlyAccessModalOpen, earlyAccessPrefillEmail } = useModal();

  return (
    <EarlyAccessDialog
      open={isEarlyAccessModalOpen}
      onOpenChange={setEarlyAccessModalOpen}
      prefillEmail={earlyAccessPrefillEmail}
    />
  );
};
