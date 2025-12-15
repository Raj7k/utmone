import { LinkPagePreview } from "./LinkPagePreview";

export const DeviceShowcase = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 py-8">
      {/* Mobile */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Mobile</span>
        <div className="relative">
          {/* iPhone frame */}
          <div className="w-[200px] h-[400px] bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl border border-zinc-700">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center pt-12 px-4">
                <div className="w-16 h-16 rounded-full bg-white/20 mb-3" />
                <div className="h-4 w-24 bg-white/30 rounded mb-1" />
                <div className="h-3 w-32 bg-white/20 rounded mb-6" />
                <div className="space-y-2 w-full">
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Tablet</span>
        <div className="relative">
          {/* iPad frame */}
          <div className="w-[280px] h-[380px] bg-zinc-900 rounded-[1.5rem] p-3 shadow-2xl border border-zinc-700">
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[1rem] overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center pt-10 px-6">
                <div className="w-20 h-20 rounded-full bg-white/20 mb-4" />
                <div className="h-5 w-28 bg-white/30 rounded mb-2" />
                <div className="h-4 w-40 bg-white/20 rounded mb-8" />
                <div className="space-y-3 w-full max-w-[200px]">
                  <div className="h-12 w-full bg-white/20 rounded-xl" />
                  <div className="h-12 w-full bg-white/20 rounded-xl" />
                  <div className="h-12 w-full bg-white/20 rounded-xl" />
                  <div className="h-12 w-full bg-white/20 rounded-xl" />
                </div>
                <div className="flex gap-4 mt-6">
                  <div className="w-10 h-10 rounded-full bg-white/20" />
                  <div className="w-10 h-10 rounded-full bg-white/20" />
                  <div className="w-10 h-10 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Desktop</span>
        <div className="relative">
          {/* Browser frame */}
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
                  <span className="text-[10px] text-zinc-400">utm.one/u/yourname</span>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="h-[280px] bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative">
              <div className="absolute inset-0 flex flex-col items-center pt-8 px-8">
                <div className="w-16 h-16 rounded-full bg-white/20 mb-3" />
                <div className="h-5 w-28 bg-white/30 rounded mb-2" />
                <div className="h-4 w-44 bg-white/20 rounded mb-6" />
                <div className="space-y-2 w-full max-w-[220px]">
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
