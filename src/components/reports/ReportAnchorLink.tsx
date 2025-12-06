import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportAnchorLinkProps {
  title: string;
  description: string;
  url: string;
  comingSoon?: boolean;
  icon?: "report" | "link";
}

export const ReportAnchorLink = ({
  title,
  description,
  url,
  comingSoon = false,
  icon = "report"
}: ReportAnchorLinkProps) => {
  const Icon = icon === "report" ? FileText : ExternalLink;

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-lg border-l-4 border-deepSea bg-gradient-to-r from-deepSea/5 to-transparent p-6 transition-apple hover:shadow-md ${
        comingSoon ? "opacity-60 cursor-not-allowed" : "hover:border-deepSea/80"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-deepSea/10">
            <Icon className="h-5 w-5 text-deepSea" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-display font-semibold text-foreground">
              {title}
            </h3>
            {comingSoon && (
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            📍 {description}
          </p>
        </div>
        {!comingSoon && (
          <div className="flex-shrink-0">
            <ExternalLink className="h-4 w-4 text-deepSea" />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (comingSoon) {
    return content;
  }

  return (
    <Link to={url} className="block">
      {content}
    </Link>
  );
};