import { Globe, Smartphone, Monitor } from "lucide-react";

export const RoutingMapPreview = () => {
  return (
    <div className="rounded-2xl p-8 shadow-xl bg-zinc-900/40 border-2 border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          one link, infinite destinations
        </h3>
        <p className="text-white/60">utm.one/launch routes visitors based on location & device</p>
      </div>

      {/* Visual Routing Map */}
      <div className="relative h-64 rounded-xl overflow-hidden bg-white/5">
        {/* World Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-32 h-32 text-white/10" />
        </div>

        {/* Routing Arrows */}
        <div
          className="absolute top-1/4 left-1/4 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900 animate-scale-in"
          style={{ animationDelay: '0.2s' }}
        >
          🇺🇸 US → /en-us
        </div>

        <div
          className="absolute top-1/2 right-1/4 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900 animate-scale-in"
          style={{ animationDelay: '0.4s' }}
        >
          🇬🇧 UK → /en-gb
        </div>

        <div
          className="absolute bottom-1/4 left-1/3 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900 animate-scale-in"
          style={{ animationDelay: '0.6s' }}
        >
          🇩🇪 DE → /de
        </div>
      </div>

      {/* Device Routing Examples */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-white-80" />
            <span className="text-sm font-semibold text-foreground">iOS users</span>
          </div>
          <p className="text-xs text-white/50">→ App Store</p>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-5 h-5 text-white-80" />
            <span className="text-sm font-semibold text-foreground">Desktop users</span>
          </div>
          <p className="text-xs text-white/50">→ Full website</p>
        </div>
      </div>
    </div>
  );
};
