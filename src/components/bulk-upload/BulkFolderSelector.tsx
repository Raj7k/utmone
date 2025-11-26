import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Folder } from "lucide-react";

interface BulkFolderSelectorProps {
  value: string | null;
  onChange: (folderId: string | null) => void;
}

export const BulkFolderSelector = ({ value, onChange }: BulkFolderSelectorProps) => {
  const { currentWorkspace } = useWorkspace();

  const { data: folders, isLoading } = useQuery({
    queryKey: ['folders', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];
      
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Folder className="h-4 w-4" />
        assign folder
      </label>
      <Select
        value={value || "none"}
        onValueChange={(val) => onChange(val === "none" ? null : val)}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="no folder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">no folder</SelectItem>
          {folders?.map((folder) => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.parent_id ? "  ↳ " : ""}{folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
