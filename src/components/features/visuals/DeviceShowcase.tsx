import { BadgeCheck, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export const DeviceShowcase = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 py-8">
      {/* Mobile - Sunset gradient */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Mobile</span>
        <div className="relative">
          <div className="w-[200px] h-[400px] bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl border border-zinc-700">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
            <div className="w-full h-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center pt-12 px-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 mb-3">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                {/* Name with verified */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm font-bold text-white">Alex Morgan</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
                {/* Bio */}
                <span className="text-[10px] text-white/70 mb-4">Product Designer & Creator</span>
                {/* Links */}
                <div className="space-y-2 w-full">
                  <div className="h-9 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-xs font-medium text-white">Latest Blog Post</span>
                  </div>
                  <div className="h-9 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-xs font-medium text-white">Free Design Kit</span>
                  </div>
                  <div className="h-9 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-xs font-medium text-white">Portfolio</span>
                  </div>
                </div>
                {/* Social icons */}
                <div className="flex gap-2 mt-4">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Instagram className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Twitter className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Youtube className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet - Ocean blue gradient */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Tablet</span>
        <div className="relative">
          <div className="w-[280px] h-[380px] bg-zinc-900 rounded-[1.5rem] p-3 shadow-2xl border border-zinc-700">
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-[1rem] overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center pt-8 px-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 mb-3">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
                {/* Name with verified */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base font-bold text-white">Sarah Chen</span>
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
                {/* Bio */}
                <span className="text-xs text-white/70 mb-6">Tech Founder & Speaker</span>
                {/* Links */}
                <div className="space-y-2.5 w-full max-w-[200px]">
                  <div className="h-11 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">Book a Call</span>
                  </div>
                  <div className="h-11 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">Newsletter</span>
                  </div>
                  <div className="h-11 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">Startup Guide</span>
                  </div>
                  <div className="h-11 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">Podcast</span>
                  </div>
                </div>
                {/* Social icons */}
                <div className="flex gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop - Emerald green gradient */}
      <div className="hidden lg:flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Desktop</span>
        <div className="relative">
          <div className="w-[400px] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700 overflow-hidden">
            {/* Browser chrome */}
            <div className="h-8 bg-zinc-800 flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-2">
                <div className="h-5 bg-zinc-700 rounded-md flex items-center px-2">
                  <span className="text-[10px] text-zinc-400">utm.one/u/marcus</span>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="h-[280px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 relative">
              <div className="absolute inset-0 flex flex-col items-center pt-6 px-8">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 mb-2">
                  <span className="text-xl font-bold text-white">M</span>
                </div>
                {/* Name with verified */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base font-bold text-white">Marcus Johnson</span>
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
                {/* Bio */}
                <span className="text-xs text-white/70 mb-4">Fitness Coach & Entrepreneur</span>
                {/* Links */}
                <div className="space-y-2 w-full max-w-[220px]">
                  <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">Free Workout Plan</span>
                  </div>
                  <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">1-on-1 Coaching</span>
                  </div>
                  <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-sm font-medium text-white">YouTube Channel</span>
                  </div>
                </div>
                {/* Social icons */}
                <div className="flex gap-2.5 mt-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Youtube className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
