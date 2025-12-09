import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const eventSchema = z.object({
  name: z.string().min(1, "event name is required"),
  location_city: z.string().min(1, "city is required"),
  location_country: z.string().min(1, "country is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onEventCreated: () => void;
}

export const CreateEventDialog = ({
  open,
  onOpenChange,
  workspaceId,
  onEventCreated
}: CreateEventDialogProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      location_city: "",
      location_country: "US",
    },
  });

  const handleCreate = async (data: EventFormData) => {
    if (!startDate || !endDate) {
      toast({
        title: "dates required",
        description: "please select start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "invalid dates",
        description: "end date must be after start date",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('field_events')
        .insert({
          workspace_id: workspaceId,
          name: data.name,
          location_city: data.location_city,
          location_country: data.location_country,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          created_by: user.user?.id,
          status: 'upcoming',
        });

      if (error) throw error;

      toast({
        title: "event created",
        description: `${data.name} has been added`,
      });

      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      onOpenChange(false);
      onEventCreated();

    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "failed to create event",
        description: "please try again",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>create field event</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="name">event name</Label>
            <Input
              id="name"
              placeholder="TechCrunch Disrupt 2025"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">city</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="San Francisco"
                  className="pl-9"
                  {...form.register("location_city")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">country</Label>
              <Input
                id="country"
                placeholder="US"
                {...form.register("location_country")}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>start date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>end date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "creating..." : "create event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
