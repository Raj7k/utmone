import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ModalContextType {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  // Early Access modal
  isEarlyAccessModalOpen: boolean;
  setEarlyAccessModalOpen: (open: boolean) => void;
  earlyAccessPrefillEmail: string | null;
  openEarlyAccessModal: (prefillEmail?: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEarlyAccessModalOpen, setEarlyAccessModalOpen] = useState(false);
  const [earlyAccessPrefillEmail, setEarlyAccessPrefillEmail] = useState<string | null>(null);

  const openEarlyAccessModal = useCallback((prefillEmail?: string) => {
    setEarlyAccessPrefillEmail(prefillEmail || null);
    setEarlyAccessModalOpen(true);
  }, []);

  return (
    <ModalContext.Provider value={{ 
      isCreateModalOpen, 
      setCreateModalOpen,
      isEarlyAccessModalOpen,
      setEarlyAccessModalOpen,
      earlyAccessPrefillEmail,
      openEarlyAccessModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};
