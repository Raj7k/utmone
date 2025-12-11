import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  isNew?: boolean;
  tier?: "free" | "starter" | "growth" | "business" | "enterprise";
}

const tierColors = {
  free: "bg-zinc-100 text-zinc-600",
  starter: "bg-blue-50 text-blue-600",
  growth: "bg-green-50 text-green-600",
  business: "bg-purple-50 text-purple-600",
  enterprise: "bg-amber-50 text-amber-600",
};

export const ArticleCard = ({
  title,
  description,
  href,
  icon: Icon,
  isNew,
  tier,
}: ArticleCardProps) => {
  return (
    <Link
      to={href}
      className="group block p-5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
            <Icon className="h-5 w-5 text-zinc-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
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
          <p className="text-sm text-zinc-500 line-clamp-2">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
};
