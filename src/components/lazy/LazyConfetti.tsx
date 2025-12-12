import { lazy, Suspense } from "react";
import type { ComponentProps } from "react";

// Lazy load confetti libraries - these are heavy and rarely needed
const ReactConfetti = lazy(() => import("react-confetti"));

interface LazyConfettiProps extends ComponentProps<typeof ReactConfetti> {
  show?: boolean;
}

export const LazyConfetti = ({ show = true, ...props }: LazyConfettiProps) => {
  if (!show) return null;
  
  return (
    <Suspense fallback={null}>
      <ReactConfetti {...props} />
    </Suspense>
  );
};

// Canvas confetti trigger - lazy imported function
type ConfettiFunction = (options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  startVelocity?: number;
  ticks?: number;
  zIndex?: number;
}) => Promise<void>;

let confettiInstance: ConfettiFunction | null = null;

export const triggerConfetti = async (options?: Parameters<ConfettiFunction>[0]) => {
  if (!confettiInstance) {
    const module = await import("canvas-confetti");
    confettiInstance = module.default as unknown as ConfettiFunction;
  }
  return confettiInstance(options);
};

// Preset confetti effects
export const confettiPresets = {
  celebration: async () => {
    await triggerConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  },
  
  fireworks: async () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(async () => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      await triggerConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      await triggerConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  },
  
  success: async () => {
    await triggerConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10B981", "#34D399", "#6EE7B7"],
    });
  },
};
