import { motion } from "framer-motion";
import { AlertTriangle, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface EmailMismatchDialogProps {
  invitedEmail: string;
  currentEmail: string;
  onSignOut: () => void;
  onCancel: () => void;
}

export function EmailMismatchDialog({ 
  invitedEmail, 
  currentEmail, 
  onSignOut, 
  onCancel 
}: EmailMismatchDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="w-full max-w-md border-border shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </motion.div>
            <h2 className="text-xl font-display font-bold text-foreground">
              different email detected
            </h2>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              this invitation was sent to a different email address
            </p>
            
            <div className="space-y-3">
              {/* Invited Email */}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">invitation sent to</p>
                <p className="font-medium text-foreground">{invitedEmail}</p>
              </div>
              
              {/* Current Email */}
              <div className="p-3 bg-muted/50 border border-border rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">you're signed in as</p>
                <p className="font-medium text-foreground">{currentEmail}</p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              sign out and use the invited email to accept this invitation
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={onSignOut}
              className="w-full h-12 rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-2" />
              sign out & use invited email
            </Button>
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full h-12 rounded-xl text-muted-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              cancel
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
