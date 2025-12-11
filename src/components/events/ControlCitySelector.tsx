import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUpdateEventControlCity } from "@/hooks/useFieldEvents";
import { notify } from "@/lib/notify";
import { FlaskConical, Check } from "lucide-react";
import { CityCombobox, CityResult } from "@/components/geo/CityCombobox";

interface ControlCitySelectorProps {
  eventId: string;
  currentControlCity: string | null;
  eventCity: string;
  onUpdate?: () => void;
}

// Common US cities for suggestions (similar size/traffic patterns)
const SUGGESTED_CONTROL_CITIES: Record<string, string[]> = {
  'Las Vegas': ['Phoenix', 'Denver', 'Salt Lake City'],
  'San Francisco': ['Seattle', 'Portland', 'San Diego'],
  'New York': ['Chicago', 'Philadelphia', 'Boston'],
  'Austin': ['Dallas', 'Houston', 'San Antonio'],
  'Miami': ['Atlanta', 'Tampa', 'Orlando'],
  'Chicago': ['Detroit', 'Minneapolis', 'Cleveland'],
  'Los Angeles': ['Phoenix', 'San Diego', 'Denver'],
  'Boston': ['Philadelphia', 'Baltimore', 'Hartford'],
  'Seattle': ['Portland', 'Denver', 'Salt Lake City'],
  'Denver': ['Phoenix', 'Salt Lake City', 'Albuquerque'],
};

export const ControlCitySelector = ({ 
  eventId, 
  currentControlCity, 
  eventCity,
  onUpdate 
}: ControlCitySelectorProps) => {
  const [controlCity, setControlCity] = useState(currentControlCity || '');
  const [isEditing, setIsEditing] = useState(!currentControlCity);
  const updateControlCity = useUpdateEventControlCity();

  const suggestions = SUGGESTED_CONTROL_CITIES[eventCity] || 
    ['Phoenix', 'Denver', 'Atlanta']; // Default suggestions

  const handleCitySelect = (city: CityResult | null) => {
    if (city) {
      setControlCity(city.name);
    }
  };

  const handleSave = async () => {
    if (!controlCity.trim()) return;
    
    try {
      await updateControlCity.mutateAsync({ eventId, controlCity: controlCity.trim() });
      setIsEditing(false);
      notify.success("control city set", {
        description: `${controlCity} will be used as the comparison baseline`,
      });
      onUpdate?.();
    } catch (error) {
      notify.error("failed to update");
    }
  };

  if (!isEditing && currentControlCity) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <FlaskConical className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">control city:</span>
        <span className="font-medium text-foreground">{currentControlCity}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          className="text-xs h-6 px-2"
        >
          change
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-primary" />
        <Label className="text-sm font-medium">set control city</Label>
      </div>
      
      <p className="text-xs text-muted-foreground">
        choose a similar-sized city without an event to prove your impact is localized.
      </p>

      <div className="flex gap-2">
        <div className="flex-1">
          <CityCombobox
            value={controlCity}
            onChange={handleCitySelect}
            placeholder="search control city..."
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!controlCity.trim() || updateControlCity.isPending}
          size="sm"
        >
          <Check className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">suggestions:</span>
        {suggestions.map(city => (
          <button
            key={city}
            onClick={() => setControlCity(city)}
            className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted-foreground/20 transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
