import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles } from "lucide-react";
import { rankContacts, type Contact, type RankedContact } from "@/lib/optimizations/contactRanking";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

interface SmartContactRankingProps {
  contacts: Contact[];
  onInvite: (email: string, name: string) => void;
}

export function SmartContactRanking({ contacts, onInvite }: SmartContactRankingProps) {
  const { currentWorkspace } = useWorkspaceContext();
  
  if (!currentWorkspace) return null;

  // Get workspace domain from domains table or default to utm.one
  const workspaceDomain = 'utm.one';
  const rankedContacts = rankContacts(contacts, workspaceDomain);
  const topSuggestions = rankedContacts.slice(0, 5);

  if (topSuggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-white/90" />
        <h3 className="text-sm font-medium">suggested for {currentWorkspace.name}</h3>
      </div>

      <div className="space-y-2">
        {topSuggestions.map((contact, index) => (
          <div
            key={contact.email}
            className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">{contact.name}</span>
                {contact.tier === 1 && (
                  <Badge variant="secondary" className="text-xs">
                    Best Match
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
              {contact.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {contact.reasons.map((reason, i) => (
                    <span key={i} className="text-xs text-muted-foreground/70">
                      {reason}
                      {i < contact.reasons.length - 1 && ' •'}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => onInvite(contact.email, contact.name)}
              className="ml-3"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        ranked by domain match, role fit, and recency
      </p>
    </div>
  );
}
