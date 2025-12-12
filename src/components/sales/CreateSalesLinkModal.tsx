import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SalesLinkCreator } from "./SalesLinkCreator";
import { Check, Copy, ExternalLink, Plus, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notify } from "@/lib/notify";

interface CreateSalesLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SuccessData {
  shortUrl: string;
  prospectName: string;
  id: string;
}

export const CreateSalesLinkModal = ({ open, onOpenChange }: CreateSalesLinkModalProps) => {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSuccess = (data: SuccessData) => {
    setSuccessData(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${successData?.shortUrl}`);
    setCopied(true);
    notify.success("link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setSuccessData(null);
  };

  const handleClose = () => {
    setSuccessData(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {successData ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                >
                  <Check className="h-8 w-8 text-emerald-500" />
                </motion.div>
              </div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  sales link created
                </h3>
                <p className="text-sm text-muted-foreground">
                  tracking link for {successData.prospectName}
                </p>
              </motion.div>

              {/* Short URL Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted/50 rounded-xl p-4 mb-6 border border-border"
              >
                <p className="text-center font-mono text-sm text-foreground break-all">
                  https://{successData.shortUrl}
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <Button
                  onClick={handleCopy}
                  className="w-full gap-2"
                  variant={copied ? "outline" : "default"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      copy link
                    </>
                  )}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCreateAnother}
                    className="flex-1 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    create another
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    done
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">new sales link</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      track when prospects view your content
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <SalesLinkCreator
                onSuccess={handleSuccess}
                onCancel={handleClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
