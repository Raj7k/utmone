import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatText } from "@/utils/textFormatter";

interface CTAButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  showArrow?: boolean;
  trustBadge?: string;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CTAButton = ({
  children,
  href,
  variant = "primary",
  showArrow = true,
  trustBadge,
  pulse = false,
  className = "",
  onClick,
}: CTAButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center gap-3"
    >
      <Link to={href} onClick={onClick} className="inline-block group relative">
        {pulse && (
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
        )}
        <Button
          variant={variant === "primary" ? "halo" : "outline"}
          size="lg"
          className={`relative text-base px-8 py-6 rounded-full font-medium lowercase ${className}`}
        >
          {typeof children === 'string' ? formatText(children) : children}
          {showArrow && (
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </Button>
      </Link>
      {trustBadge && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {formatText(trustBadge)}
        </motion.p>
      )}
    </motion.div>
  );
};
