import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Zap, QrCode, Sparkles } from "lucide-react";

interface ToolSelectorProps {
  onSelectTool: (tool: "utm" | "shortener" | "qr" | "forge") => void;
}

export const ToolSelector = ({ onSelectTool }: ToolSelectorProps) => {
  const tools = [
    {
      id: "utm" as const,
      name: "UTM Builder",
      description: "Build UTM parameters with quick templates",
      icon: Sparkles,
      color: "text-blue-600",
    },
    {
      id: "shortener" as const,
      name: "URL Shortener",
      description: "Create short, memorable links",
      icon: Link2,
      color: "text-green-600",
    },
    {
      id: "qr" as const,
      name: "QR Generator",
      description: "Generate branded QR codes",
      icon: QrCode,
      color: "text-purple-600",
    },
    {
      id: "forge" as const,
      name: "Link Forge",
      description: "All-in-one: UTM + Shortener + QR",
      icon: Zap,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Card
            key={tool.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
            onClick={() => onSelectTool(tool.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${tool.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{tool.description}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
