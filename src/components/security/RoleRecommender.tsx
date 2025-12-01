import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useRoleRecommendation, useAvailableCapabilities } from "@/hooks/useRoleRecommendation";
import { WorkspaceCapability } from "@/hooks/useCapability";
import { Shield, Lightbulb, CheckCircle2 } from "lucide-react";

export const RoleRecommender = () => {
  const [selectedCapabilities, setSelectedCapabilities] = useState<WorkspaceCapability[]>([]);
  const { data: availableCapabilities } = useAvailableCapabilities();
  const { data: recommendation } = useRoleRecommendation(selectedCapabilities);

  const toggleCapability = (capability: WorkspaceCapability) => {
    setSelectedCapabilities(prev =>
      prev.includes(capability)
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const formatCapability = (cap: string) => {
    return cap.replace('can_', '').replace(/_/g, ' ');
  };

  const getRoleColor = (role: string) => {
    if (role === 'workspace_admin') return 'bg-primary/10 text-primary';
    if (role === 'editor') return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    if (role === 'contributor') return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    if (role === 'viewer') return 'bg-slate-500/10 text-slate-700 dark:text-slate-400';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-headline font-display font-semibold text-label mb-1">
              role optimizer
            </h3>
            <p className="text-body-apple text-secondary-label">
              select required tasks to find the safest role with minimal permissions
            </p>
          </div>
        </div>

        {/* Capability Selection */}
        <div className="space-y-3">
          <div className="text-subheadline-apple text-label font-medium">
            what should this user be able to do?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableCapabilities?.map(capability => (
              <label
                key={capability}
                className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedCapabilities.includes(capability)}
                  onCheckedChange={() => toggleCapability(capability)}
                />
                <span className="text-body-apple text-label capitalize">
                  {formatCapability(capability)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {recommendation && selectedCapabilities.length > 0 && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-subheadline-apple font-medium text-label">
                recommended role
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={`${getRoleColor(recommendation.recommended_role)} text-sm py-1 px-3`}>
                {recommendation.recommended_role.replace('_', ' ')}
              </Badge>
              <div className="text-caption-1-apple text-secondary-label">
                (least privilege principle applied)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {recommendation.matched_capabilities}
                </div>
                <div className="text-caption-1-apple text-tertiary-label">matched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {recommendation.excess_capabilities}
                </div>
                <div className="text-caption-1-apple text-tertiary-label">excess</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                  {recommendation.missing_capabilities}
                </div>
                <div className="text-caption-1-apple text-tertiary-label">missing</div>
              </div>
            </div>

            {recommendation.excess_capabilities === 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-body-apple text-emerald-700 dark:text-emerald-300">
                  perfect match - zero excess permissions
                </span>
              </div>
            )}
          </div>
        )}

        {selectedCapabilities.length === 0 && (
          <div className="text-center py-6 text-secondary-label text-body-apple">
            select at least one capability to get a recommendation
          </div>
        )}
      </div>
    </Card>
  );
};
