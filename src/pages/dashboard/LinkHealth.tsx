import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, ExternalLink, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Link {
  id: string;
  title: string;
  slug: string;
  destination_url: string;
  fallback_url: string | null;
  health_status: "healthy" | "unhealthy" | "unknown";
  last_health_check: string | null;
  health_check_failures: number;
  total_clicks: number;
}

export default function LinkHealth() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const { data: links, isLoading, refetch } = useQuery({
    queryKey: ["link-health"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("id, title, slug, destination_url, fallback_url, health_status, last_health_check, health_check_failures, total_clicks")
        .eq("status", "active")
        .order("cache_score", { ascending: false });

      if (error) throw error;
      return data as Link[];
    },
  });

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const { error } = await supabase.functions.invoke("check-link-health");

      if (error) throw error;

      toast({
        title: "health check started",
        description: "checking your links... this may take a minute.",
      });

      // Refetch after 30 seconds
      setTimeout(() => {
        refetch();
        setIsChecking(false);
        toast({
          title: "health check complete",
          description: "link status updated.",
        });
      }, 30000);
    } catch (error) {
      console.error("Health check error:", error);
      toast({
        title: "check failed",
        description: "please try again later.",
        variant: "destructive",
      });
      setIsChecking(false);
    }
  };

  const filteredLinks = links?.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.destination_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    healthy: links?.filter((l) => l.health_status === "healthy").length || 0,
    unhealthy: links?.filter((l) => l.health_status === "unhealthy").length || 0,
    unknown: links?.filter((l) => l.health_status === "unknown").length || 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "unhealthy":
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      healthy: "default",
      unhealthy: "destructive",
      unknown: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">link guard</h1>
          <p className="text-muted-foreground mt-2">
            we check your links automatically so you never lose a click
          </p>
        </div>
        <Button onClick={handleManualCheck} disabled={isChecking} variant="marketing">
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          check now
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">working links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.healthy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">broken links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.unhealthy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">not checked yet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.unknown}</div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            how link guard protects you
          </CardTitle>
          <CardDescription>automatic protection against broken links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">1. we check your top links every hour</h3>
              <p className="text-sm text-muted-foreground">
                your 100 most active links are automatically tested to make sure they're working.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. if a link breaks, we flag it immediately</h3>
              <p className="text-sm text-muted-foreground">
                links that return errors or time out are marked as broken after 3 attempts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. fallback URLs keep traffic flowing</h3>
              <p className="text-sm text-muted-foreground">
                if you've set a backup URL, we redirect traffic there automatically while you fix the issue.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. you get notified so nothing slips through</h3>
              <p className="text-sm text-muted-foreground">
                when a link becomes unhealthy, we email you right away so you can take action.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>all active links</CardTitle>
            <Input
              placeholder="search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">loading...</div>
          ) : filteredLinks && filteredLinks.length > 0 ? (
            <div className="space-y-4">
              {filteredLinks.map((link) => (
                <div
                  key={link.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(link.health_status)}
                        <h3 className="font-semibold truncate">{link.title}</h3>
                        {getStatusBadge(link.health_status)}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">utm.one/{link.slug}</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                        <div className="truncate">→ {link.destination_url}</div>
                        {link.fallback_url && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Shield className="h-3 w-3" />
                            backup: {link.fallback_url}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{link.total_clicks?.toLocaleString() || 0} clicks</span>
                        {link.health_check_failures > 0 && (
                          <span className="text-red-600 dark:text-red-400">
                            {link.health_check_failures} failure{link.health_check_failures > 1 ? 's' : ''}
                          </span>
                        )}
                        {link.last_health_check && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            checked {formatDistanceToNow(new Date(link.last_health_check), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              no links found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
