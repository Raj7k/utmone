import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemePickerProps {
  value: string;
  onChange: (theme: string) => void;
}

const THEMES = [
  // Solid themes
  { id: "default", label: "Default", colors: "bg-background border-border" },
  { id: "dark", label: "Dark", colors: "bg-zinc-900 border-zinc-700" },
  { id: "minimal", label: "Minimal", colors: "bg-white border-zinc-200" },
  
  // Gradient themes
  { id: "gradient-purple", label: "Purple", colors: "bg-gradient-to-br from-purple-600 to-pink-500 border-purple-400" },
  { id: "gradient-orange", label: "Orange", colors: "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400" },
  { id: "gradient-green", label: "Green", colors: "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400" },
  { id: "gradient-blue", label: "Blue", colors: "bg-gradient-to-br from-blue-400 to-cyan-400 border-blue-400" },
  { id: "gradient-sunset", label: "Sunset", colors: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 border-orange-400" },
  { id: "gradient-ocean", label: "Ocean", colors: "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400" },
  { id: "gradient-rose", label: "Rose", colors: "bg-gradient-to-br from-rose-400 to-pink-600 border-rose-400" },
  { id: "gradient-slate", label: "Slate", colors: "bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500" },
];

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Theme:</span>
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <Tooltip key={theme.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onChange(theme.id)}
                  className={cn(
                    "relative w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110",
                    theme.colors,
                    value === theme.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                >
                  {value === theme.id && (
                    <Check className={cn(
                      "absolute inset-0 m-auto h-3.5 w-3.5",
                      theme.id.startsWith("gradient") || theme.id === "dark" 
                        ? "text-white" 
                        : "text-primary"
                    )} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {theme.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
