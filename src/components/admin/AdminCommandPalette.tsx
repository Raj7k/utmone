import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Building2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  id: string;
  type: 'user' | 'workspace' | 'link';
  title: string;
  subtitle?: string;
  url: string;
}

export const AdminCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchLower = search.toLowerCase();
        
        // Search profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .or(`email.ilike.%${searchLower}%,full_name.ilike.%${searchLower}%`)
          .limit(5);

        // Search workspaces
        const { data: workspaces } = await supabase
          .from('workspaces')
          .select('id, name, slug')
          .or(`name.ilike.%${searchLower}%,slug.ilike.%${searchLower}%`)
          .limit(5);

        // Search links
        const { data: links } = await supabase
          .from('links')
          .select('id, title, short_url, destination_url')
          .or(`title.ilike.%${searchLower}%,short_url.ilike.%${searchLower}%`)
          .limit(5);

        const combined: SearchResult[] = [
          ...(profiles || []).map(p => ({
            id: p.id,
            type: 'user' as const,
            title: p.full_name || p.email || 'Unknown User',
            subtitle: p.email,
            url: `/admin/users/${p.id}`,
          })),
          ...(workspaces || []).map(w => ({
            id: w.id,
            type: 'workspace' as const,
            title: w.name,
            subtitle: w.slug,
            url: `/admin/workspaces/${w.id}`,
          })),
          ...(links || []).map(l => ({
            id: l.id,
            type: 'link' as const,
            title: l.title || l.short_url,
            subtitle: l.destination_url,
            url: `/admin/links/${l.id}`,
          })),
        ];

        setResults(combined);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search failed",
          description: "Could not perform search",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, toast]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setSearch("");
    navigate(url);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'workspace':
        return <Building2 className="w-4 h-4" />;
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'user':
        return 'User';
      case 'workspace':
        return 'Workspace';
      case 'link':
        return 'Link';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/80">
      <Command 
        className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden bg-card backdrop-blur-xl border border-border"
        shouldFilter={false}
      >
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search users, workspaces, links..."
            className="flex h-14 w-full bg-transparent py-3 px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            autoFocus
          />
          <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded px-2 font-mono text-xs opacity-100 flex bg-muted border border-border text-muted-foreground">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && search && results.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {['user', 'workspace', 'link'].map((type) => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <Command.Group key={type} heading={getTypeLabel(type as SearchResult['type']) + 's'}>
                    {typeResults.map((result) => (
                      <Command.Item
                        key={result.id}
                        value={result.id}
                        onSelect={() => handleSelect(result.url)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-foreground"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-foreground">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-xs truncate font-mono text-muted-foreground">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                );
              })}
            </>
          )}
        </Command.List>

        <div className="px-4 py-2 text-xs flex items-center justify-between border-t border-border text-muted-foreground">
          <span>Type to search</span>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 bg-muted border border-border text-muted-foreground">
              ↑↓
            </kbd>
            <span>to navigate</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 bg-muted border border-border text-muted-foreground">
              ↵
            </kbd>
            <span>to select</span>
          </div>
        </div>
      </Command>

      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setOpen(false)}
      />
    </div>
  );
};
