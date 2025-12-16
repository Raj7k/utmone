import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Globe, 
  Target, 
  Smartphone, 
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const AutomaticAttributionHero: React.FC = () => {
  const automaticFeatures = [
    {
      icon: Globe,
      title: 'Every pageview',
      description: 'Tracked instantly, no extra code',
    },
    {
      icon: Target,
      title: 'UTM parameters',
      description: 'source, medium, campaign, term, content',
    },
    {
      icon: Smartphone,
      title: 'Cross-device matching',
      description: '75-95% accuracy without login',
      highlight: true,
    },
    {
      icon: Clock,
      title: 'Time-to-conversion',
      description: 'First touch → purchase journey',
    },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-primary/20">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">automatic attribution</h3>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
              NO CODE NEEDED
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            once you install the pixel, we automatically track everything below
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {automaticFeatures.map((feature) => (
          <div 
            key={feature.title}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              feature.highlight 
                ? 'bg-primary/10 border border-primary/20' 
                : 'bg-muted/50'
            }`}
          >
            <div className={`p-1.5 rounded-md ${feature.highlight ? 'bg-primary/20' : 'bg-muted'}`}>
              <feature.icon className={`h-4 w-4 ${feature.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key differentiator callout */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <Zap className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            our key difference: pre-login attribution
          </p>
          <p className="text-xs text-muted-foreground">
            unlike other tools that only track after login, we connect visitor journeys <strong>before</strong> they give you their email. 
            we use IP, location, and device signals to link the same person across devices with 75-95% accuracy.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AutomaticAttributionHero;
