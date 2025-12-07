import { getActivePromotions } from '@/lib/discountConfig';
import { Tag } from 'lucide-react';

export const PromoBanner = () => {
  const activePromos = getActivePromotions();
  
  if (activePromos.length === 0) return null;
  
  const promo = activePromos[0];
  
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
          <Tag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {promo.badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {promo.badge}
              </span>
            )}
            <span className="text-sm font-medium text-foreground">{promo.name}</span>
          </div>
          {promo.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{promo.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">use code:</span>
        <code className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-mono font-semibold text-foreground">
          {promo.code}
        </code>
      </div>
    </div>
  );
};
