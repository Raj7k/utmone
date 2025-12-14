import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/workspace";
import { Folder, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BulkFolderSelectorProps {
  value: string | null;
  onChange: (folderId: string | null) => void;
}

export const BulkFolderSelector = ({ value, onChange }: BulkFolderSelectorProps) => {
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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

  const createFolder = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('folders')
        .insert({
          workspace_id: currentWorkspace!.id,
          name: name.trim(),
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folders', currentWorkspace?.id] });
      onChange(data.id);
      setNewFolderName("");
      setIsCreating(false);
      toast({
        title: "folder created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "error creating folder",
        description: error.message,
        variant: "destructive",
      });
    },
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
          <SelectSeparator />
          <div 
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent transition-colors text-white-90"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreating(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            create folder
          </div>
        </SelectContent>
      </Select>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">create folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && newFolderName.trim()) {
                  createFolder.mutate(newFolderName);
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              cancel
            </Button>
            <Button 
              onClick={() => createFolder.mutate(newFolderName)}
              disabled={!newFolderName.trim() || createFolder.isPending}
            >
              {createFolder.isPending ? "creating..." : "create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
