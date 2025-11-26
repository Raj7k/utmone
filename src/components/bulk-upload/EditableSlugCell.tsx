import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface EditableSlugCellProps {
  slug: string;
  domain: string;
  workspaceId: string;
  onChange: (slug: string, isAvailable: boolean) => void;
}

export const EditableSlugCell = ({
  slug,
  domain,
  workspaceId,
  onChange,
}: EditableSlugCellProps) => {
  const [value, setValue] = useState(slug);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!value || value.length < 2) {
        setError("min 2 characters");
        setIsAvailable(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from("links")
          .select("id")
          .eq("workspace_id", workspaceId)
          .eq("domain", domain)
          .eq("slug", value)
          .maybeSingle();

        if (queryError) throw queryError;

        const available = !data;
        setIsAvailable(available);
        onChange(value, available);

        if (!available) {
          setError("already exists");
        }
      } catch (err) {
        setError("check failed");
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [value, domain, workspaceId, onChange]);

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          className={cn(
            "h-8 text-xs font-mono pr-8",
            isAvailable === false && "border-destructive",
            isAvailable === true && "border-system-green"
          )}
          placeholder="custom-slug"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isChecking && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          {!isChecking && isAvailable === true && (
            <Check className="h-3 w-3 text-system-green" />
          )}
          {!isChecking && isAvailable === false && (
            <X className="h-3 w-3 text-destructive" />
          )}
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};