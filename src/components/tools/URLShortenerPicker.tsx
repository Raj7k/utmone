import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Layers, Sparkles } from "lucide-react";

interface URLShortenerPickerProps {
  onSelectMode: (mode: "shortener-single" | "shortener-bulk" | "shortener-advanced") => void;
}

export const URLShortenerPicker = ({ onSelectMode }: URLShortenerPickerProps) => {
  const modes = [
    {
      id: "shortener-single" as const,
      name: "single",
      quantity: "1 url",
      description: "create one short link",
      icon: Link2,
    },
    {
      id: "shortener-bulk" as const,
      name: "bulk",
      quantity: "10+ urls",
      description: "process many urls at once",
      icon: Layers,
    },
    {
      id: "shortener-advanced" as const,
      name: "advanced",
      quantity: "100+ urls",
      description: "full control with templates & utm",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-semibold text-label">url shortener</h3>
        <p className="text-sm text-secondary-label">choose how you'd like to shorten</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card
              key={mode.id}
              className="cursor-pointer transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:scale-[1.02] hover:border-primary/20"
              onClick={() => onSelectMode(mode.id)}
            >
              <CardHeader className="p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-display font-semibold">{mode.name}</CardTitle>
                    <div className="text-xs font-medium text-primary">{mode.quantity}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center">
                <CardDescription className="text-sm">{mode.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
