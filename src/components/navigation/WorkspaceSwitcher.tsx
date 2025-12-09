import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const WorkspaceSwitcher = () => {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspaceContext();
  const navigate = useNavigate();

  if (!currentWorkspace) {
    return null;
  }

  // Single workspace - show as display only (no dropdown)
  if (workspaces.length <= 1) {
    return (
      <div 
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={() => navigate("/settings?tab=workspace")}
      >
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-medium truncate max-w-[120px] md:max-w-[160px]">
          {currentWorkspace.name}
        </span>
      </div>
    );
  }

  // Multiple workspaces - show dropdown
  return (
    <Select
      value={currentWorkspace.id}
      onValueChange={(value) => {
        if (value === "manage") {
          navigate("/settings?tab=workspace");
        } else {
          switchWorkspace(value);
        }
      }}
    >
      <SelectTrigger className="min-w-[140px] md:w-48 h-10 bg-muted/30 border-border hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="truncate font-medium text-sm">{currentWorkspace.name}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-[100]">
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.id} value={workspace.id}>
            <div className="flex items-center gap-2">
              <span>{workspace.name}</span>
              {workspace.is_client_workspace && (
                <Badge variant="secondary" className="text-xs h-5">Client</Badge>
              )}
            </div>
          </SelectItem>
        ))}
        <Separator className="my-1" />
        <SelectItem value="manage" className="cursor-pointer">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>Manage Workspaces</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
