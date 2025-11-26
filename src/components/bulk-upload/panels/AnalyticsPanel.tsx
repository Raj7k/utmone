import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsPanel = ({ isOpen, onClose }: AnalyticsPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>bulk upload analytics</SheetTitle>
          <SheetDescription>
            detailed metrics for this bulk upload
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">analytics details will appear here</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
