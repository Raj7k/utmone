import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getKeyboardShortcut } from "@/lib/accessibility";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsHelp = ({ open, onOpenChange }: KeyboardShortcutsHelpProps) => {
  const shortcuts = [
    {
      keys: getKeyboardShortcut('K'),
      description: 'create new link',
      category: 'actions'
    },
    {
      keys: getKeyboardShortcut('/'),
      description: 'focus search',
      category: 'navigation'
    },
    {
      keys: getKeyboardShortcut('?'),
      description: 'show keyboard shortcuts',
      category: 'help'
    },
    {
      keys: 'Escape',
      description: 'close any dialog',
      category: 'navigation'
    },
    {
      keys: 'Tab',
      description: 'navigate between elements',
      category: 'navigation'
    },
    {
      keys: 'Enter',
      description: 'activate focused element',
      category: 'actions'
    },
  ];

  const categories = {
    actions: 'Quick Actions',
    navigation: 'Navigation',
    help: 'Help',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-labelledby="keyboard-shortcuts-title">
        <DialogHeader>
          <DialogTitle id="keyboard-shortcuts-title" className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            keyboard shortcuts
          </DialogTitle>
          <DialogDescription>
            use these shortcuts to navigate faster.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(categories).map(([category, title]) => (
            <div key={category}>
              <h3 className="text-sm font-display font-medium text-muted-foreground mb-3">{title}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            tip: all interactive elements can be accessed using the Tab key.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
