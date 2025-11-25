import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export const WorkspaceSwitcher = () => {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspaceContext();

  if (!currentWorkspace || workspaces.length <= 1) {
    return null;
  }

  return (
    <Select
      value={currentWorkspace.id}
      onValueChange={switchWorkspace}
    >
      <SelectTrigger className="w-48">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.id} value={workspace.id}>
            <div className="flex items-center gap-2">
              <span>{workspace.name}</span>
              {workspace.is_client_workspace && (
                <span className="text-xs text-muted-foreground">(Client)</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
