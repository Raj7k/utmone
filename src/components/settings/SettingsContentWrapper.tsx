import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsContentWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const SettingsContentWrapper = ({
  title,
  description,
  children,
  className,
}: SettingsContentWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
};
