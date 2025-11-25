import { motion } from "framer-motion";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Trash2, Archive, Copy, Check } from "lucide-react";
import { ReactNode } from "react";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon?: ReactNode;
    label?: string;
    color?: string;
  };
  rightAction?: {
    icon?: ReactNode;
    label?: string;
    color?: string;
  };
  disabled?: boolean;
}

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = {
    icon: <Trash2 className="h-5 w-5" />,
    label: "Delete",
    color: "bg-system-red",
  },
  rightAction = {
    icon: <Copy className="h-5 w-5" />,
    label: "Copy",
    color: "bg-system-blue",
  },
  disabled = false,
}: SwipeableCardProps) => {
  const { bind, x } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    threshold: 80,
    disabled,
  });

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between">
        {/* Right swipe action (shows on left) */}
        {onSwipeRight && (
          <div className={`${rightAction.color} h-full w-24 flex flex-col items-center justify-center text-white`}>
            {rightAction.icon}
            <span className="text-xs mt-1">{rightAction.label}</span>
          </div>
        )}
        
        {/* Left swipe action (shows on right) */}
        {onSwipeLeft && (
          <div className={`${leftAction.color} h-full w-24 flex flex-col items-center justify-center text-white ml-auto`}>
            {leftAction.icon}
            <span className="text-xs mt-1">{leftAction.label}</span>
          </div>
        )}
      </div>

      {/* Card content */}
      <motion.div
        style={{ x }}
        className="relative bg-system-background touch-pan-y"
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          const absX = Math.abs(info.offset.x);
          if (absX > 80) {
            if (info.offset.x > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (info.offset.x < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
