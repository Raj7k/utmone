import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspaceMembers } from "@/hooks/workspace";
import { useBulkUploadSession } from "@/hooks/useBulkUploadSession";
import { UserPlus } from "lucide-react";

interface BulkUploadAssignmentProps {
  workspaceId: string;
  bulkUploadId: string;
  currentAssignee?: string | null;
}

export function BulkUploadAssignment({
  workspaceId,
  bulkUploadId,
  currentAssignee,
}: BulkUploadAssignmentProps) {
  const { members } = useWorkspaceMembers(workspaceId);
  const { updateSession } = useBulkUploadSession(workspaceId);
  const [selectedUserId, setSelectedUserId] = useState<string>(currentAssignee || "");

  const handleAssign = () => {
    updateSession.mutate({
      sessionId: bulkUploadId,
      updates: { assigned_to: selectedUserId || null },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Assign Upload
        </CardTitle>
        <CardDescription>assign this bulk upload to a team member</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger>
            <SelectValue placeholder="select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">unassigned</SelectItem>
            {members.map((member) => (
              <SelectItem key={member.user_id} value={member.user_id}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={member.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profile?.full_name?.[0] || member.profile?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.profile?.full_name || member.profile?.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAssign} disabled={updateSession.isPending} className="w-full">
          {updateSession.isPending ? "assigning..." : "assign"}
        </Button>
      </CardContent>
    </Card>
  );
}
