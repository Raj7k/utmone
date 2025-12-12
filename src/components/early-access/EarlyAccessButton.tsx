import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts/ModalContext";
import { ArrowRight } from "lucide-react";

interface EarlyAccessButtonProps {
  children?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "marketing" | "glow-pink" | "system" | "halo" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showArrow?: boolean;
}

export const EarlyAccessButton = ({
  children,
  variant = "marketing",
  size = "lg",
  className = "",
  showArrow = true,
}: EarlyAccessButtonProps) => {
  const { openEarlyAccessModal } = useModal();

  return (
    <Button
      onClick={() => openEarlyAccessModal()}
      variant={variant}
      size={size}
      className={className}
    >
      {children || "get early access"}
      {showArrow && <ArrowRight className="w-4 h-4 ml-2" />}
    </Button>
  );
};
