import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MobileLinkFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClose: () => void;
}

export const MobileLinkFilters = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onClose,
}: MobileLinkFiltersProps) => {
  const statusOptions = [
    { value: "all", label: "All Links" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
  ];

  const handleClear = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="mobile-search">Search Links</Label>
        <Input
          id="mobile-search"
          placeholder="Search by title, URL, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12"
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className="flex-1 min-w-[80px] h-12"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || statusFilter !== "all") && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => onSearchChange("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <button onClick={() => onStatusChange("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={handleClear} className="flex-1 h-12">
          Clear All
        </Button>
        <Button onClick={onClose} className="flex-1 h-12">
          Apply
        </Button>
      </div>
    </div>
  );
};
