import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvitationSuccessProps {
  workspaceName: string;
  role: string;
}

export function InvitationSuccess({ workspaceName, role }: InvitationSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center space-y-6"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mx-auto w-20 h-20"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </motion.div>

      {/* Sparkles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-2"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          >
            <Sparkles className="h-4 w-4 text-primary/60" />
          </motion.div>
        ))}
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-display font-bold text-foreground">
          welcome to {workspaceName}!
        </h2>
        <p className="text-muted-foreground">
          you've joined as
        </p>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {role}
        </Badge>
      </motion.div>

      {/* Redirect Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
          <div className="h-1.5 w-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-1.5 w-1.5 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="text-sm text-muted-foreground">
          taking you to your workspace...
        </p>
      </motion.div>
    </motion.div>
  );
}
