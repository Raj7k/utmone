import { useParams, useNavigate } from "react-router-dom";
import { EnhancedTargetingRulesManager } from "@/components/links/EnhancedTargetingRulesManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Search, Link2, Plus, ArrowRight } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";

// Skeleton for link list
const LinkListSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3, 4, 5].map(i => (
      <Skeleton key={i} className="h-20 w-full rounded-lg" />
    ))}
  </div>
);

export default function Targeting() {
  const { linkId } = useParams<{ linkId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use shared workspace context instead of duplicate queries
  const { currentWorkspace } = useWorkspace();
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || '';

  const { data: links, isLoading, isFetched } = useQuery({
    queryKey: ['links-with-targeting', effectiveWorkspaceId],
    queryFn: async () => {
      if (!effectiveWorkspaceId) return [];

      const { data, error } = await supabase
        .from('links')
        .select(`
          id,
          title,
          slug,
          short_url,
          domain,
          path,
          targeting_rules(count)
        `)
        .eq('workspace_id', effectiveWorkspaceId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!effectiveWorkspaceId,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000
  });

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);

  // Detect if search query is a full URL and extract slug
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1];
      
      const matchingLink = links?.find(link => link.slug === slug);
      if (matchingLink) {
        navigate(`/dashboard/targeting/${matchingLink.id}`);
      }
    } catch {
      // Not a URL, continue with normal search
    }
  };

  const filteredLinks = links?.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContentWrapper
      title="geo-targeting"
      description="create conditional redirects based on country, device, browser, and more"
      breadcrumbs={[{ label: "geo-targeting" }]}
    >
      {linkId ? (
        <EnhancedTargetingRulesManager linkId={linkId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>select a link</CardTitle>
            <CardDescription>
              choose a link to manage its targeting rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search links or paste short URL..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && !filteredLinks?.length && links?.length ? (
              <div className="text-xs text-muted-foreground px-1">
                💡 Tip: Paste your full short URL (e.g., https://utm.one/abc123) to jump directly to its targeting rules
              </div>
            ) : null}

            {/* Progressive loading - skeleton or content */}
            {isLoading ? (
              <LinkListSkeleton />
            ) : !links || links.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-primary/10">
                  <Link2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No links yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    To use targeting rules, you need to create a short link first. Then you can add conditional redirects based on country, device, or browser.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => navigate('/dashboard/links')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first link
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Go to dashboard
                  </Button>
                </div>
              </div>
            ) : filteredLinks && filteredLinks.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => navigate(`/dashboard/targeting/${link.id}`)}
                    className="w-full text-left p-4 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{link.title}</span>
                        {link.targeting_rules && link.targeting_rules.length > 0 && (
                          <Badge variant="secondary">
                            {link.targeting_rules[0].count} {link.targeting_rules[0].count === 1 ? 'rule' : 'rules'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono truncate">
                        {link.domain}/{link.path ? `${link.path}/` : ''}{link.slug}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No links match your search
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageContentWrapper>
  );
}
