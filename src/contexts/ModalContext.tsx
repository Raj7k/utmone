import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isCreateModalOpen, setCreateModalOpen }}>
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
