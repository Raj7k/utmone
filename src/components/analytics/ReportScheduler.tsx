import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Mail, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  template_name: z.enum(["weekly_summary", "monthly_overview", "campaign_performance"]),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  recipients: z.string().min(1, "at least one email required"),
});

interface ReportSchedulerProps {
  workspaceId: string;
}

export function ReportScheduler({ workspaceId }: ReportSchedulerProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template_name: "weekly_summary",
      frequency: "weekly",
      recipients: "",
    },
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['scheduled-reports', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const recipients = values.recipients.split(',').map(e => e.trim());
      
      const nextSendAt = new Date();
      if (values.frequency === 'daily') {
        nextSendAt.setDate(nextSendAt.getDate() + 1);
      } else if (values.frequency === 'weekly') {
        nextSendAt.setDate(nextSendAt.getDate() + 7);
      } else {
        nextSendAt.setMonth(nextSendAt.getMonth() + 1);
      }
      nextSendAt.setHours(8, 0, 0, 0);

      const { error } = await supabase.from('scheduled_reports').insert({
        workspace_id: workspaceId,
        template_name: values.template_name,
        frequency: values.frequency,
        recipients,
        next_send_at: nextSendAt.toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports', workspaceId] });
      toast.success('report scheduled successfully');
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error scheduling report:', error);
      toast.error('failed to schedule report');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports', workspaceId] });
      toast.success('report updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports', workspaceId] });
      toast.success('report deleted');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(values);
  };

  const getTemplateName = (template: string) => {
    return template.replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">scheduled reports</h2>
          <p className="text-secondary-label">automate your analytics delivery</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              schedule report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>schedule a new report</DialogTitle>
              <DialogDescription>
                automatically send analytics reports to your team
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="template_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>report template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly_summary">weekly summary</SelectItem>
                          <SelectItem value="monthly_overview">monthly overview</SelectItem>
                          <SelectItem value="campaign_performance">campaign performance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        choose the type of report to generate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">daily</SelectItem>
                          <SelectItem value="weekly">weekly</SelectItem>
                          <SelectItem value="monthly">monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        how often to send this report
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>recipients</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com, team@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        comma-separated email addresses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'scheduling...' : 'schedule report'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-secondary-label">loading reports...</div>
      ) : !reports || reports.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-secondary-label" />
          <h3 className="font-display font-semibold mb-2">no scheduled reports yet</h3>
          <p className="text-sm text-secondary-label mb-4">
            create your first automated report to start receiving analytics via email
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-semibold">{getTemplateName(report.template_name)}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">
                      {report.frequency}
                    </span>
                    {!report.is_active && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        paused
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-secondary-label">
                    sent to: {report.recipients.join(', ')}
                  </p>
                  <p className="text-xs text-secondary-label mt-1">
                    {report.last_sent_at 
                      ? `last sent: ${new Date(report.last_sent_at).toLocaleDateString()}`
                      : 'never sent'}
                    {' • '}
                    next: {new Date(report.next_send_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleMutation.mutate({ id: report.id, isActive: report.is_active })}
                  >
                    {report.is_active ? (
                      <><Pause className="h-4 w-4 mr-1" /> pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-1" /> resume</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
