import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsOptions {
  onCreateLink?: () => void;
  onSearch?: () => void;
  onShowHelp?: () => void;
}

/**
 * Global keyboard shortcuts hook
 * Implements common keyboard shortcuts for the application
 */
export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes('Mac');
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: Create new link
      if (modKey && e.key === 'k') {
        e.preventDefault();
        if (options.onCreateLink) {
          options.onCreateLink();
        } else {
          navigate('/links');
        }
      }

      // Cmd/Ctrl + /: Focus search
      if (modKey && e.key === '/') {
        e.preventDefault();
        if (options.onSearch) {
          options.onSearch();
        } else {
          const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]');
          if (searchInput) {
            searchInput.focus();
          }
        }
      }

      // Cmd/Ctrl + ?: Show keyboard shortcuts help
      if (modKey && e.key === '?') {
        e.preventDefault();
        if (options.onShowHelp) {
          options.onShowHelp();
        }
      }

      // Escape: Close any open dialog/modal
      if (e.key === 'Escape') {
        const closeButton = document.querySelector<HTMLButtonElement>('[aria-label="Close dialog"]');
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, options]);
};

/**
 * Get keyboard shortcut display text
 */
export const getKeyboardShortcut = (key: string): string => {
  const isMac = typeof window !== 'undefined' && navigator.platform.includes('Mac');
  const modKey = isMac ? '⌘' : 'Ctrl';
  return `${modKey}+${key}`;
};
