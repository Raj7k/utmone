import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { usePredictedPerformance, getPerformanceBadge } from "@/hooks/usePredictedPerformance";

interface SmartUTMComboboxProps {
  workspaceId: string;
  fieldType: 'utm_source' | 'utm_medium';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  staticSuggestions?: string[];
}

export const SmartUTMCombobox = ({
  workspaceId,
  fieldType,
  value,
  onChange,
  placeholder = "Select...",
  staticSuggestions = [],
}: SmartUTMComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [isHighImpact, setIsHighImpact] = React.useState(false);
  const { data: performance = [], isLoading } = usePredictedPerformance(workspaceId, fieldType);

  // Create combined suggestions list
  const suggestions = React.useMemo(() => {
    const perfMap = new Map(performance.map(p => [p.tag, p]));
    const allTags = new Set([...performance.map(p => p.tag), ...staticSuggestions]);
    
    return Array.from(allTags).map(tag => ({
      tag,
      ctr: perfMap.get(tag)?.ctr || null,
      totalLinks: perfMap.get(tag)?.totalLinks || 0,
      totalClicks: perfMap.get(tag)?.totalClicks || 0,
    }));
  }, [performance, staticSuggestions]);

  const handleSelect = (selectedValue: string) => {
    const perf = suggestions.find(s => s.tag === selectedValue);
    const badge = getPerformanceBadge(perf?.ctr || null, perf?.totalLinks || 0);
    
    onChange(selectedValue);
    setOpen(false);

    // Trigger gold glow animation for high-impact selections
    if (badge.tier === "high") {
      setIsHighImpact(true);
      setTimeout(() => setIsHighImpact(false), 2000);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between transition-all duration-300",
            isHighImpact && "ring-2 ring-amber-400 ring-offset-2 shadow-lg shadow-amber-400/50 animate-pulse"
          )}
        >
          <span className={cn(!value && "text-tertiary-label")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`search ${fieldType.replace('utm_', '')}...`} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "loading predictions..." : "no results found"}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((suggestion) => {
                const badge = getPerformanceBadge(suggestion.ctr, suggestion.totalLinks);
                
                return (
                  <CommandItem
                    key={suggestion.tag}
                    value={suggestion.tag}
                    onSelect={handleSelect}
                    className="flex items-center justify-between gap-2 py-3"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Check
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          value === suggestion.tag ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{suggestion.tag}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex-shrink-0 text-xs font-normal",
                        badge.color
                      )}
                    >
                      {badge.icon} {badge.label}
                    </Badge>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
