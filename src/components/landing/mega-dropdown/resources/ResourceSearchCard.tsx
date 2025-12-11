import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

const placeholders = [
  "Search UTM best practices...",
  "Search attribution guides...",
  "Search QR code templates...",
  "Search campaign examples..."
];

export function ResourceSearchCard() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/resources" className="block group">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-xl p-3 cursor-pointer
          bg-white/[0.02] border border-white/[0.08]
          hover:bg-white/[0.04] hover:border-white/[0.12]
          transition-all duration-300 flex items-center gap-3"
      >
        {/* Search icon */}
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
          <Search className="w-4 h-4 text-white/50" />
        </div>

        {/* Typewriter placeholder */}
        <div className="flex-1">
          <motion.p
            key={placeholderIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] text-white/40"
          >
            {placeholders[placeholderIndex]}
          </motion.p>
        </div>
        
        <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-300" />
      </motion.div>
    </Link>
  );
}
