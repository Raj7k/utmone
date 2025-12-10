import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Flame, Sun, Snowflake, Check, ChevronRight, 
  Mic, MicOff, X, Building2, Briefcase
} from "lucide-react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader,
  DrawerFooter,
  DrawerClose 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { haptics, temperatureHaptic, LeadTemperature } from "./useHaptics";

interface CapturedLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  title: string;
}

interface LeadCaptureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: CapturedLead | null;
  onSave: (temperature: LeadTemperature, notes: string) => void;
  onViewDetails: () => void;
}

const temperatureOptions: { value: LeadTemperature; icon: typeof Flame; label: string; color: string; bgColor: string }[] = [
  { value: 'hot', icon: Flame, label: 'hot', color: 'text-orange-500', bgColor: 'bg-orange-500/20 border-orange-500/30' },
  { value: 'warm', icon: Sun, label: 'warm', color: 'text-amber-400', bgColor: 'bg-amber-400/20 border-amber-400/30' },
  { value: 'cold', icon: Snowflake, label: 'cold', color: 'text-blue-400', bgColor: 'bg-blue-400/20 border-blue-400/30' },
];

/**
 * Bottom sheet for quick lead qualification
 * Optimized for one-handed mobile use
 */
export const LeadCaptureSheet = ({ 
  open, 
  onOpenChange, 
  lead, 
  onSave,
  onViewDetails 
}: LeadCaptureSheetProps) => {
  const [temperature, setTemperature] = useState<LeadTemperature | null>(null);
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleTemperatureSelect = (temp: LeadTemperature) => {
    setTemperature(temp);
    temperatureHaptic(temp);
  };

  const handleSave = () => {
    if (temperature) {
      haptics.save();
      onSave(temperature, notes);
      // Reset state
      setTemperature(null);
      setNotes('');
    }
  };

  const displayName = lead ? `${lead.firstName} ${lead.lastName}`.trim() : '';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card border-border max-h-[85vh]">
        <DrawerHeader className="pb-2">
          {/* Close button */}
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
          
          {/* Lead info */}
          <div className="flex items-start gap-4">
            {/* Success indicator */}
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-xl font-semibold text-foreground truncate">
                {displayName || 'New Lead'}
              </h3>
              {lead?.title && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3 h-3" />
                  {lead.title}
                </p>
              )}
              {lead?.company && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3" />
                  {lead.company}
                </p>
              )}
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 space-y-6 pb-2">
          {/* Temperature selector */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">how interested?</p>
            <div className="flex gap-3">
              {temperatureOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = temperature === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTemperatureSelect(option.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all",
                      isSelected 
                        ? option.bgColor
                        : "bg-muted/30 border-border hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-7 h-7 transition-colors",
                      isSelected ? option.color : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {option.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Quick notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">quick note</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  "h-8 gap-1.5",
                  isRecording && "text-red-500"
                )}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    voice
                  </>
                )}
              </Button>
            </div>
            
            {isRecording ? (
              <div className="h-24 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <div className="flex items-center gap-2 text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm">recording...</span>
                </div>
              </div>
            ) : (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="great conversation about..."
                className="h-24 resize-none bg-muted/30 border-border"
              />
            )}
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={!temperature}
            className="w-full h-14 text-lg gap-2"
          >
            <Check className="w-5 h-5" />
            save & scan next
          </Button>
          
          <Button
            variant="ghost"
            onClick={onViewDetails}
            className="w-full text-muted-foreground"
          >
            view full details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
