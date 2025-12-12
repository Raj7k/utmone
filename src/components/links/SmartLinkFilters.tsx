import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Flame, TrendingDown, AlertTriangle, Activity } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface SmartLinkFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  performanceFilter: string[];
  onPerformanceFilterChange: (value: string[]) => void;
  healthFilter: string[];
  onHealthFilterChange: (value: string[]) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const SmartLinkFilters = ({
  searchQuery,
  onSearchChange,
  performanceFilter,
  onPerformanceFilterChange,
  healthFilter,
  onHealthFilterChange,
  statusFilter,
  onStatusChange,
}: SmartLinkFiltersProps) => {
  const activeFiltersCount = useMemo(() => 
    performanceFilter.length + 
    healthFilter.length + 
    (statusFilter !== "all" ? 1 : 0),
    [performanceFilter.length, healthFilter.length, statusFilter]
  );

  const handlePerformanceToggle = useCallback((value: string) => {
    const updated = performanceFilter.includes(value)
      ? performanceFilter.filter(v => v !== value)
      : [...performanceFilter, value];
    onPerformanceFilterChange(updated);
  }, [performanceFilter, onPerformanceFilterChange]);

  const handleHealthToggle = useCallback((value: string) => {
    const updated = healthFilter.includes(value)
      ? healthFilter.filter(v => v !== value)
      : [...healthFilter, value];
    onHealthFilterChange(updated);
  }, [healthFilter, onHealthFilterChange]);

  const handleClearAll = useCallback(() => {
    onPerformanceFilterChange([]);
    onHealthFilterChange([]);
    onStatusChange("all");
  }, [onPerformanceFilterChange, onHealthFilterChange, onStatusChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="search links, campaigns, or type 'show me declining links'..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Performance Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            performance
            {performanceFilter.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {performanceFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>performance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={performanceFilter.includes("hot")}
            onCheckedChange={() => handlePerformanceToggle("hot")}
          >
            <Flame className="h-4 w-4 mr-2 text-red-500" />
            hot (high traffic)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={performanceFilter.includes("rising")}
            onCheckedChange={() => handlePerformanceToggle("rising")}
          >
            <TrendingDown className="h-4 w-4 mr-2 text-green-500 rotate-180" />
            rising (trending up)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={performanceFilter.includes("declining")}
            onCheckedChange={() => handlePerformanceToggle("declining")}
          >
            <TrendingDown className="h-4 w-4 mr-2 text-orange-500" />
            declining (needs attention)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={performanceFilter.includes("dormant")}
            onCheckedChange={() => handlePerformanceToggle("dormant")}
          >
            <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
            dormant (no activity)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Health Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            health
            {healthFilter.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {healthFilter.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>health status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={healthFilter.includes("healthy")}
            onCheckedChange={() => handleHealthToggle("healthy")}
          >
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            healthy (80-100)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={healthFilter.includes("warning")}
            onCheckedChange={() => handleHealthToggle("warning")}
          >
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
            warning (50-79)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={healthFilter.includes("at-risk")}
            onCheckedChange={() => handleHealthToggle("at-risk")}
          >
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            at risk (&lt;50)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear All Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          onClick={handleClearAll}
        >
          clear all ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};
