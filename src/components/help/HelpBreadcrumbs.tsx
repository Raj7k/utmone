import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HelpBreadcrumbsProps {
  items: Breadcrumb[];
}

export const HelpBreadcrumbs = ({ items }: HelpBreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/help"
        className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Help</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
