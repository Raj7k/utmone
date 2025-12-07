import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProspectTagInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProspectTagInput = ({ value, onChange }: ProspectTagInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prospect-name" className="text-sm text-muted-foreground flex items-center gap-2">
        <User className="h-4 w-4" />
        who is this for?
      </Label>
      <Input
        id="prospect-name"
        placeholder="e.g., John Doe - Acme Corp"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background border-border"
      />
      <p className="text-xs text-muted-foreground">
        this name will appear in your alerts when they click
      </p>
    </div>
  );
};
