import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical,
  BadgeCheck, 
  BarChart3,
  EyeOff,
  Clock,
  Globe,
  ArrowRight,
  Sparkles,
  Link2,
  Type,
  MessageSquare,
  Share2,
  Minus,
  Image,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Monitor,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const THEMES = [
  { id: "default", label: "Default", colors: "bg-zinc-800", preview: "from-zinc-700 to-zinc-900" },
  { id: "dark", label: "Dark", colors: "bg-zinc-900", preview: "from-zinc-800 to-black" },
  { id: "minimal", label: "Minimal", colors: "bg-white border border-zinc-200", preview: "from-white to-zinc-100" },
  { id: "gradient-purple", label: "Purple", colors: "bg-gradient-to-br from-purple-600 to-pink-500", preview: "from-purple-600 to-pink-500" },
  { id: "gradient-orange", label: "Orange", colors: "bg-gradient-to-br from-amber-500 to-orange-600", preview: "from-amber-500 to-orange-600" },
  { id: "gradient-green", label: "Green", colors: "bg-gradient-to-br from-emerald-500 to-teal-600", preview: "from-emerald-500 to-teal-600" },
  { id: "gradient-blue", label: "Blue", colors: "bg-gradient-to-br from-blue-400 to-cyan-400", preview: "from-blue-400 to-cyan-400" },
  { id: "gradient-sunset", label: "Sunset", colors: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600", preview: "from-orange-400 via-pink-500 to-purple-600" },
  { id: "gradient-ocean", label: "Ocean", colors: "bg-gradient-to-br from-cyan-500 to-blue-600", preview: "from-cyan-500 to-blue-600" },
  { id: "gradient-rose", label: "Rose", colors: "bg-gradient-to-br from-rose-400 to-pink-600", preview: "from-rose-400 to-pink-600" },
  { id: "gradient-slate", label: "Slate", colors: "bg-gradient-to-br from-slate-600 to-slate-800", preview: "from-slate-600 to-slate-800" },
];

type BlockType = "link" | "header" | "text" | "social" | "divider" | "image";

interface Block {
  id: string;
  type: BlockType;
  content: Record<string, string>;
}

const BLOCK_TYPES: { type: BlockType; icon: typeof Link2; label: string }[] = [
  { type: "link", icon: Link2, label: "Link" },
  { type: "header", icon: Type, label: "Header" },
  { type: "text", icon: MessageSquare, label: "Text" },
  { type: "social", icon: Share2, label: "Social" },
  { type: "divider", icon: Minus, label: "Divider" },
  { type: "image", icon: Image, label: "Image" },
];

const PRO_FEATURES = [
  { icon: BadgeCheck, label: "Verified Badge" },
  { icon: BarChart3, label: "Analytics Dashboard" },
  { icon: EyeOff, label: "Hide Branding" },
  { icon: Globe, label: "Custom Domain" },
  { icon: Clock, label: "Scheduled Publishing" },
];

export function LinkPageDemoBuilder() {
  const [name, setName] = useState("Alex Morgan");
  const [bio, setBio] = useState("Product Designer & Content Creator");
  const [selectedTheme, setSelectedTheme] = useState("gradient-purple");
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("mobile");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "link", content: { title: "Latest Blog Post", url: "https://blog.example.com" } },
    { id: "2", type: "link", content: { title: "Free Design Kit", url: "https://design.example.com" } },
    { id: "3", type: "link", content: { title: "Portfolio", url: "https://portfolio.example.com" } },
  ]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === "link" 
        ? { title: "", url: "" }
        : type === "header" 
        ? { text: "" }
        : type === "text"
        ? { text: "" }
        : type === "social"
        ? { platform: "instagram" }
        : type === "image"
        ? { url: "", alt: "" }
        : {},
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: Record<string, string>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const theme = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];
  const isLightTheme = selectedTheme === "minimal";

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Interactive Demo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            try it yourself
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your link page right here. All themes. All block types. See it come to life instantly.
          </p>
        </div>

        {/* Builder */}
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Left: Editor (3 cols) */}
          <Card className="lg:col-span-3 p-6 bg-card/50 backdrop-blur-sm border-border/50">
            {/* Profile Section */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your name"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Bio</label>
                  <Textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="A short bio..."
                    rows={1}
                    className="bg-background resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Theme Picker */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Theme</h3>
              <TooltipProvider delayDuration={0}>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((t) => (
                    <Tooltip key={t.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedTheme(t.id)}
                          className={cn(
                            "relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110",
                            t.colors,
                            selectedTheme === t.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        {t.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            {/* Add Blocks */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Add Blocks</h3>
              <div className="flex flex-wrap gap-2">
                {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(type)}
                    className="gap-1.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Block List */}
            <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
              {blocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Click a block type above to add content
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border/50 group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                    
                    <div className="flex-1 min-w-0">
                      {block.type === "link" && (
                        <div className="flex gap-2">
                          <Input
                            value={block.content.title || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                            placeholder="Link title"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={block.content.url || ""}
                            onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                            placeholder="https://..."
                            className="h-8 text-sm"
                          />
                        </div>
                      )}
                      {block.type === "header" && (
                        <Input
                          value={block.content.text || ""}
                          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                          placeholder="Header text"
                          className="h-8 text-sm font-semibold"
                        />
                      )}
                      {block.type === "text" && (
                        <Input
                          value={block.content.text || ""}
                          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                          placeholder="Text content"
                          className="h-8 text-sm"
                        />
                      )}
                      {block.type === "social" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Share2 className="w-4 h-4" />
                          Social Icons
                        </div>
                      )}
                      {block.type === "divider" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Minus className="w-4 h-4" />
                          Divider
                        </div>
                      )}
                      {block.type === "image" && (
                        <Input
                          value={block.content.url || ""}
                          onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                          placeholder="Image URL"
                          className="h-8 text-sm"
                        />
                      )}
                    </div>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeBlock(block.id)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Pro Features Card */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-1">Unlock PRO Features</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRO_FEATURES.map(({ icon: Icon, label }) => (
                      <span key={label} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon className="w-3 h-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <Link to="/signup">
                    <Button size="sm" className="gap-1">
                      Sign Up to Publish
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Card>

          {/* Right: Live Preview (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 mb-4 p-1 rounded-full bg-muted/50">
              <button
                onClick={() => setDeviceView("mobile")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  deviceView === "mobile" ? "bg-background shadow-sm" : "hover:bg-background/50"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView("desktop")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  deviceView === "desktop" ? "bg-background shadow-sm" : "hover:bg-background/50"
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Phone Frame */}
            <div className={cn(
              "transition-all duration-300",
              deviceView === "desktop" ? "w-full max-w-md" : "w-[280px]"
            )}>
              <div className={cn(
                "bg-zinc-900 shadow-2xl shadow-primary/20 transition-all duration-300",
                deviceView === "mobile" ? "rounded-[2.5rem] p-2" : "rounded-xl p-2"
              )}>
                {/* Notch (mobile only) */}
                {deviceView === "mobile" && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-10" />
                )}
                
                {/* Screen */}
                <div className={cn(
                  "overflow-hidden bg-gradient-to-br",
                  theme.preview,
                  deviceView === "mobile" ? "rounded-[2rem] h-[500px]" : "rounded-lg h-[400px]"
                )}>
                  {/* Status bar (mobile only) */}
                  {deviceView === "mobile" && (
                    <div className={cn(
                      "flex items-center justify-between px-6 py-2 text-[10px]",
                      isLightTheme ? "text-zinc-600" : "text-white/80"
                    )}>
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-3 h-3 rounded-full border", isLightTheme ? "border-zinc-400" : "border-white/50")} />
                        <div className={cn("w-4 h-2 rounded-sm border", isLightTheme ? "border-zinc-400" : "border-white/50")} />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={cn(
                    "px-6 pb-8 overflow-y-auto",
                    deviceView === "mobile" ? "pt-4 h-[calc(100%-32px)]" : "pt-6 h-full"
                  )}>
                    {/* Avatar */}
                    <div className={cn(
                      "w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden border-2",
                      isLightTheme 
                        ? "bg-zinc-200 border-zinc-300" 
                        : "bg-white/20 backdrop-blur-sm border-white/30"
                    )}>
                      <span className={cn(
                        "text-2xl font-bold",
                        isLightTheme ? "text-zinc-600" : "text-white"
                      )}>
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Name with verified */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <h3 className={cn(
                        "text-lg font-bold",
                        isLightTheme ? "text-zinc-900" : "text-white"
                      )}>
                        {name || "Your Name"}
                      </h3>
                      <BadgeCheck className={cn(
                        "w-4 h-4",
                        isLightTheme ? "text-zinc-600" : "text-white"
                      )} />
                    </div>

                    {/* Bio */}
                    <p className={cn(
                      "text-xs text-center mt-1",
                      isLightTheme ? "text-zinc-600" : "text-white/70"
                    )}>
                      {bio || "Your bio here"}
                    </p>

                    {/* CTA Button */}
                    <a className={cn(
                      "block w-full mt-4 py-2.5 px-4 rounded-full text-sm font-semibold text-center transition-colors",
                      isLightTheme 
                        ? "bg-zinc-900 text-white hover:bg-zinc-800" 
                        : "bg-white text-zinc-900 hover:bg-white/90"
                    )}>
                      Book a Call <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>

                    {/* Blocks */}
                    <div className="mt-4 space-y-2">
                      {blocks.map((block) => {
                        if (block.type === "link") {
                          return (
                            <div
                              key={block.id}
                              className={cn(
                                "w-full py-2.5 px-4 rounded-xl text-sm font-medium text-center border cursor-pointer transition-colors",
                                isLightTheme 
                                  ? "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200" 
                                  : "bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30"
                              )}
                            >
                              {block.content.title || "Link title"}
                            </div>
                          );
                        }
                        if (block.type === "header") {
                          return (
                            <h4 
                              key={block.id} 
                              className={cn(
                                "text-sm font-bold text-center mt-3",
                                isLightTheme ? "text-zinc-900" : "text-white"
                              )}
                            >
                              {block.content.text || "Header"}
                            </h4>
                          );
                        }
                        if (block.type === "text") {
                          return (
                            <p 
                              key={block.id} 
                              className={cn(
                                "text-xs text-center",
                                isLightTheme ? "text-zinc-600" : "text-white/70"
                              )}
                            >
                              {block.content.text || "Text content"}
                            </p>
                          );
                        }
                        if (block.type === "social") {
                          return (
                            <div key={block.id} className="flex items-center justify-center gap-3 mt-3">
                              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-colors",
                                    isLightTheme 
                                      ? "bg-zinc-100 border-zinc-200 hover:bg-zinc-200" 
                                      : "bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
                                  )}
                                >
                                  <Icon className={cn(
                                    "w-4 h-4",
                                    isLightTheme ? "text-zinc-600" : "text-white"
                                  )} />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (block.type === "divider") {
                          return (
                            <div 
                              key={block.id} 
                              className={cn(
                                "w-full h-px my-3",
                                isLightTheme ? "bg-zinc-300" : "bg-white/20"
                              )} 
                            />
                          );
                        }
                        if (block.type === "image") {
                          return (
                            <div 
                              key={block.id} 
                              className={cn(
                                "w-full h-24 rounded-lg flex items-center justify-center",
                                isLightTheme ? "bg-zinc-200" : "bg-white/10"
                              )}
                            >
                              <Image className={cn(
                                "w-6 h-6",
                                isLightTheme ? "text-zinc-400" : "text-white/40"
                              )} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Branding */}
                    <div className="mt-6 text-center">
                      <span className={cn(
                        "text-[10px]",
                        isLightTheme ? "text-zinc-400" : "text-white/40"
                      )}>
                        Powered by utm.one
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 opacity-60" />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Create Your Page Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
