import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Globe } from "lucide-react";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { FeatureGuard } from "@/components/feature-gating/FeatureGuard";
import { toast } from "sonner";

interface GeoRule {
  id: string;
  country: string;
  url: string;
}

interface GeoTargetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geoTargets: Record<string, string>;
  onSave: (geoTargets: Record<string, string>) => void;
}

export function GeoTargetingModal({ open, onOpenChange, geoTargets, onSave }: GeoTargetingModalProps) {
  const [rules, setRules] = useState<GeoRule[]>([]);

  // Initialize rules from geoTargets when modal opens
  useEffect(() => {
    if (open) {
      const initialRules = Object.entries(geoTargets).map(([country, url]) => ({
        id: Math.random().toString(36).substring(7),
        country,
        url,
      }));
      
      // If no rules exist, add one empty rule
      if (initialRules.length === 0) {
        initialRules.push({
          id: Math.random().toString(36).substring(7),
          country: "",
          url: "",
        });
      }
      
      setRules(initialRules);
    }
  }, [open, geoTargets]);

  const addRule = () => {
    setRules([
      ...rules,
      {
        id: Math.random().toString(36).substring(7),
        country: "",
        url: "",
      },
    ]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const updateRule = (id: string, field: "country" | "url", value: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const validateAndSave = () => {
    // Check for duplicate countries
    const countries = rules.filter(r => r.country).map(r => r.country);
    const duplicates = countries.filter((country, index) => countries.indexOf(country) !== index);
    
    if (duplicates.length > 0) {
      toast.error("Duplicate country rule", {
        description: `${duplicates[0]} is used in multiple rules. Each country can only have one rule.`,
      });
      return;
    }

    // Check for empty fields
    const hasEmpty = rules.some(r => r.country && !r.url);
    if (hasEmpty) {
      toast.error("Incomplete rules", {
        description: "Please enter a destination URL for all selected countries.",
      });
      return;
    }

    // Convert to geo_targets format
    const geoTargetsObj: Record<string, string> = {};
    rules.forEach((rule) => {
      if (rule.country && rule.url) {
        geoTargetsObj[rule.country] = rule.url;
      }
    });

    onSave(geoTargetsObj);
    onOpenChange(false);
    
    const ruleCount = Object.keys(geoTargetsObj).length;
    toast.success("Geo-targeting updated", {
      description: ruleCount > 0 
        ? `${ruleCount} ${ruleCount === 1 ? 'rule' : 'rules'} active` 
        : "All rules removed",
    });
  };

  const usedCountries = rules.filter(r => r.country).map(r => r.country);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Geo-Targeting
          </DialogTitle>
          <DialogDescription>
            Send visitors to different URLs based on their country. Each country can only have one rule.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <CountryCombobox
                  value={rule.country}
                  onChange={(country) => updateRule(rule.id, "country", country)}
                  excludedCountries={usedCountries.filter(c => c !== rule.country)}
                />
                <Input
                  placeholder="Destination URL (e.g., https://us.example.com)"
                  value={rule.url}
                  onChange={(e) => updateRule(rule.id, "url", e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRule(rule.id)}
                className="mt-1"
                disabled={rules.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addRule}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <FeatureGuard feature="geo_targeting" showUpgradeModal mode="disable">
            <Button onClick={validateAndSave}>
              Save Rules
            </Button>
          </FeatureGuard>
        </div>
      </DialogContent>
    </Dialog>
  );
}
