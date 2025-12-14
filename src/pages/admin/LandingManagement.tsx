import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown, Megaphone, TestTube } from "lucide-react";
import { useAnnouncementAdmin } from "@/hooks/useAnnouncementAdmin";
import { useLandingAnalytics } from "@/hooks/analytics";
import { ABTestResults } from "@/components/landing/ABTestResults";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function LandingManagement() {
  const { announcements, isLoading, fetchAnnouncementAnalytics, toggleActive, deleteAnnouncement } = useAnnouncementAdmin();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);
  const { data: abTestMetrics } = useLandingAnalytics(30);

  const { data: analytics } = useQuery({
    queryKey: ["announcement-analytics", selectedAnnouncement],
    queryFn: () => fetchAnnouncementAnalytics(selectedAnnouncement!, 30),
    enabled: !!selectedAnnouncement,
  });

  return (
    <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold">landing page control</h1>
          <p className="text-muted-foreground mt-1">
            manage announcements and a/b tests
          </p>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="announcements">
              <Megaphone className="h-4 w-4 mr-2" />
              announcements
            </TabsTrigger>
            <TabsTrigger value="abtests">
              <TestTube className="h-4 w-4 mr-2" />
              a/b tests
            </TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {announcements?.length || 0} total announcements
              </p>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                new announcement
              </Button>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">loading announcements...</p>
                </CardContent>
              </Card>
            ) : announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
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
                          <CardDescription>{announcement.message}</CardDescription>
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

                    {selectedAnnouncement === announcement.config_id && analytics && (
                      <CardContent>
                        <div className="grid grid-cols-5 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">impressions</p>
                            <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">clicks</p>
                            <p className="text-2xl font-bold">{analytics.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">ctr</p>
                            <p className="text-2xl font-bold flex items-center gap-1">
                              {analytics.ctr.toFixed(1)}%
                              {analytics.ctr > 5 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">dismissals</p>
                            <p className="text-2xl font-bold">{analytics.dismissals.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">dismissal rate</p>
                            <p className="text-2xl font-bold">{analytics.dismissalRate.toFixed(1)}%</p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">no announcements yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* A/B Tests Tab */}
          <TabsContent value="abtests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>hero section a/b test</CardTitle>
                <CardDescription>
                  4 variants testing different messaging approaches
                </CardDescription>
              </CardHeader>
            </Card>

            {abTestMetrics && abTestMetrics.length > 0 ? (
              <ABTestResults metrics={abTestMetrics} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">no a/b test data yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}
