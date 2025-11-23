import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExampleFilterProps {
  categories: { label: string; value: string; count?: number }[];
  activeCategory: string;
  onFilterChange: (category: string) => void;
}

export const ExampleFilter = ({ categories, activeCategory, onFilterChange }: ExampleFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(category.value)}
          className={cn(
            "rounded-full gap-2 transition-all duration-200",
            activeCategory === category.value
              ? "bg-primary text-white hover:bg-primary-hover"
              : "bg-background hover:bg-muted"
          )}
        >
          <span>{category.label}</span>
          {category.count !== undefined && (
            <Badge
              variant="secondary"
              className={cn(
                "h-5 min-w-5 rounded-full px-1.5 text-xs",
                activeCategory === category.value
                  ? "bg-white/20 text-white"
                  : "bg-muted"
              )}
            >
              {category.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};
