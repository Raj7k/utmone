import { useParams, useNavigate } from "react-router-dom";
import { EnhancedTargetingRulesManager } from "@/components/links/EnhancedTargetingRulesManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Link2 } from "lucide-react";

export default function Targeting() {
  const { linkId } = useParams<{ linkId?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: links, isLoading } = useQuery({
    queryKey: ['links-with-targeting'],
    queryFn: async () => {
      const { data: workspace } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!workspace) return [];

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
        .eq('workspace_id', workspace.workspace_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const filteredLinks = links?.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">targeting rules</h1>
        <p className="text-muted-foreground mt-2">
          create conditional redirects based on country, device, browser, and more
        </p>
      </div>

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
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading links...</div>
            ) : filteredLinks && filteredLinks.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => navigate(`/dashboard/targeting/${link.id}`)}
                    className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors flex items-center justify-between group"
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
                {searchQuery ? 'No links match your search' : 'No links found. Create a link first.'}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
