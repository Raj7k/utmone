import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react';

// Re-export motion for components that still need it
export { motion, AnimatePresence };

/**
 * CSS-Only Animated Components
 * These replace framer-motion for critical path components
 */

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'fade-slide-up';
  delay?: number;
  duration?: number;
  show?: boolean;
  onClick?: () => void;
}

/**
 * CSS-only animated div - replaces motion.div for simple animations
 */
export const AnimatedDiv: React.FC<AnimatedDivProps> = ({
  children,
  className = '',
  style = {},
  animation = 'fade-in',
  delay = 0,
  duration,
  show = true,
  onClick,
}) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  if (!shouldRender) return null;

  const animationStyle: CSSProperties = {
    ...style,
    animationDelay: delay ? `${delay}ms` : undefined,
    animationDuration: duration ? `${duration}ms` : undefined,
  };

  return (
    <div
      className={`animate-${animation} ${className}`}
      style={animationStyle}
      onClick={onClick}
      onAnimationEnd={() => {
        if (!show) setShouldRender(false);
      }}
    >
      {children}
    </div>
  );
};

interface CSSAnimatePresenceProps {
  children: ReactNode;
  show: boolean;
  animation?: 'fade' | 'slide-up' | 'scale';
  className?: string;
}

/**
 * CSS-only presence animation - replaces AnimatePresence
 * Handles enter/exit animations without framer-motion
 */
export const CSSAnimatePresence: React.FC<CSSAnimatePresenceProps> = ({
  children,
  show,
  animation = 'fade',
  className = '',
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
    }
  }, [show, shouldRender]);

  if (!shouldRender) return null;

  const enterClass = {
    fade: 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    scale: 'animate-scale-in',
  }[animation];

  const exitClass = {
    fade: 'animate-fade-out',
    'slide-up': 'animate-fade-out',
    scale: 'animate-scale-out',
  }[animation];

  return (
    <div
      className={`${isExiting ? exitClass : enterClass} ${className}`}
      onAnimationEnd={() => {
        if (isExiting) {
          setShouldRender(false);
          setIsExiting(false);
        }
      }}
    >
      {children}
    </div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Container that applies staggered delays to children
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 100,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child as React.ReactElement<{ style?: CSSProperties }>, {
          style: {
            ...(child.props.style || {}),
            animationDelay: `${index * staggerDelay}ms`,
          },
        });
      })}
    </div>
  );
};

/**
 * Hook to trigger animation on mount or when triggered
 */
export const useAnimationTrigger = (initialState = false) => {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const trigger = () => setIsAnimating(true);
  const reset = () => setIsAnimating(false);
  
  return { isAnimating, trigger, reset };
};

/**
 * Hook to detect when element is in viewport
 */
export const useIntersectionAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
