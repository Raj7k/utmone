import { useState, useEffect } from "react";
import { 
  Link2, Type, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  Box, Layers, Square, Circle, Lock, FileText, Image, Download, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ContentType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "location" | "event" | "vcard";
type BrickStyle = "3d" | "inverse" | "flat" | "studs";

const CONTENT_TYPES = [
  { id: "url" as ContentType, icon: Link2, label: "URL" },
  { id: "text" as ContentType, icon: Type, label: "Text" },
  { id: "email" as ContentType, icon: Mail, label: "Email" },
  { id: "phone" as ContentType, icon: Phone, label: "Phone" },
  { id: "sms" as ContentType, icon: MessageSquare, label: "SMS" },
  { id: "wifi" as ContentType, icon: Wifi, label: "WiFi" },
  { id: "location" as ContentType, icon: MapPin, label: "Location" },
  { id: "event" as ContentType, icon: Calendar, label: "Event" },
  { id: "vcard" as ContentType, icon: User, label: "vCard" },
];

const BRICK_STYLES = [
  { id: "3d" as BrickStyle, icon: Box, label: "3D" },
  { id: "inverse" as BrickStyle, icon: Layers, label: "Inverse" },
  { id: "flat" as BrickStyle, icon: Square, label: "Flat" },
  { id: "studs" as BrickStyle, icon: Circle, label: "Studs" },
];

const BRICK_COLORS = [
  { id: "white", hex: "#F4F4F4" },
  { id: "black", hex: "#1B1B1B" },
  { id: "red", hex: "#B40000" },
  { id: "blue", hex: "#0055BF" },
  { id: "yellow", hex: "#FAC80A" },
  { id: "green", hex: "#00852B" },
  { id: "orange", hex: "#FE8A18" },
  { id: "tan", hex: "#D3BC8D" },
  { id: "darkGray", hex: "#545454" },
  { id: "lightGray", hex: "#9C9C9C" },
  { id: "darkBlue", hex: "#003366" },
  { id: "darkGreen", hex: "#006400" },
  { id: "brown", hex: "#583927" },
  { id: "pink", hex: "#FF85C2" },
];

const PRO_FEATURES = [
  { icon: FileText, label: "PDF Building Instructions" },
  { icon: Image, label: "High-Res PNG Export" },
  { icon: Download, label: "BrickLink XML Export" },
  { icon: Palette, label: "Custom Color Palettes" },
];

// Generate a deterministic brick pattern based on content
const generateBrickPattern = (content: string, fg: string, bg: string, style: BrickStyle): boolean[][] => {
  const size = 16;
  const pattern: boolean[][] = [];
  const seed = content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      // Create QR-like pattern with quiet zone
      if (row < 2 || row >= size - 2 || col < 2 || col >= size - 2) {
        pattern[row][col] = false; // Quiet zone
      } else if (row < 5 && col < 5) {
        // Top-left finder pattern
        pattern[row][col] = row === 2 || row === 4 || col === 2 || col === 4 || (row === 3 && col === 3);
      } else if (row < 5 && col >= size - 5) {
        // Top-right finder pattern
        pattern[row][col] = row === 2 || row === 4 || col === size - 3 || col === size - 5 || (row === 3 && col === size - 4);
      } else if (row >= size - 5 && col < 5) {
        // Bottom-left finder pattern
        pattern[row][col] = row === size - 3 || row === size - 5 || col === 2 || col === 4 || (row === size - 4 && col === 3);
      } else {
        // Data area with pseudo-random pattern
        const hash = (seed + row * 17 + col * 31) % 100;
        pattern[row][col] = hash < 45;
      }
    }
  }
  
  return pattern;
};

export function BrickBuilderDemoWidget() {
  const [contentType, setContentType] = useState<ContentType>("url");
  const [content, setContent] = useState("https://utm.one");
  const [brickStyle, setBrickStyle] = useState<BrickStyle>("3d");
  const [fgColor, setFgColor] = useState(BRICK_COLORS[1]); // Black
  const [bgColor, setBgColor] = useState(BRICK_COLORS[0]); // White
  const [animationKey, setAnimationKey] = useState(0);

  const pattern = generateBrickPattern(content, fgColor.hex, bgColor.hex, brickStyle);

  // Trigger re-animation when pattern changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [content, fgColor.hex, bgColor.hex, brickStyle]);

  const renderBrick = (isFilled: boolean, rowIdx: number, colIdx: number) => {
    const color = isFilled ? fgColor.hex : bgColor.hex;
    const delayMs = (rowIdx + colIdx) * 10;

    if (brickStyle === "3d") {
      return (
        <div
          key={`${animationKey}-${rowIdx}-${colIdx}`}
          className="aspect-square relative opacity-0 scale-0 animate-scale-in"
          style={{ 
            backgroundColor: color,
            animationDelay: `${delayMs}ms`,
            animationFillMode: "forwards"
          }}
        >
          {/* Stud */}
          <div 
            className="absolute inset-[15%] rounded-full"
            style={{ 
              backgroundColor: color,
              boxShadow: `inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)`
            }}
          />
        </div>
      );
    }

    if (brickStyle === "studs") {
      return (
        <div
          key={`${animationKey}-${rowIdx}-${colIdx}`}
          className="aspect-square flex items-center justify-center opacity-0 scale-0 animate-scale-in"
          style={{ 
            backgroundColor: bgColor.hex,
            animationDelay: `${delayMs}ms`,
            animationFillMode: "forwards"
          }}
        >
          <div 
            className="w-[60%] h-[60%] rounded-full"
            style={{ 
              backgroundColor: isFilled ? fgColor.hex : bgColor.hex,
              boxShadow: isFilled ? `0 1px 2px rgba(0,0,0,0.2)` : 'none'
            }}
          />
        </div>
      );
    }

    // Flat or inverse
    return (
      <div
        key={`${animationKey}-${rowIdx}-${colIdx}`}
        className="aspect-square opacity-0 animate-fade-in"
        style={{ 
          backgroundColor: color,
          animationDelay: `${delayMs}ms`,
          animationFillMode: "forwards"
        }}
      />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Editor */}
        <div className="space-y-6 p-6 bg-card rounded-2xl border border-border">
          {/* Content Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">content type</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all text-xs",
                      contentType === type.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">content</Label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your URL or content..."
              className="bg-background"
            />
          </div>

          {/* Brick Style */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">brick style</Label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-muted/50 border border-border">
              {BRICK_STYLES.map((style) => {
                const Icon = style.icon;
                return (
                  <button
                    key={style.id}
                    onClick={() => setBrickStyle(style.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-all text-xs font-medium",
                      brickStyle === style.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">foreground</Label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-muted/50 border border-border">
                {BRICK_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setFgColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-md transition-all border-2",
                      fgColor.id === color.id
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">background</Label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-muted/50 border border-border">
                {BRICK_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setBgColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-md transition-all border-2",
                      bgColor.id === color.id
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          {/* Brick Grid Preview */}
          <div className="relative p-4 bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl" />
            <div 
              className="relative bg-card rounded-xl p-3 shadow-inner grid gap-[1px]"
              style={{ gridTemplateColumns: `repeat(16, 1fr)` }}
            >
              {pattern.map((row, rowIdx) =>
                row.map((cell, colIdx) => renderBrick(cell, rowIdx, colIdx))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-card rounded-xl border border-border">
              <div className="text-lg font-bold">256</div>
              <div className="text-xs text-muted-foreground">bricks</div>
            </div>
            <div className="text-center p-3 bg-card rounded-xl border border-border">
              <div className="text-lg font-bold">16×16</div>
              <div className="text-xs text-muted-foreground">studs</div>
            </div>
            <div className="text-center p-3 bg-card rounded-xl border border-border">
              <div className="text-lg font-bold">~13cm</div>
              <div className="text-xs text-muted-foreground">size</div>
            </div>
          </div>

          {/* PRO Features Locked */}
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">unlock pro features</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRO_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
            <Button size="sm" className="w-full" asChild>
              <a href="/signup">sign up to build & export →</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
