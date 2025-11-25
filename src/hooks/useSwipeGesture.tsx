import { useGesture } from "@use-gesture/react";
import { useSpring } from "framer-motion";

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  disabled = false,
}: SwipeGestureConfig) => {
  const x = useSpring(0, { stiffness: 500, damping: 30 });

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], velocity: [vx], last, cancel }) => {
        if (disabled) return;

        if (last) {
          const absX = Math.abs(mx);
          const shouldTrigger = absX > threshold || Math.abs(vx) > 0.5;

          if (shouldTrigger) {
            if (mx > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (mx < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          }
          x.set(0);
        } else {
          x.set(mx);
        }
      },
    },
    {
      drag: {
        axis: "x",
        filterTaps: true,
      },
    }
  );

  return { bind, x };
};
