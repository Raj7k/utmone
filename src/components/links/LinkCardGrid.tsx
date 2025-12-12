import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EnhancedLink } from "@/hooks/useEnhancedLinks";
import { LinkCard } from "./LinkCard";

interface LinkCardGridProps {
  links: EnhancedLink[];
}

export const LinkCardGrid = ({ links }: LinkCardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate columns based on container width
  const getColumns = () => {
    if (typeof window === "undefined") return 1;
    const width = parentRef.current?.clientWidth || window.innerWidth;
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 1;
  };

  const columns = getColumns();
  const rowCount = Math.ceil(links.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Approximate card height + gap
    overscan: 3,
  });

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
    <div
      ref={parentRef}
      className="h-[calc(100vh-320px)] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowLinks = links.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
            >
              {rowLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
