import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, LogOut } from "lucide-react";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { LinksTable } from "@/components/LinksTable";
import { LinkFilters } from "@/components/LinkFilters";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { User } from "@supabase/supabase-js";

const Links = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const initWorkspace = async () => {
      if (!workspaceLoading && !currentWorkspace && user) {
        createWorkspace("My Workspace");
      }
    };
    initWorkspace();
  }, [workspaceLoading, currentWorkspace, user, createWorkspace]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading || workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  LinkHub
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="default">Links</Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Links</h1>
              <p className="text-muted-foreground">
                Manage and track all your short links
              </p>
            </div>
            {currentWorkspace && <CreateLinkDialog workspaceId={currentWorkspace.id} />}
          </div>

          <LinkFilters
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Your Links</CardTitle>
            <CardDescription>
              View and manage all links in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentWorkspace ? (
              <LinksTable workspaceId={currentWorkspace.id} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Loading workspace...
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Links;
