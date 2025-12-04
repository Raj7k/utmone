import { Plus, Link as LinkIcon, QrCode, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MobileFloatingActionsProps {
  onCreateLink?: () => void;
  onScanQR?: () => void;
  onSearch?: () => void;
}

export const MobileFloatingActions = ({
  onCreateLink,
  onScanQR,
  onSearch,
}: MobileFloatingActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: LinkIcon, label: "Create Link", onClick: onCreateLink },
    { icon: QrCode, label: "Scan QR", onClick: onScanQR },
    { icon: Search, label: "Search", onClick: onSearch },
  ].filter((action) => action.onClick);

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 shadow-lg gap-2"
                  onClick={() => {
                    action.onClick?.();
                    setIsExpanded(false);
                  }}
                >
                  <action.icon className="h-5 w-5" />
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: 'rgba(59,130,246,1)', color: 'white' }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};
