import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Repeat2, Share2, Download } from "lucide-react";
import { shareOnLinkedIn, downloadCardAsImage } from "@/lib/utils/linkedinShare";

interface LinkedInPostCardProps {
  author: string;
  role: string;
  excerpt: string;
  likes: number;
  comments: number;
  shares: number;
  topic: string;
  cardId: string;
}

export const LinkedInPostCard = ({ author, role, excerpt, likes, comments, shares, topic, cardId }: LinkedInPostCardProps) => {
  const handleShare = () => {
    const shareText = `${excerpt} — via utm.one Salary Report 2026`;
    shareOnLinkedIn(shareText);
  };

  const handleDownload = () => {
    downloadCardAsImage(cardId, `${topic.toLowerCase().replace(/\s+/g, '-')}-linkedin-post.png`);
  };

  return (
    <Card id={cardId} className="bg-white border-2 border-[#0A66C2]/20 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#0A66C2]/10 flex items-center justify-center font-bold text-[#0A66C2]">
            {author.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
          <Badge className="bg-[hsl(18,100%,51%)] text-white">{topic}</Badge>
        </div>
        
        <p className="text-sm leading-relaxed mb-4 italic text-foreground/80">
          "{excerpt}"
        </p>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Repeat2 className="w-4 h-4" />
            <span>{shares}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </Button>
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download as Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
