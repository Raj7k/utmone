import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientWorkspaces } from "@/hooks/useClientWorkspaces";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Settings, Trash2 } from "lucide-react";

export default function ClientWorkspaces() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { workspaces, isLoading, deleteWorkspace } = useClientWorkspaces();
  const { currentWorkspace, switchWorkspace } = useWorkspaceContext();

  const handleSwitchAndNavigate = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    navigate("/dashboard");
  };

  if (isLoading) {
    return <div>Loading workspaces...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">workspaces</h1>
          <p className="mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            manage your workspaces and client workspaces
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          new workspace
        </Button>
      </div>

      <CreateWorkspaceDialog 
        open={open} 
        onOpenChange={setOpen}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces?.map((workspace) => (
          <Card key={workspace.id} className={currentWorkspace?.id === workspace.id ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle>{workspace.name}</CardTitle>
                </div>
                {workspace.is_client_workspace && (
                  <Badge variant="secondary">client</Badge>
                )}
              </div>
              <CardDescription>{workspace.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={currentWorkspace?.id === workspace.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSwitchAndNavigate(workspace.id)}
                  className="flex-1"
                >
                  {currentWorkspace?.id === workspace.id ? "current" : "switch"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    switchWorkspace(workspace.id);
                    navigate("/settings");
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>delete workspace?</AlertDialogTitle>
                      <AlertDialogDescription>
                        this will permanently delete "{workspace.name}" and all its data.
                        this action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteWorkspace(workspace.id)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
