import { useModal } from "@/contexts/ModalContext";

/**
 * Hook to control the Create Link Modal from anywhere in the app
 */
export const useCreateLinkModal = () => {
  const { isCreateModalOpen, setCreateModalOpen } = useModal();

  const openModal = () => setCreateModalOpen(true);
  const closeModal = () => setCreateModalOpen(false);
  const toggleModal = () => setCreateModalOpen(!isCreateModalOpen);

  return {
    isOpen: isCreateModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
