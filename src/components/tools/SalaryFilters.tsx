import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { salaryBenchmarks, locationMultipliers, companySizeMultipliers } from "@/lib/salaryData";

interface SalaryFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  role: string;
  location: string;
  companySize: string;
  experienceYears: string;
}

export const SalaryFilters = ({ onFilterChange }: SalaryFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    role: salaryBenchmarks[0]?.role || '',
    location: 'Atlanta, GA',
    companySize: 'Medium',
    experienceYears: '2-4'
  });

  // Get unique values for dropdowns
  const roles = Array.from(new Set(salaryBenchmarks.map(s => s.role)));
  const locations = locationMultipliers.map(l => l.location);
  const companySizes = companySizeMultipliers.map(c => c.size);
  const experienceLevels = Array.from(new Set(salaryBenchmarks.map(s => s.experienceYears)));

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('salary-filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilters(parsed);
        onFilterChange(parsed);
      } catch (e) {
        // Invalid saved data, use defaults
      }
    } else {
      onFilterChange(filters);
    }
  }, []);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Save to localStorage
    localStorage.setItem('salary-filters', JSON.stringify(newFilters));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-card rounded-2xl border border-border/50">
      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium lowercase">
          role
        </Label>
        <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium lowercase">
          location
        </Label>
        <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
          <SelectTrigger id="location">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company Size */}
      <div className="space-y-2">
        <Label htmlFor="companySize" className="text-sm font-medium lowercase">
          company size
        </Label>
        <Select value={filters.companySize} onValueChange={(value) => updateFilter('companySize', value)}>
          <SelectTrigger id="companySize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companySizes.map((size) => {
              const sizeData = companySizeMultipliers.find(s => s.size === size);
              return (
                <SelectItem key={size} value={size}>
                  {size} ({sizeData?.employeeRange})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label htmlFor="experience" className="text-sm font-medium lowercase">
          experience
        </Label>
        <Select value={filters.experienceYears} onValueChange={(value) => updateFilter('experienceYears', value)}>
          <SelectTrigger id="experience">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((exp) => (
              <SelectItem key={exp} value={exp}>
                {exp} years
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
