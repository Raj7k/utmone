import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Plus, 
  Trash2, 
  BarChart3, 
  BadgeCheck, 
  EyeOff, 
  Clock, 
  Globe,
  Palette,
  ArrowRight,
  Check,
  X,
  Sparkles
} from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "gradient-sunset", name: "Sunset", colors: "from-purple-600 via-pink-500 to-orange-400", free: true },
  { id: "gradient-ocean", name: "Ocean", colors: "from-blue-600 via-cyan-500 to-teal-400", free: true },
  { id: "gradient-forest", name: "Forest", colors: "from-green-600 via-emerald-500 to-lime-400", free: false },
  { id: "gradient-midnight", name: "Midnight", colors: "from-indigo-900 via-purple-800 to-pink-700", free: false },
  { id: "solid-dark", name: "Dark", colors: "from-zinc-900 to-zinc-800", free: false },
  { id: "solid-light", name: "Light", colors: "from-white to-zinc-100", free: false },
];

const MAX_FREE_LINKS = 3;

const LinkPageBuilderTool = () => {
  const [name, setName] = useState("Your Name");
  const [bio, setBio] = useState("Creator • Marketer • Builder");
  const [links, setLinks] = useState([
    { id: "1", title: "My Website", url: "https://example.com" },
    { id: "2", title: "Twitter", url: "https://twitter.com" },
  ]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const addLink = () => {
    if (links.length >= MAX_FREE_LINKS) return;
    setLinks([...links, { id: Date.now().toString(), title: "", url: "" }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const proFeatures = [
    { icon: BadgeCheck, label: "Verified Badge", desc: "Show you're the real deal" },
    { icon: BarChart3, label: "Analytics", desc: "Track views, clicks, CTR" },
    { icon: EyeOff, label: "Hide Branding", desc: "Remove utm.one footer" },
    { icon: Clock, label: "Scheduled Publishing", desc: "Go live on your schedule" },
    { icon: Globe, label: "Custom Domain", desc: "Use your own domain" },
    { icon: Palette, label: "All Themes", desc: "Unlock 10+ premium themes" },
  ];

  const freeVsPro = [
    { feature: "Link Page Creation", free: true, pro: true },
    { feature: "Up to 3 Links", free: true, pro: true },
    { feature: "2 Basic Themes", free: true, pro: true },
    { feature: "Unlimited Links", free: false, pro: true },
    { feature: "All 10+ Themes", free: false, pro: true },
    { feature: "Verified Badge", free: false, pro: true },
    { feature: "Analytics Dashboard", free: false, pro: true },
    { feature: "Hide Branding", free: false, pro: true },
    { feature: "Scheduled Publishing", free: false, pro: true },
    { feature: "Custom Domain", free: false, pro: true },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="Free Link Page Builder | Create Link-in-Bio Pages | utm.one"
        description="Build beautiful link-in-bio pages for free. Add your links, customize your theme, and share one link everywhere. No signup required to try."
        canonical="https://utm.one/tools/link-page-builder"
        keywords={["link in bio", "linktree alternative", "bio link builder", "free link page"]}
      />

      {/* Hero with Builder */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Tool
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              link page builder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your link-in-bio page in seconds. Try it free—no signup required.
            </p>
          </div>

          {/* Split Builder */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Editor */}
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Customize Your Page</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Bio</label>
                    <Textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      placeholder="A short bio..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Links ({links.length}/{MAX_FREE_LINKS})</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addLink}
                    disabled={links.length >= MAX_FREE_LINKS}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(link.id, "title", e.target.value)}
                        placeholder="Link title"
                        className="flex-1"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, "url", e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeLink(link.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>

                {links.length >= MAX_FREE_LINKS && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Upgrade to PRO for unlimited links</span>
                  </div>
                )}
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-sm font-medium mb-3 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => theme.free && setSelectedTheme(theme)}
                      className={cn(
                        "relative h-16 rounded-lg bg-gradient-to-br transition-all overflow-hidden",
                        theme.colors,
                        selectedTheme.id === theme.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        !theme.free && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {!theme.free && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white font-medium">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t">
                <Link to="/signup">
                  <Button className="w-full" size="lg">
                    Sign Up Free to Publish
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Create an account to save and publish your page
                </p>
              </div>
            </Card>

            {/* Right: Live Preview */}
            <div className="flex flex-col items-center">
              <div className="sticky top-24">
                <div className="text-sm text-muted-foreground text-center mb-4">Live Preview</div>
                
                {/* Phone Frame */}
                <div className="w-[280px] bg-zinc-900 rounded-[2.5rem] p-3 shadow-2xl border border-zinc-700">
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />
                  <div className={cn(
                    "w-full h-[500px] rounded-[2rem] overflow-hidden bg-gradient-to-br",
                    selectedTheme.colors
                  )}>
                    <div className="flex flex-col items-center pt-12 px-6">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full bg-white/20 mb-4" />
                      
                      {/* Name */}
                      <h3 className="text-white font-semibold text-lg mb-1">{name || "Your Name"}</h3>
                      <p className="text-white/70 text-sm text-center mb-6">{bio || "Your bio here"}</p>
                      
                      {/* Links */}
                      <div className="w-full space-y-3">
                        {links.map((link) => (
                          <div
                            key={link.id}
                            className="w-full py-3 px-4 rounded-xl bg-white/20 text-white text-center text-sm font-medium truncate"
                          >
                            {link.title || "Link title"}
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer branding */}
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <span className="text-white/40 text-xs">Powered by utm.one</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locked Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Unlock PRO Features</h2>
            <p className="text-muted-foreground">Get analytics, verified badges, and more with a PRO account</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proFeatures.map((feature) => (
              <Card key={feature.label} className="p-4 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">PRO</Badge>
                </div>
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro Table */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Free vs PRO</h2>
            <p className="text-muted-foreground">See what's included in each plan</p>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium">Free</th>
                    <th className="text-center p-4 font-medium">PRO</th>
                  </tr>
                </thead>
                <tbody>
                  {freeVsPro.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                      <td className="p-4 text-sm">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link to="/pricing">
              <Button size="lg">
                View Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to create your link page?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign up free and publish your page in under 30 seconds.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/features/link-pages">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default LinkPageBuilderTool;
