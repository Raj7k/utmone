import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewNeededBadgeProps {
  count: number;
}

export const ReviewNeededBadge = ({ count }: ReviewNeededBadgeProps) => {
  if (count === 0) {
    return (
      <Badge variant="outline" className="gap-1 text-green-600 border-green-600/50 bg-green-500/10">
        <CheckCircle className="h-3 w-3" />
        all verified
      </Badge>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600/50 bg-yellow-500/10">
        <AlertTriangle className="h-3 w-3" />
        {count} need{count === 1 ? 's' : ''} review
      </Badge>
    </motion.div>
  );
};
