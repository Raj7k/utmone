import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DetectedLocation {
  country: string;
  state?: string;
  city?: string;
}

interface GeolocationDetectorProps {
  onLocationSelect: (location: string) => void;
}

export const GeolocationDetector = ({ onLocationSelect }: GeolocationDetectorProps) => {
  const [location, setLocation] = useState<DetectedLocation | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already dismissed or location already stored
    const dismissedStorage = localStorage.getItem('location_prompt_dismissed');
    const storedLocation = localStorage.getItem('detected_location');
    
    if (dismissedStorage === 'true') {
      setDismissed(true);
      setLoading(false);
      return;
    }

    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      setLoading(false);
      return;
    }

    // Detect location using edge function
    const detectLocation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('detect-location');
        
        if (error) throw error;
        
        const detected: DetectedLocation = {
          country: data.country,
          state: data.state,
          city: data.city
        };
        
        setLocation(detected);
        setLoading(false);
      } catch (error) {
        console.error('Geolocation detection failed:', error);
        // Fallback to default location
        const fallback: DetectedLocation = {
          country: 'United States',
          state: 'California',
          city: 'San Francisco'
        };
        setLocation(fallback);
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const handleAccept = () => {
    if (location?.city && location?.state) {
      const locationString = `${location.city}, ${location.state}`;
      localStorage.setItem('detected_location', JSON.stringify(location));
      onLocationSelect(locationString);
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('location_prompt_dismissed', 'true');
    setDismissed(true);
  };

  if (loading || dismissed || !location) return null;

  return (
    <Card className="border-2 border-deepSea/20 bg-deepSea/5 animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-deepSea/10">
              <MapPin className="h-5 w-5 text-deepSea" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">We Detected You're in</span>
                <Badge variant="default" className="bg-deepSea">
                  {location.city}, {location.state}
                </Badge>
              </div>
              <p className="text-sm text-secondary-label">
                Would you like us to show salary data personalized for your location?
              </p>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAccept} size="sm" className="bg-deepSea hover:bg-deepSea/90">
                  Yes, Show {location.city} Data
                </Button>
                <Button onClick={handleDismiss} size="sm" variant="ghost">
                  No Thanks
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={handleDismiss} size="icon" variant="ghost" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
