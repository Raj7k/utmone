import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkspaceSwitcher } from "@/components/navigation/WorkspaceSwitcher";
import { supabase } from "@/integrations/supabase/client";

interface MobileHeaderProps {
  title: string;
  userEmail?: string;
  rightAction?: React.ReactNode;
}

export const MobileHeader = ({ title, userEmail, rightAction }: MobileHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="h-14 border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-50 md:hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-10 w-10"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <h1 className="text-lg font-semibold text-label">{title}</h1>
            
            <div className="w-10">
              {rightAction}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 bg-system-background border-b border-separator z-40 md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-secondary-label">Workspace</span>
                <WorkspaceSwitcher />
              </div>
              
              {userEmail && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-secondary-label">Account</span>
                  <span className="text-sm text-label">{userEmail}</span>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
