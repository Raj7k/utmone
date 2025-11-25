import { Link as LinkIcon, BarChart3, FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      {icon || <FolderOpen className="h-8 w-8 text-secondary-label" />}
    </div>
    <h3 className="text-title-3 font-semibold text-label mb-2">{title}</h3>
    <p className="text-body-apple text-secondary-label max-w-sm mb-6">{description}</p>
    {action && (
      <Button onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

export const NoLinksState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={<LinkIcon className="h-8 w-8 text-secondary-label" />}
    title="no links yet"
    description="get started by creating your first short link. it takes less than 30 seconds."
    action={{
      label: "create first link",
      onClick: onCreate,
    }}
  />
);

export const NoAnalyticsState = () => (
  <EmptyState
    icon={<BarChart3 className="h-8 w-8 text-secondary-label" />}
    title="no data yet"
    description="analytics will appear here once your links start getting clicks."
  />
);

export const NoSearchResults = ({ query }: { query: string }) => (
  <EmptyState
    icon={<Search className="h-8 w-8 text-secondary-label" />}
    title="no results found"
    description={`no links match "${query}". try a different search term.`}
  />
);
