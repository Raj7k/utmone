import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBulkUploadComments } from "@/hooks/useBulkUploadComments";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { MentionInput } from "./MentionInput";
import { MessageSquare, CheckCircle, Circle, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface BulkUploadCommentsProps {
  bulkUploadId: string;
  workspaceId: string;
}

export function BulkUploadComments({ bulkUploadId, workspaceId }: BulkUploadCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { comments, isLoading, addComment, resolveComment } = useBulkUploadComments(bulkUploadId);
  const { getMemberName, getMemberAvatar } = useWorkspaceMembers(workspaceId);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bulk-upload-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bulk_upload_comments',
          filter: `bulk_upload_id=eq.${bulkUploadId}`
        },
        () => {
          // Trigger refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bulkUploadId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ 
      comment: newComment, 
      parentId: replyingTo, 
      mentions: mentionedUsers 
    });
    setNewComment("");
    setMentionedUsers([]);
    setReplyingTo(null);
  };

  const topLevelComments = comments.filter(c => !(c as any).parent_id);
  const getReplies = (parentId: string) => comments.filter(c => (c as any).parent_id === parentId);

  const unresolvedCount = comments.filter((c) => !c.is_resolved).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Team Comments
            </CardTitle>
            <CardDescription>
              {unresolvedCount > 0 && `${unresolvedCount} unresolved`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {replyingTo && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Reply className="h-3 w-3" />
              replying to comment...
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                cancel
              </Button>
            </div>
          )}
          <MentionInput
            value={newComment}
            onChange={(value, mentions) => {
              setNewComment(value);
              setMentionedUsers(mentions);
            }}
            workspaceId={workspaceId}
            placeholder="add a comment... (type @ to mention)"
          />
          <Button onClick={handleAddComment} disabled={addComment.isPending || !newComment.trim()}>
            {addComment.isPending ? "adding..." : replyingTo ? "reply" : "add comment"}
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">loading comments...</p>
          ) : topLevelComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">no comments yet</p>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment) => {
                const replies = getReplies(comment.id);
                return (
                  <div key={comment.id} className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getMemberAvatar(comment.user_id) || undefined} />
                          <AvatarFallback>
                            {getMemberName(comment.user_id)[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {getMemberName(comment.user_id)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                            {comment.is_resolved && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {comment.comment_text.replace(/@\[([^\]]+)\]\([^)]+\)/g, "@$1")}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(comment.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              reply
                            </Button>
                            {!comment.is_resolved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  resolveComment.mutate({
                                    commentId: comment.id,
                                    resolved: true,
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Threaded Replies */}
                    {replies.length > 0 && (
                      <div className="ml-12 space-y-2">
                        {replies.map((reply) => (
                          <div key={reply.id} className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={getMemberAvatar(reply.user_id) || undefined} />
                                <AvatarFallback className="text-xs">
                                  {getMemberName(reply.user_id)[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {getMemberName(reply.user_id)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">
                                  {reply.comment_text.replace(/@\[([^\]]+)\]\([^)]+\)/g, "@$1")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
