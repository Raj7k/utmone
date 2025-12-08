import { useState, useCallback } from "react";

export const useNetworkRipple = () => {
  const [isRippleActive, setIsRippleActive] = useState(false);

  const triggerRipple = useCallback(() => {
    setIsRippleActive(true);
  }, []);

  const dismissRipple = useCallback(() => {
    setIsRippleActive(false);
  }, []);

  return {
    isRippleActive,
    triggerRipple,
    dismissRipple,
  };
};
