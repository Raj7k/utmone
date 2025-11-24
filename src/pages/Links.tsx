import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, LogOut } from "lucide-react";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { EnhancedLinksTable } from "@/components/EnhancedLinksTable";
import { LinkFilters } from "@/components/LinkFilters";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import type { User } from "@supabase/supabase-js";

const Links = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCreateLink: () => setCreateLinkDialogOpen(true),
    onSearch: () => {
      const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]');
      searchInput?.focus();
    },
    onShowHelp: () => setShowShortcutsHelp(true),
  });

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
    <div className="min-h-screen bg-grouped-background">
      <header className="h-[72px] border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img 
                  src="/src/assets/utm-one-logo.svg" 
                  alt="utm.one" 
                  className="h-7 w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-2">
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/dashboard")}>
                  dashboard
                </Button>
                <Button variant="system" size="sm">links</Button>
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/analytics")}>
                  analytics
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-footnote text-secondary-label hidden md:block">
                {user?.email}
              </span>
              <Button variant="system-tertiary" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-group">
        <div className="mb-content">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-large-title font-bold text-label mb-2">links</h1>
              <p className="text-body-apple text-secondary-label">
                manage and track all your short links
              </p>
            </div>
            {currentWorkspace && (
              <CreateLinkDialog 
                workspaceId={currentWorkspace.id}
                open={createLinkDialogOpen}
                onOpenChange={setCreateLinkDialogOpen}
              />
            )}
          </div>

          <LinkFilters
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
          />
        </div>

        <Card variant="grouped">
          <CardHeader>
            <CardTitle className="text-title-2 text-label">Your Links</CardTitle>
            <CardDescription className="text-secondary-label">
              View and manage all links in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentWorkspace ? (
              <EnhancedLinksTable 
                workspaceId={currentWorkspace.id}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            ) : (
              <p className="text-center text-secondary-label py-8">
                Loading workspace...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp 
          open={showShortcutsHelp}
          onOpenChange={setShowShortcutsHelp}
        />
      </main>
    </div>
  );
};

export default Links;
