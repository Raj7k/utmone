import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExampleSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ExampleSearch = ({ value, onChange, placeholder = "search examples..." }: ExampleSearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl pl-11 pr-11"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
