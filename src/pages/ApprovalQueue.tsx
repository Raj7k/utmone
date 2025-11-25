import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

interface PendingLink {
  id: string;
  title: string;
  short_url: string;
  destination_url: string;
  submitted_for_approval_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export default function ApprovalQueue() {
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingLinks();
  }, []);

  const fetchPendingLinks = async () => {
    setIsLoading(true);
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("approval_status", "pending")
      .order("submitted_for_approval_at", { ascending: false });

    if (!error && data) {
      // Fetch creator profiles separately
      const userIds = [...new Set(data.map(l => l.created_by))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const linksWithProfiles = data.map(link => ({
        ...link,
        profiles: profilesData?.find(p => p.id === link.created_by) || { full_name: null, email: "Unknown" },
      }));

      setPendingLinks(linksWithProfiles as PendingLink[]);
    }
    setIsLoading(false);
  };

  const handleApprove = async (linkId: string) => {
    const { error } = await supabase
      .from("links")
      .update({ approval_status: "approved" })
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Approved",
        description: "Link has been approved",
      });
      fetchPendingLinks();
    }
  };

  const handleReject = async (linkId: string) => {
    const { error } = await supabase
      .from("links")
      .update({ approval_status: "rejected" })
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Rejected",
        description: "Link has been rejected",
      });
      fetchPendingLinks();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Approval Queue</h1>
          <p className="text-lg text-muted-foreground">
            Review and approve links submitted by your team
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : pendingLinks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No Pending Approvals</h3>
            <p className="text-muted-foreground">All links have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingLinks.map((link) => (
              <div
                key={link.id}
                className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="gap-1.5">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Submitted {formatDistanceToNow(new Date(link.submitted_for_approval_at), { addSuffix: true })}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-1">{link.title}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="px-2 py-1 bg-muted rounded text-primary font-mono">
                          {link.short_url}
                        </code>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate max-w-md">
                          {link.destination_url}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Requested by <span className="font-medium">{link.profiles?.full_name || link.profiles?.email}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(link.id)}
                      variant="default"
                      size="sm"
                      className="gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(link.id)}
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
