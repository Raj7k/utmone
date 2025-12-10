import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor } from "lucide-react";

export const RoutingMapPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-8 shadow-xl bg-zinc-900/40 border-2 border-white/10"
    >
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-1/4 left-1/4 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900"
        >
          🇺🇸 US → /en-us
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute top-1/2 right-1/4 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900"
        >
          🇬🇧 UK → /en-gb
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-1/4 left-1/3 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg bg-white text-zinc-900"
        >
          🇩🇪 DE → /de
        </motion.div>
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
    </motion.div>
  );
};
