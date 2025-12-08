import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, Shield, Info } from "lucide-react";
import { recommendRole, getAllCapabilities, type Capability } from "@/lib/optimizations/roleRecommender";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoleRecommenderWizardProps {
  onRoleSelect: (role: string) => void;
  trigger?: React.ReactNode;
}

export function RoleRecommenderWizard({ onRoleSelect, trigger }: RoleRecommenderWizardProps) {
  const [open, setOpen] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<Capability[]>([]);
  
  const capabilities = getAllCapabilities();
  const recommendation = selectedCapabilities.length > 0 
    ? recommendRole(selectedCapabilities) 
    : null;

  const handleCapabilityToggle = (capability: Capability) => {
    setSelectedCapabilities(prev =>
      prev.includes(capability)
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const handleApplyRole = () => {
    if (recommendation) {
      onRoleSelect(recommendation.role.role);
      setOpen(false);
      setSelectedCapabilities([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            help me choose
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-white/90" />
            smart role recommender
          </DialogTitle>
          <DialogDescription>
            select what this user needs to do. we'll recommend the role with the least privilege that satisfies all requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Capabilities Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">what does this user need to do?</h4>
            <div className="grid grid-cols-2 gap-3">
              {capabilities.map(capability => (
                <div key={capability.value} className="flex items-start space-x-3">
                  <Checkbox
                    id={capability.value}
                    checked={selectedCapabilities.includes(capability.value)}
                    onCheckedChange={() => handleCapabilityToggle(capability.value)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={capability.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {capability.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {capability.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation Result */}
          {recommendation && (
            <div className="border border-white/20 rounded-lg p-4 space-y-3 bg-white/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">recommended role</h4>
                    {recommendation.isExactMatch && (
                      <Badge variant="secondary" className="text-xs">
                        Exact Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-white/90">
                      {recommendation.role.displayName}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{recommendation.role.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Privilege Level: {recommendation.role.privilegeLevel}/6
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">matched capabilities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendation.matchedCapabilities.map(cap => {
                      const capInfo = capabilities.find(c => c.value === cap);
                      return (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {capInfo?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {recommendation.extraCapabilities.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      additional capabilities (granted):
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recommendation.extraCapabilities.map(cap => {
                        const capInfo = capabilities.find(c => c.value === cap);
                        return (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {capInfo?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Shield className="h-4 w-4 text-white/70" />
                <p className="text-xs text-muted-foreground">
                  {recommendation.isExactMatch
                    ? "This role provides exactly the capabilities you selected with no additional privileges."
                    : "This role provides the selected capabilities plus minimal additional access. This is the safest option."}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              cancel
            </Button>
            <Button
              onClick={handleApplyRole}
              disabled={!recommendation}
            >
              apply {recommendation?.role.displayName.toLowerCase()} role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
