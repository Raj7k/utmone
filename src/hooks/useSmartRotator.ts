import { thompsonSampling } from "@/lib/bayesianOptimization";

export interface Destination {
  url: string;
  weight: number;
  clicks: number;
  conversions: number;
}

export interface SmartRotatorResult {
  selectedIndex: number;
  weights: number[];
  winnerIndex: number;
  confidence: number;
  isLearning: boolean;
}

/**
 * Calculate Thompson Sampling weights for multi-destination links
 * Uses Clean Track Intelligence™ optimization logic
 */
export function useSmartRotator(destinations: Destination[]): SmartRotatorResult {
  if (!destinations || destinations.length === 0) {
    return {
      selectedIndex: 0,
      weights: [],
      winnerIndex: -1,
      confidence: 0,
      isLearning: true,
    };
  }

  // Convert destinations to variant format for Thompson Sampling
  const variants = destinations.map((dest) => ({
    clicks: dest.clicks,
    conversions: dest.conversions,
  }));

  // Use Thompson Sampling to select best variant
  const selectedIndex = thompsonSampling(variants);

  // Calculate win probabilities using Thompson Sampling
  const weights = variants.map((_, index) => {
    let wins = 0;
    const samples = 10000;

    for (let i = 0; i < samples; i++) {
      const testIndex = thompsonSampling(variants);
      if (testIndex === index) wins++;
    }

    return (wins / samples) * 100;
  });

  // Determine winner (highest weight) and confidence
  const winnerIndex = weights.indexOf(Math.max(...weights));
  const confidence = weights[winnerIndex];

  // Is still learning if confidence < 70%
  const isLearning = confidence < 70;

  return {
    selectedIndex,
    weights,
    winnerIndex,
    confidence,
    isLearning,
  };
}
