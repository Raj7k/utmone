import { useEffect } from 'react';

interface UseHelpKeyboardOptions {
  onToggle: () => void;
}

export const useHelpKeyboard = ({ onToggle }: UseHelpKeyboardOptions) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Listen for "?" key (Shift + /)
      if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
        // Don't trigger if user is typing in an input/textarea
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
        
        event.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggle]);
};
