import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ThemePickerProps {
  value: string;
  onChange: (theme: string) => void;
}

const THEMES = [
  { id: "default", label: "Default", colors: "bg-background border-border" },
  { id: "dark", label: "Dark", colors: "bg-zinc-900 border-zinc-700" },
  { id: "gradient", label: "Gradient", colors: "bg-gradient-to-br from-purple-600 to-pink-500 border-purple-400" },
  { id: "minimal", label: "Minimal", colors: "bg-white border-zinc-200" },
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Theme:</span>
      <div className="flex gap-1">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "relative w-6 h-6 rounded-full border-2 transition-all",
              theme.colors,
              value === theme.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            title={theme.label}
          >
            {value === theme.id && (
              <Check className="absolute inset-0 m-auto h-3 w-3 text-primary-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
