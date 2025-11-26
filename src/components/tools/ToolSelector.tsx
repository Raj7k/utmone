import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Zap, QrCode, Sparkles } from "lucide-react";

interface ToolSelectorProps {
  onSelectTool: (tool: "utm" | "shortener" | "bulk" | "qr" | "forge") => void;
}

export const ToolSelector = ({ onSelectTool }: ToolSelectorProps) => {
  const tools = [
    {
      id: "utm" as const,
      name: "utm builder",
      description: "build utm parameters with quick templates",
      icon: Sparkles,
    },
    {
      id: "shortener" as const,
      name: "url shortener",
      description: "create short, memorable links",
      icon: Link2,
    },
    {
      id: "bulk" as const,
      name: "bulk shortener",
      description: "process hundreds of urls at once",
      icon: Zap,
    },
    {
      id: "qr" as const,
      name: "qr generator",
      description: "generate branded qr codes",
      icon: QrCode,
    },
    {
      id: "forge" as const,
      name: "link forge",
      description: "all-in-one: utm + shortener + qr",
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Card
            key={tool.id}
            className="cursor-pointer transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:scale-[1.02] min-w-0 overflow-hidden"
            onClick={() => onSelectTool(tool.id)}
          >
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-display font-semibold">{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
