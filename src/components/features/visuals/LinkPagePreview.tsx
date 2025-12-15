import { BadgeCheck, ExternalLink, Instagram, Twitter, Youtube } from "lucide-react";

export function LinkPagePreview() {
  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Floating animation wrapper */}
      <div className="animate-[float_4s_ease-in-out_infinite]">
        {/* Phone frame */}
        <div className="relative rounded-[2.5rem] bg-zinc-900 p-2 shadow-2xl shadow-primary/20">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-10" />
          
          {/* Screen */}
          <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 py-2 text-white/80 text-[10px]">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-white/50" />
                <div className="w-4 h-2 rounded-sm border border-white/50" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 pt-4">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30">
                <span className="text-2xl font-bold text-white">A</span>
              </div>

              {/* Name with verified */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <h3 className="text-lg font-bold text-white">Alex Morgan</h3>
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>

              {/* Bio */}
              <p className="text-white/70 text-xs text-center mt-1">
                Product Designer & Content Creator
              </p>

              {/* CTA Button */}
              <a className="block w-full mt-4 py-2.5 px-4 rounded-full bg-white text-zinc-900 text-sm font-semibold text-center hover:bg-white/90 transition-colors">
                Book a Call <ExternalLink className="w-3 h-3 inline ml-1" />
              </a>

              {/* Links */}
              <div className="mt-4 space-y-2">
                {["Latest Blog Post", "Free Design Kit", "Portfolio"].map((text, i) => (
                  <div
                    key={i}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium text-center border border-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    {text}
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-3 mt-5">
                {[Instagram, Twitter, Youtube].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                ))}
              </div>

              {/* Branding */}
              <div className="mt-6 text-center">
                <span className="text-white/40 text-[10px]">
                  Powered by utm.one
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-8 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl -z-10 opacity-60" />

      {/* Animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
