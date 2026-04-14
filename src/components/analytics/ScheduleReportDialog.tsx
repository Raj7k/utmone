import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

const formSchema = z.object({
  template_name: z.enum(["weekly_summary", "monthly_overview", "campaign_performance"]),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  recipients: z.string().min(1, "at least one email required"),
});

interface ScheduleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function ScheduleReportDialog({ open, onOpenChange, workspaceId }: ScheduleReportDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      template_name: "weekly_summary",
      frequency: "weekly",
      recipients: "",
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

      const { error } = await supabaseFrom('scheduled_reports').insert({
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
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Error scheduling report:', error);
      toast.error('failed to schedule report');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            schedule a report
          </DialogTitle>
          <DialogDescription>
            automatically send analytics reports to your team on a recurring basis
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
                      <SelectItem value="daily">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          daily (8:00 AM)
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          weekly (Mondays)
                        </div>
                      </SelectItem>
                      <SelectItem value="monthly">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          monthly (1st of month)
                        </div>
                      </SelectItem>
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
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    recipients
                  </FormLabel>
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
  );
}
