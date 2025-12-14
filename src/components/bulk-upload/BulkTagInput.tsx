import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Tag } from "lucide-react";

interface BulkTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const BulkTagInput = ({ value, onChange }: BulkTagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const { currentWorkspace } = useWorkspace();

  const { data: existingTags } = useQuery({
    queryKey: ['tags', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];
      
      // Query links to get workspace links, then get their tags
      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('workspace_id', currentWorkspace.id);

      if (!links || links.length === 0) return [];

      const linkIds = links.map(l => l.id);
      
      const { data, error } = await supabase
        .from('link_tags')
        .select('tag_name')
        .in('link_id', linkIds)
        .order('tag_name');

      if (error) throw error;
      
      // Get unique tags
      const uniqueTags = [...new Set(data.map(item => item.tag_name))];
      return uniqueTags;
    },
    enabled: !!currentWorkspace,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        add tags
      </label>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="type tag and press enter"
        className="text-sm"
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {existingTags && existingTags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          existing: {existingTags.slice(0, 5).join(", ")}
          {existingTags.length > 5 ? "..." : ""}
        </div>
      )}
    </div>
  );
};
