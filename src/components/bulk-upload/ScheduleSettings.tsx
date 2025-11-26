import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

export interface ScheduleData {
  enabled: boolean;
  activationDate: Date | null;
  activationTime: string;
}

interface ScheduleSettingsProps {
  schedule: ScheduleData;
  onChange: (schedule: ScheduleData) => void;
}

export function ScheduleSettings({ schedule, onChange }: ScheduleSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleScheduleToggle = (enabled: boolean) => {
    onChange({
      ...schedule,
      enabled,
      activationDate: enabled ? schedule.activationDate || new Date() : null,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange({
        ...schedule,
        activationDate: date,
      });
      setIsOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...schedule,
      activationTime: e.target.value,
    });
  };

  const getFullActivationTimestamp = (): Date | null => {
    if (!schedule.activationDate || !schedule.activationTime) return null;
    
    const [hours, minutes] = schedule.activationTime.split(':').map(Number);
    const timestamp = new Date(schedule.activationDate);
    timestamp.setHours(hours, minutes, 0, 0);
    
    return timestamp;
  };

  const fullTimestamp = getFullActivationTimestamp();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">schedule activation</h3>
      <p className="text-sm text-muted-foreground mb-6">
        delay link activation until a specific date and time
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <Label>schedule links</Label>
          </div>
          <Switch checked={schedule.enabled} onCheckedChange={handleScheduleToggle} />
        </div>

        {schedule.enabled && (
          <div className="space-y-4 pl-6 border-l-2 border-primary/20">
            <div>
              <Label htmlFor="activation-date" className="text-sm">activation date</Label>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {schedule.activationDate ? format(schedule.activationDate, "PPP") : "select date..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={schedule.activationDate || undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="activation-time" className="text-sm">activation time</Label>
              <input
                id="activation-time"
                type="time"
                value={schedule.activationTime}
                onChange={handleTimeChange}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            {fullTimestamp && (
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">links will activate at:</p>
                <p className="text-sm font-medium">
                  {format(fullTimestamp, "PPP 'at' p")}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  links will be created immediately but remain inactive until scheduled time
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
