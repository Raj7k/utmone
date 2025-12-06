import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Users, Target } from "lucide-react";
import { useAnnouncementAdmin } from "@/hooks/useAnnouncementAdmin";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AnnouncementAdmin() {
  const { announcements, isLoading, fetchAnnouncementAnalytics, toggleActive, deleteAnnouncement } = useAnnouncementAdmin();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);

  // Fetch analytics for selected announcement
  const { data: analytics } = useQuery({
    queryKey: ["announcement-analytics", selectedAnnouncement],
    queryFn: () => fetchAnnouncementAnalytics(selectedAnnouncement!, 30),
    enabled: !!selectedAnnouncement,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-secondary-label">loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">announcement management</h1>
            <p className="text-secondary-label mt-2">
              manage announcement bar configurations and track performance
            </p>
          </div>
          <Button size="lg" className="rounded-full">
            <Plus className="h-4 w-4 mr-2" />
            new announcement
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">announcements</TabsTrigger>
            <TabsTrigger value="analytics">analytics</TabsTrigger>
            <TabsTrigger value="preview">preview</TabsTrigger>
          </TabsList>

          {/* Announcements List */}
          <TabsContent value="list" className="space-y-4">
            {announcements?.map((announcement: any) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{announcement.config_id}</CardTitle>
                        <Badge variant={announcement.is_active ? "default" : "secondary"}>
                          {announcement.is_active ? "active" : "inactive"}
                        </Badge>
                        <Badge variant="outline">priority: {announcement.priority}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {announcement.message}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={announcement.is_active}
                        onCheckedChange={(checked) =>
                          toggleActive({ id: announcement.id, isActive: checked })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAnnouncement(announcement.config_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this announcement?")) {
                            deleteAnnouncement(announcement.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    {/* Scheduling Info */}
                    {announcement.start_date && (
                      <div className="flex items-center gap-2 text-secondary-label">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(announcement.start_date), "MMM d")} -{" "}
                          {announcement.end_date
                            ? format(new Date(announcement.end_date), "MMM d")
                            : "ongoing"}
                        </span>
                      </div>
                    )}

                    {/* User Segment */}
                    <div className="flex items-center gap-2 text-secondary-label">
                      <Users className="h-4 w-4" />
                      <span>{announcement.user_segment}</span>
                    </div>

                    {/* Days of Week */}
                    {announcement.days_of_week && announcement.days_of_week.length > 0 && (
                      <div className="flex items-center gap-2 text-secondary-label">
                        <Target className="h-4 w-4" />
                        <span>
                          {announcement.days_of_week.length === 7
                            ? "every day"
                            : `${announcement.days_of_week.length} days/week`}
                        </span>
                      </div>
                    )}

                    {/* CTA */}
                    {announcement.cta_link && (
                      <div className="flex items-center gap-2 text-secondary-label">
                        <span className="font-medium">{announcement.cta_text}</span>
                        <span>→ {announcement.cta_link}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!announcements || announcements.length === 0) && (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-secondary-label">
                    no announcements configured yet. create your first one to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {selectedAnnouncement && analytics ? (
              <>
                <div className="grid grid-cols-5 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>impressions</CardDescription>
                      <CardTitle className="text-3xl">{analytics.impressions.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>clicks</CardDescription>
                      <CardTitle className="text-3xl">{analytics.clicks.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>click-through rate</CardDescription>
                      <CardTitle className="text-3xl flex items-center gap-2">
                        {analytics.ctr.toFixed(1)}%
                        {analytics.ctr > 5 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>dismissals</CardDescription>
                      <CardTitle className="text-3xl">{analytics.dismissals.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>dismissal rate</CardDescription>
                      <CardTitle className="text-3xl">{analytics.dismissalRate.toFixed(1)}%</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>performance insights</CardTitle>
                    <CardDescription>last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-label">engagement rate</span>
                      <span className="font-medium">
                        {((analytics.clicks + analytics.dismissals) / analytics.impressions * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-label">conversion quality</span>
                        <Badge variant={analytics.ctr > 5 ? "default" : "secondary"}>
                          {analytics.ctr > 5 ? "excellent" : analytics.ctr > 2 ? "good" : "needs improvement"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-secondary-label">
                    select an announcement from the list to view analytics
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>announcement preview</CardTitle>
                <CardDescription>
                  see how announcements appear under different conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-white/10 rounded-lg p-4 bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-center gap-3 text-center">
                    <p className="text-sm font-medium text-foreground">
                      🎉 Early access now open! Limited spots available for design partners.
                    </p>
                    <span className="text-sm font-semibold text-foreground">Join the waitlist →</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">targeting rules</p>
                    <ul className="space-y-1 text-secondary-label">
                      <li>• User Segment: all visitors</li>
                      <li>• Days: Monday - Sunday</li>
                      <li>• Time: 00:00 - 23:59</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">current match</p>
                    <Badge variant="default">would display now</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
