import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface CityResult {
  name: string;
  region: string;
  country: string;
  countryCode: string;
  fullName: string;
  coordinates: [number, number];
}

interface CityComboboxProps {
  value?: string;
  onChange: (city: CityResult | null) => void;
  onCitySelect?: (city: CityResult) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CityCombobox = ({
  value = "",
  onChange,
  onCitySelect,
  placeholder = "search city...",
  disabled = false,
  className,
}: CityComboboxProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync external value
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('geocode-city', {
        body: { query },
      });

      if (error) throw error;

      setResults(data.results || []);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error('City search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce API calls
    debounceRef.current = setTimeout(() => {
      searchCities(newValue);
    }, 300);
  };

  const handleSelect = (city: CityResult) => {
    const displayValue = city.region 
      ? `${city.name}, ${city.region}, ${city.country}`
      : `${city.name}, ${city.country}`;
    
    setInputValue(displayValue);
    setIsOpen(false);
    setResults([]);
    onChange(city);
    onCitySelect?.(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on option
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && results.length > 0 && setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-9 pr-8"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-popover shadow-lg"
          role="listbox"
        >
          {results.map((city, index) => (
            <li
              key={`${city.name}-${city.countryCode}-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                highlightedIndex === index 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-muted"
              )}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {city.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {city.region ? `${city.region}, ${city.country}` : city.country}
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                {city.countryCode}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {isOpen && inputValue.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 p-4 rounded-lg border border-border bg-popover text-center">
          <Search className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">no cities found</p>
        </div>
      )}
    </div>
  );
};
