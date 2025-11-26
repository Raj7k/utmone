import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Check, X } from "lucide-react";
import { useBulkUploadComments } from "@/hooks/useBulkUploadComments";
import { formatDistanceToNow } from "date-fns";

interface BulkUploadCommentsProps {
  bulkUploadId: string;
}

export function BulkUploadComments({ bulkUploadId }: BulkUploadCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { comments, isLoading, addComment, resolveComment } = useBulkUploadComments(bulkUploadId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ comment: newComment });
    setNewComment("");
  };

  const unresolvedCount = comments.filter((c) => !c.is_resolved).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-display text-title-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              Team Comments
            </CardTitle>
            <CardDescription>
              Collaborate with your team on this bulk upload
            </CardDescription>
          </div>
          {unresolvedCount > 0 && (
            <Badge variant="secondary">
              {unresolvedCount} unresolved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || addComment.isPending}
              size="sm"
            >
              Add Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.is_resolved ? "bg-muted/20" : "bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">User {comment.user_id.substring(0, 8)}</div>
                        {comment.is_resolved && (
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {!comment.is_resolved && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            resolveComment.mutate({ commentId: comment.id, resolved: true })
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {comment.is_resolved && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            resolveComment.mutate({ commentId: comment.id, resolved: false })
                          }
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.comment_text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
