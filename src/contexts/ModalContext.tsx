import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface ModalContextType {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  // Early Access modal
  isEarlyAccessModalOpen: boolean;
  setEarlyAccessModalOpen: (open: boolean) => void;
  earlyAccessPrefillEmail: string | null;
  openEarlyAccessModal: (prefillEmail?: string) => void;
  // Full-screen email capture overlay
  isEmailCaptureOpen: boolean;
  setEmailCaptureOpen: (open: boolean) => void;
  openEmailCapture: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const noopModalContextValue: ModalContextType = {
  isCreateModalOpen: false,
  setCreateModalOpen: () => {},
  isEarlyAccessModalOpen: false,
  setEarlyAccessModalOpen: () => {},
  earlyAccessPrefillEmail: null,
  openEarlyAccessModal: () => {},
  isEmailCaptureOpen: false,
  setEmailCaptureOpen: () => {},
  openEmailCapture: () => {},
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEarlyAccessModalOpen, setEarlyAccessModalOpen] = useState(false);
  const [earlyAccessPrefillEmail, setEarlyAccessPrefillEmail] = useState<string | null>(null);
  const [isEmailCaptureOpen, setEmailCaptureOpen] = useState(false);

  const openEarlyAccessModal = useCallback((prefillEmail?: string) => {
    setEarlyAccessPrefillEmail(prefillEmail || null);
    setEarlyAccessModalOpen(true);
  }, []);

  const openEmailCapture = useCallback(() => {
    setEmailCaptureOpen(true);
  }, []);

  return (
    <ModalContext.Provider value={{ 
      isCreateModalOpen, 
      setCreateModalOpen,
      isEarlyAccessModalOpen,
      setEarlyAccessModalOpen,
      earlyAccessPrefillEmail,
      openEarlyAccessModal,
      isEmailCaptureOpen,
      setEmailCaptureOpen,
      openEmailCapture
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
