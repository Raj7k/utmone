import { motion } from "framer-motion";
import { Clock, User, ExternalLink, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const TimeTravelAuditMockup = () => {
  const [sliderValue, setSliderValue] = useState([75]);
  
  const events = [
    {
      date: "30 days ago",
      user: "Sarah Chen",
      action: "Changed destination URL",
      from: "https://example.com/old",
      to: "https://example.com/new",
      position: 10
    },
    {
      date: "22 days ago",
      user: "John Park",
      action: "Edited UTM parameters",
      from: "utm_campaign=spring",
      to: "utm_campaign=spring_sale",
      position: 35
    },
    {
      date: "15 days ago",
      user: "Maria Garcia",
      action: "Updated QR code style",
      from: "Classic black",
      to: "Branded colors",
      position: 50
    },
    {
      date: "7 days ago",
      user: "Alex Kumar",
      action: "Changed max clicks limit",
      from: "10,000",
      to: "Unlimited",
      position: 75
    },
    {
      date: "Today",
      user: "You",
      action: "Viewing audit trail",
      from: "-",
      to: "-",
      position: 100
    }
  ];

  const currentEvent = events.find(e => Math.abs(e.position - sliderValue[0]) < 15) || events[events.length - 1];

  return (
    <div className="relative">
      <Card className="p-8 md:p-12 bg-card border-2 border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Clock className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-label lowercase">
              time-travel audit trail
            </h3>
            <p className="text-sm text-secondary-label">
              replay every change to any link
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-secondary-label">30 days ago</span>
            <span className="text-sm text-secondary-label">Today</span>
          </div>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={1}
            className="mb-4"
          />
          <div className="flex gap-2 justify-between">
            {events.map((event, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full transition-all"
                style={Math.abs(event.position - sliderValue[0]) < 15 
                  ? { background: 'rgba(59,130,246,1)', transform: 'scale(1.5)' }
                  : { background: 'rgba(255,255,255,0.3)' }
                }
              />
            ))}
          </div>
        </div>

        <motion.div
          key={currentEvent.date}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-muted/50 border-2 border-border"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
              {currentEvent.action.includes("destination") ? (
                <ExternalLink className="w-5 h-5" style={{ color: 'rgba(59,130,246,1)' }} />
              ) : (
                <Edit3 className="w-5 h-5" style={{ color: 'rgba(59,130,246,1)' }} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-secondary-label" />
                <span className="font-semibold text-label">{currentEvent.user}</span>
                <span className="text-xs text-secondary-label">• {currentEvent.date}</span>
              </div>
              <p className="text-sm text-label mb-4">{currentEvent.action}</p>
              {currentEvent.from !== "-" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                    <span className="text-red-600 dark:text-red-400 font-mono">
                      {currentEvent.from}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <span className="text-green-600 dark:text-green-400 font-mono">
                      {currentEvent.to}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex items-center gap-2 text-xs text-secondary-label">
          <Clock className="w-4 h-4" />
          <span>All changes are logged and immutable. Perfect for compliance audits.</span>
        </div>
      </Card>
    </div>
  );
};
