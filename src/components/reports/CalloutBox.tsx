import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutBoxProps {
  children: ReactNode;
  className?: string;
}

export const CalloutBox = ({ children, className }: CalloutBoxProps) => {
  return (
    <div
      className={cn(
        "my-8 p-6 bg-yellow-50 border-l-4 border-blazeOrange rounded-lg",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-base font-semibold text-foreground">{children}</div>
      </div>
    </div>
  );
};
