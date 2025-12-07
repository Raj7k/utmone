import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContentWrapperProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Use compact layout without hero header - just content */
  compact?: boolean;
}

export const PageContentWrapper = ({
  title,
  description,
  breadcrumbs = [],
  action,
  children,
  className,
  compact = false,
}: PageContentWrapperProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn("space-y-6", className)}
      >
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>dashboard</span>
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors lowercase"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground lowercase">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Header - Title, Description, Actions */}
        {!compact && (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-semibold text-foreground lowercase">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground lowercase">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
