import { Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface APICardProps {
  variant?: "light" | "dark";
}

export function APICard({ variant = "dark" }: APICardProps) {
  const isLight = variant === "light";
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
      <div
        className={cn(
          "group p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-fade-in-dropdown opacity-0",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={cn("text-sm font-medium mb-0.5", isLight ? "text-zinc-800" : "text-white/90")}>API</h3>
            <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-white/50")}>Build with utm.one</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition-all active:scale-95",
                isLight
                  ? "bg-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-300"
                  : "bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.1]"
              )}
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
            </button>
            <ArrowUpRight className={cn(
              "w-3.5 h-3.5 transition-all duration-200",
              isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
            )} />
          </div>
        </div>

        {/* Code Block */}
        <div className={cn(
          "rounded-lg p-3 font-mono text-[11px] leading-relaxed overflow-hidden",
          isLight ? "bg-zinc-900 border border-zinc-800" : "bg-zinc-950/80 border border-white/[0.05]"
        )}>
          {/* Line 1 */}
          <div
            className="flex animate-fade-in-dropdown opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="text-purple-400/80">import</span>
            <span className="text-white/70"> {`{ Utm }`} </span>
            <span className="text-purple-400/80">from</span>
            <span className="text-emerald-400/70"> "utm.one"</span>
            <span className="text-white/40">;</span>
          </div>
          
          {/* Line 2 */}
          <div
            className="flex mt-1 animate-fade-in-dropdown opacity-0"
            style={{ animationDelay: "0.35s" }}
          >
            <span className="text-purple-400/80">const</span>
            <span className="text-white/70"> link </span>
            <span className="text-white/40">=</span>
            <span className="text-purple-400/80"> await</span>
            <span className="text-white/70"> utm.</span>
            <span className="text-amber-400/80">create</span>
            <span className="text-white/40">();</span>
          </div>

          {/* Cursor blink - CSS only */}
          <span
            className="inline-block w-[2px] h-3 bg-white/60 ml-0.5 align-middle animate-cursor-blink"
          />
        </div>
      </div>
    </Link>
  );
}
