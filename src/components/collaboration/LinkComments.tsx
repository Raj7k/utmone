import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  comment_text: string;
  created_at: string;
  is_resolved: boolean;
  user_id: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface LinkCommentsProps {
  linkId: string;
}

export const LinkComments = ({ linkId }: LinkCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [linkId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("link_comments")
      .select("*")
      .eq("link_id", linkId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Fetch user profiles separately
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const commentsWithProfiles = data.map(comment => ({
        ...comment,
        profiles: profilesData?.find(p => p.id === comment.user_id),
      }));

      setComments(commentsWithProfiles as Comment[]);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`link_comments:${linkId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "link_comments",
          filter: `link_id=eq.${linkId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("link_comments").insert({
      link_id: linkId,
      comment_text: newComment,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } else {
      setNewComment("");
      toast({
        title: "Comment Posted",
        description: "Your comment has been added",
      });
    }
    setIsSubmitting(false);
  };

  const toggleResolve = async (commentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("link_comments")
      .update({ is_resolved: !currentStatus })
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Team Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or note for your team..."
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-lg border transition-colors ${
              comment.is_resolved ? "bg-muted/50 border-muted" : "bg-background border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="text-xs">
                  {comment.profiles?.full_name?.[0] || comment.profiles?.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{comment.profiles?.full_name || comment.profiles?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant={comment.is_resolved ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggleResolve(comment.id, comment.is_resolved)}
                    className="gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {comment.is_resolved ? "Resolved" : "Resolve"}
                  </Button>
                </div>
                <p className={`text-sm leading-relaxed ${comment.is_resolved ? "line-through text-muted-foreground" : ""}`}>
                  {comment.comment_text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No comments yet. Start the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};
