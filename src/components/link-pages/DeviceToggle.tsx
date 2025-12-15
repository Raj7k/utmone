import { Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeviceToggleProps {
  value: "mobile" | "desktop";
  onChange: (device: "mobile" | "desktop") => void;
}

export function DeviceToggle({ value, onChange }: DeviceToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 w-7 p-0",
          value === "mobile" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("mobile")}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 w-7 p-0",
          value === "desktop" && "bg-background shadow-sm"
        )}
        onClick={() => onChange("desktop")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
