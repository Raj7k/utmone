import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';

interface KeyboardShortcutsContextType {
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;
  isModalOpen: boolean;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
};

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  onCreateLink?: () => void;
}

export const KeyboardShortcutsProvider = ({ children, onCreateLink }: KeyboardShortcutsProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openShortcutsModal = useCallback(() => setIsModalOpen(true), []);
  const closeShortcutsModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes('Mac');
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape in inputs
        if (e.key !== 'Escape') return;
      }

      // ⌘+? or ⌘+Shift+/ - Show keyboard shortcuts
      if (modKey && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setIsModalOpen(true);
        return;
      }

      // ⌘+K - Create new link
      if (modKey && e.key === 'k') {
        e.preventDefault();
        if (onCreateLink) {
          onCreateLink();
        } else {
          navigate('/dashboard/links');
        }
        return;
      }

      // ⌘+/ - Focus search
      if (modKey && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="search" i]');
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      // ⌘+D - Dashboard home
      if (modKey && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
        return;
      }

      // ⌘+B - Toggle sidebar
      if (modKey && e.key === 'b') {
        e.preventDefault();
        const sidebarToggle = document.querySelector<HTMLButtonElement>('[data-sidebar-toggle]');
        if (sidebarToggle) {
          sidebarToggle.click();
        }
        return;
      }

      // Number shortcuts for quick navigation (⌘+1 through ⌘+5)
      if (modKey && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/dashboard/links');
            break;
          case '2':
            e.preventDefault();
            navigate('/dashboard/qr-codes');
            break;
          case '3':
            e.preventDefault();
            navigate('/dashboard/intelligence');
            break;
          case '4':
            e.preventDefault();
            navigate('/dashboard/events');
            break;
          case '5':
            e.preventDefault();
            navigate('/dashboard/sales');
            break;
        }
      }

      // Escape - Close modal or any open dialog
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onCreateLink, isModalOpen]);

  return (
    <KeyboardShortcutsContext.Provider value={{ openShortcutsModal, closeShortcutsModal, isModalOpen }}>
      {children}
      <KeyboardShortcutsHelp open={isModalOpen} onOpenChange={setIsModalOpen} />
    </KeyboardShortcutsContext.Provider>
  );
};
