import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface MyLinksToggleProps {
  value: "my" | "all";
  onChange: (value: "my" | "all") => void;
}

export const MyLinksToggle = ({ value, onChange }: MyLinksToggleProps) => {
  return (
    <div className="inline-flex rounded-lg border border-separator bg-muted/30 p-1">
      <Button
        variant={value === "my" ? "system" : "ghost"}
        size="sm"
        onClick={() => onChange("my")}
        className="gap-2"
      >
        <User className="h-4 w-4" />
        My Links
      </Button>
      <Button
        variant={value === "all" ? "system" : "ghost"}
        size="sm"
        onClick={() => onChange("all")}
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        All Links
      </Button>
    </div>
  );
};
