import { motion } from "framer-motion";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const codeLines = [
  { text: 'import', color: 'text-purple-400/80' },
  { text: ' { Utm } ', color: 'text-white/70' },
  { text: 'from', color: 'text-purple-400/80' },
  { text: ' "utm.one"', color: 'text-emerald-400/70' },
  { text: ';', color: 'text-white/40' },
];

const codeLine2 = [
  { text: 'const', color: 'text-purple-400/80' },
  { text: ' link ', color: 'text-white/70' },
  { text: '=', color: 'text-white/40' },
  { text: ' await', color: 'text-purple-400/80' },
  { text: ' utm.', color: 'text-white/70' },
  { text: 'create', color: 'text-amber-400/80' },
  { text: '();', color: 'text-white/40' },
];

export function APICard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`import { Utm } from "utm.one";\nconst link = await utm.create();`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link to="/docs" className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-white/90 mb-0.5">API</h3>
            <p className="text-xs text-white/50">Build with utm.one</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <>
                  <Check className="w-2.5 h-2.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-200" />
          </div>
        </div>

        {/* Code Block */}
        <div className="rounded-lg bg-zinc-950/80 border border-white/[0.05] p-3 font-mono text-[11px] leading-relaxed overflow-hidden">
          {/* Line 1 */}
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="flex"
          >
            {codeLines.map((segment, i) => (
              <span key={i} className={segment.color}>{segment.text}</span>
            ))}
          </motion.div>
          
          {/* Line 2 */}
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.35 }}
            className="flex mt-1"
          >
            {codeLine2.map((segment, i) => (
              <span key={i} className={segment.color}>{segment.text}</span>
            ))}
          </motion.div>

          {/* Cursor blink */}
          <motion.span
            className="inline-block w-[2px] h-3 bg-white/60 ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
