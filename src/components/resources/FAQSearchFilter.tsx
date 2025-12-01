import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FAQSearchFilterProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string | null) => void;
  selectedCategory: string | null;
  categories: string[];
  resultCount: number;
}

export const FAQSearchFilter = ({ 
  onSearchChange, 
  onCategoryChange,
  selectedCategory,
  categories,
  resultCount
}: FAQSearchFilterProps) => {
  const [localSearch, setLocalSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="search for answers..."
          className="h-14 rounded-xl pl-12 pr-12 text-lg border-border/50"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Category Filter Tags */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full whitespace-nowrap"
        >
          all categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      {(localSearch || selectedCategory) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </span>
          {(localSearch || selectedCategory) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
                onCategoryChange(null);
              }}
              className="h-8"
            >
              clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
