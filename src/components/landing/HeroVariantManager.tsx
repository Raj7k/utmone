import { useEffect, useState } from 'react';
import { HERO_VARIANTS, HeroVariant } from '@/lib/heroVariants';
import { getOrCreateSession } from '@/lib/sessionManager';

interface HeroVariantManagerProps {
  children: (variant: HeroVariant) => React.ReactNode;
}

export const HeroVariantManager = ({ children }: HeroVariantManagerProps) => {
  const [variant, setVariant] = useState<HeroVariant | null>(null);

  useEffect(() => {
    const { variant: variantId } = getOrCreateSession();
    const selectedVariant = HERO_VARIANTS[variantId];
    setVariant(selectedVariant);
  }, []);

  if (!variant) {
    // Return first variant as fallback during loading
    return <>{children(HERO_VARIANTS[0])}</>;
  }

  return <>{children(variant)}</>;
};
