import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SharePromptProps {
  text: string;
  className?: string;
  variant?: "default" | "highlight";
}

export const SharePrompt = ({ text, className, variant = "default" }: SharePromptProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    const shareUrl = window.location.href;
    const fullText = `${text}\n\nFrom the HR Katalyst Referral Playbook by utm.one`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    } else {
      navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "rounded-xl p-4 my-6 flex flex-col sm:flex-row items-start sm:items-center gap-4",
        variant === "highlight"
          ? "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20"
          : "bg-muted/30 border border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <Share2 className={cn(
          "w-5 h-5 shrink-0",
          variant === "highlight" ? "text-amber-500" : "text-muted-foreground"
        )} />
        <p className="text-sm text-foreground font-medium">"{text}"</p>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="text-xs h-8 px-3 hover:bg-primary/10"
        >
          𝕏 Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="text-xs h-8 px-3 hover:bg-primary/10"
        >
          in Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare("copy")}
          className="text-xs h-8 px-3 hover:bg-primary/10"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
    </motion.div>
  );
};
