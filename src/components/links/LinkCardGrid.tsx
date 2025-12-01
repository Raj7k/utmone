import { EnhancedLink } from "@/hooks/useEnhancedLinks";
import { LinkCard } from "./LinkCard";

interface LinkCardGridProps {
  links: EnhancedLink[];
}

export const LinkCardGrid = ({ links }: LinkCardGridProps) => {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">no links found</p>
        <p className="text-sm text-muted-foreground">
          create your first link or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
};
