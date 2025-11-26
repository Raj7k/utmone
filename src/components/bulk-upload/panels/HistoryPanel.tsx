import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel = ({ isOpen, onClose }: HistoryPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>upload history</SheetTitle>
          <SheetDescription>
            view detailed information about past bulk uploads
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">history details will appear here</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
