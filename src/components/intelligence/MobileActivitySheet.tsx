import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Activity } from "lucide-react";
import LiveActivityRail from "./LiveActivityRail";

interface MobileActivitySheetProps {
  workspaceId?: string;
}

export default function MobileActivitySheet({ workspaceId }: MobileActivitySheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="xl:hidden fixed bottom-4 right-4 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <Activity className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] p-0 overflow-y-auto">
          <div className="p-4">
            <LiveActivityRail workspaceId={workspaceId} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
