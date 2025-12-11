import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getModKey = () => {
  const isMac = typeof window !== 'undefined' && navigator.platform.includes('Mac');
  return isMac ? '⌘' : 'Ctrl';
};

export const KeyboardShortcutsHelp = ({ open, onOpenChange }: KeyboardShortcutsHelpProps) => {
  const mod = getModKey();

  const shortcutCategories = [
    {
      title: 'Quick Navigation',
      shortcuts: [
        { keys: `${mod}+D`, description: 'go to dashboard' },
        { keys: `${mod}+1`, description: 'go to links' },
        { keys: `${mod}+2`, description: 'go to QR codes' },
        { keys: `${mod}+3`, description: 'go to analytics' },
        { keys: `${mod}+4`, description: 'go to events' },
        { keys: `${mod}+5`, description: 'go to sales' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: `${mod}+K`, description: 'create new link' },
        { keys: `${mod}+/`, description: 'focus search' },
        { keys: `${mod}+B`, description: 'toggle sidebar' },
      ],
    },
    {
      title: 'General',
      shortcuts: [
        { keys: `${mod}+?`, description: 'show keyboard shortcuts' },
        { keys: 'Esc', description: 'close dialog' },
        { keys: 'Tab', description: 'navigate between elements' },
        { keys: 'Enter', description: 'activate focused element' },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border" aria-labelledby="keyboard-shortcuts-title">
        <DialogHeader>
          <DialogTitle id="keyboard-shortcuts-title" className="flex items-center gap-2 text-foreground">
            <Keyboard className="h-5 w-5" />
            keyboard shortcuts
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            navigate faster with these shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {shortcutCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <kbd className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-muted-foreground bg-muted border border-border rounded">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border mt-2">
          <p className="text-xs text-muted-foreground text-center">
            press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded">{mod}+?</kbd> anytime to see this
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
