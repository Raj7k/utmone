import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code2 } from "lucide-react";
import { AppleReveal } from "./AppleReveal";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ 
  code, 
  language = "typescript", 
  filename,
  showLineNumbers = true 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <AppleReveal>
      <div className="rounded-xl overflow-hidden border border-border bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Window controls */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            
            {filename && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Code2 className="w-4 h-4" />
                <span>{filename}</span>
              </div>
            )}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm text-zinc-400 hover:text-zinc-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code content */}
        <div className="overflow-x-auto p-4">
          <pre className="text-sm leading-relaxed">
            <code className="font-mono">
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {showLineNumbers && (
                    <span className="select-none text-zinc-600 pr-4 text-right w-8">
                      {i + 1}
                    </span>
                  )}
                  <span className="text-zinc-300">{line || " "}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </AppleReveal>
  );
};
