import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, breadcrumbs, action }: PageHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-secondary-label hover:text-label transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>dashboard</span>
        </Link>
        {breadcrumbs?.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-tertiary-label" />
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="text-secondary-label hover:text-label transition-colors lowercase"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-label lowercase">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Title and Description */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-label mb-2 lowercase heading">{title}</h1>
          {description && (
            <p className="text-body-apple text-secondary-label lowercase">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
