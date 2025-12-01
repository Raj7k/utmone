import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface JourneyEvent {
  event_id: string;
  event_type: string;
  source: string;
  medium: string;
  campaign: string;
  revenue: number;
  event_name: string;
  landing_page: string;
  referrer: string;
  device_type: string;
  created_at: string;
}

interface CustomerJourneyTimelineProps {
  events: JourneyEvent[];
  isLoading: boolean;
}

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case "click":
      return "bg-blue-500";
    case "pageview":
      return "bg-green-500";
    case "conversion":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const CustomerJourneyTimeline = ({ events, isLoading }: CustomerJourneyTimelineProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">customer journey timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">loading journey data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">customer journey timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">no journey events found for this user</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">customer journey timeline</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          chronological view of user interactions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.event_id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${getEventColor(event.event_type)}`} />
                {index < events.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {event.event_type}
                    </Badge>
                    {event.event_name && (
                      <span className="text-sm font-medium">{event.event_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.created_at), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {event.source && (
                    <div>
                      <span className="font-medium">Source:</span> {event.source}
                      {event.medium && ` / ${event.medium}`}
                      {event.campaign && ` / ${event.campaign}`}
                    </div>
                  )}
                  {event.landing_page && (
                    <div>
                      <span className="font-medium">Page:</span> {event.landing_page}
                    </div>
                  )}
                  {event.referrer && (
                    <div>
                      <span className="font-medium">Referrer:</span> {event.referrer}
                    </div>
                  )}
                  {event.device_type && (
                    <div>
                      <span className="font-medium">Device:</span> {event.device_type}
                    </div>
                  )}
                  {event.revenue && event.revenue > 0 && (
                    <div className="font-medium text-green-600">
                      Revenue: ${event.revenue.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
