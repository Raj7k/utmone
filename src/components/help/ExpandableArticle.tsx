import { useState, ReactNode } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableArticleProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  isNew?: boolean;
  tier?: "free" | "starter" | "growth" | "business" | "enterprise";
  children: ReactNode;
  defaultOpen?: boolean;
}

const tierColors = {
  free: "bg-zinc-100 text-zinc-600",
  starter: "bg-zinc-100 text-zinc-600",
  growth: "bg-emerald-50 text-emerald-600",
  business: "bg-violet-50 text-violet-600",
  enterprise: "bg-amber-50 text-amber-600",
};

export const ExpandableArticle = ({
  title,
  description,
  icon: Icon,
  isNew,
  tier,
  children,
  defaultOpen = false,
}: ExpandableArticleProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Icon className="h-5 w-5 text-zinc-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-zinc-900">
                {title}
              </h3>
              {isNew && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  new
                </span>
              )}
              {tier && (
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", tierColors[tier])}>
                  {tier}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-zinc-400 transition-transform flex-shrink-0 mt-1",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-2 border-t border-zinc-100">
              <article className="prose prose-zinc prose-sm max-w-none prose-headings:font-semibold prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-900">
                {children}
              </article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
