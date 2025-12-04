import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showSuccessToast, showErrorToast } from "@/lib/enhancedToast";
import { Plus, Trash2 } from "lucide-react";

export const DripCampaignManager = () => {
  const queryClient = useQueryClient();
  const [newSchedule, setNewSchedule] = useState({
    campaign_id: "",
    trigger_type: "days_after_signup",
    trigger_value: 3,
    trigger_milestone: "",
    is_active: true,
  });

  // Fetch email campaigns
  const { data: campaigns } = useQuery({
    queryKey: ["email-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch drip schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["drip-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drip_campaign_schedules")
        .select("*, email_campaigns(campaign_type, subject)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create schedule mutation
  const createMutation = useMutation({
    mutationFn: async (schedule: typeof newSchedule) => {
      const { error } = await supabase
        .from("drip_campaign_schedules")
        .insert(schedule);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drip-schedules"] });
      showSuccessToast("drip schedule created");
      setNewSchedule({
        campaign_id: "",
        trigger_type: "days_after_signup",
        trigger_value: 3,
        trigger_milestone: "",
        is_active: true,
      });
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });

  // Toggle schedule mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("drip_campaign_schedules")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drip-schedules"] });
      showSuccessToast("schedule updated");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("drip_campaign_schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drip-schedules"] });
      showSuccessToast("schedule deleted");
    },
    onError: (error: Error) => {
      showErrorToast(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div 
          className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" 
          style={{ borderColor: 'rgba(59,130,246,1)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>create new drip schedule</CardTitle>
          <CardDescription>
            automate email campaigns based on user behavior and milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>campaign</Label>
            <Select
              value={newSchedule.campaign_id}
              onValueChange={(value) =>
                setNewSchedule({ ...newSchedule, campaign_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns?.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.campaign_type} - {campaign.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>trigger type</Label>
            <Select
              value={newSchedule.trigger_type}
              onValueChange={(value) =>
                setNewSchedule({ ...newSchedule, trigger_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days_after_signup">days after signup</SelectItem>
                <SelectItem value="score_threshold">score threshold</SelectItem>
                <SelectItem value="milestone">milestone achieved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newSchedule.trigger_type === "days_after_signup" && (
            <div className="space-y-2">
              <Label>days after signup</Label>
              <Input
                type="number"
                value={newSchedule.trigger_value}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    trigger_value: parseInt(e.target.value),
                  })
                }
                min={0}
              />
            </div>
          )}

          {newSchedule.trigger_type === "score_threshold" && (
            <div className="space-y-2">
              <Label>minimum score</Label>
              <Input
                type="number"
                value={newSchedule.trigger_value}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    trigger_value: parseInt(e.target.value),
                  })
                }
                min={0}
              />
            </div>
          )}

          {newSchedule.trigger_type === "milestone" && (
            <div className="space-y-2">
              <Label>milestone type</Label>
              <Input
                value={newSchedule.trigger_milestone}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    trigger_milestone: e.target.value,
                  })
                }
                placeholder="e.g., first_referral"
              />
            </div>
          )}

          <Button
            onClick={() => createMutation.mutate(newSchedule)}
            disabled={!newSchedule.campaign_id}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            create schedule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>active drip schedules</CardTitle>
          <CardDescription>
            manage automated email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules && schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {schedule.email_campaigns?.campaign_type || "Unknown Campaign"}
                    </p>
                    <p className="text-sm text-secondary-label">
                      {schedule.trigger_type === "days_after_signup" &&
                        `sends ${schedule.trigger_value} days after signup`}
                      {schedule.trigger_type === "score_threshold" &&
                        `sends when score reaches ${schedule.trigger_value}`}
                      {schedule.trigger_type === "milestone" &&
                        `sends when ${schedule.trigger_milestone} is achieved`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={schedule.is_active}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: schedule.id, is_active: checked })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-label py-8">
              no drip schedules created yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
