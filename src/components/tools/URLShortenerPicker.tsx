import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Layers, Sparkles } from "lucide-react";
import { useGTMEvents } from "@/components/integrations/GTMProvider";

interface URLShortenerPickerProps {
  onSelectMode: (mode: "shortener-single" | "shortener-bulk" | "shortener-advanced") => void;
}

export const URLShortenerPicker = ({ onSelectMode }: URLShortenerPickerProps) => {
  const { trackBulkModeSelected } = useGTMEvents();

  const handleModeSelect = (mode: "shortener-single" | "shortener-bulk" | "shortener-advanced") => {
    // Track mode selection
    const modeMap = {
      "shortener-single": "single",
      "shortener-bulk": "bulk",
      "shortener-advanced": "advanced",
    } as const;
    trackBulkModeSelected(modeMap[mode]);
    onSelectMode(mode);
  };
  const modes = [
    {
      id: "shortener-single" as const,
      name: "single",
      quantity: "1 url",
      description: "create one short link",
      hint: "best for quick, one-off links",
      icon: Link2,
    },
    {
      id: "shortener-bulk" as const,
      name: "bulk",
      quantity: "10+ urls",
      description: "process many urls at once",
      hint: "paste a list, get links instantly",
      icon: Layers,
    },
    {
      id: "shortener-advanced" as const,
      name: "advanced",
      quantity: "100+ urls",
      description: "full control with templates & utm",
      hint: "for campaigns with strict tracking rules",
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card
              key={mode.id}
              className="cursor-pointer transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:scale-[1.02] hover:border-white/20"
              onClick={() => handleModeSelect(mode.id)}
            >
              <CardHeader className="p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <Icon className="h-8 w-8" style={{ color: 'rgba(59,130,246,1)' }} />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-display font-semibold">{mode.name}</CardTitle>
                    <div className="text-xs font-medium" style={{ color: 'rgba(59,130,246,1)' }}>{mode.quantity}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center space-y-1">
                <CardDescription className="text-sm">{mode.description}</CardDescription>
                <p className="text-xs text-muted-foreground/70">{mode.hint}</p>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};
