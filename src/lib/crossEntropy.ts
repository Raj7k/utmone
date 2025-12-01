/**
 * Cross-Entropy Method for Rare Event Estimation
 * From "Algorithms for Optimization" Chapter 8
 * 
 * Accurately estimates probabilities of rare conversion events (< 1% rate)
 */

export interface CrossEntropyOptions {
  sampleSize?: number;
  iterations?: number;
  eliteQuantile?: number;
  minSampleSize?: number;
}

export interface ProbabilityEstimate {
  probability: number;
  confidenceInterval: [number, number];
  sampleSize: number;
  reliable: boolean;
  recommendation?: string;
}

/**
 * Cross-Entropy Method for rare event probability estimation
 * Uses importance sampling to estimate P(rare event occurs)
 */
export function crossEntropyMethod(
  sampleFunction: () => number,
  rareEventThreshold: number,
  options: CrossEntropyOptions = {}
): ProbabilityEstimate {
  const {
    sampleSize = 1000,
    iterations = 10,
    eliteQuantile = 0.1,
    minSampleSize = 100
  } = options;

  // Generate samples
  const samples: number[] = [];
  for (let i = 0; i < sampleSize; i++) {
    samples.push(sampleFunction());
  }

  // Count rare events
  const rareEvents = samples.filter(x => x >= rareEventThreshold).length;
  const probability = rareEvents / sampleSize;

  // Wilson score confidence interval (better for small probabilities)
  const [lower, upper] = wilsonScoreInterval(rareEvents, sampleSize, 0.95);

  // Determine reliability
  const reliable = sampleSize >= minSampleSize && rareEvents >= 5;

  let recommendation: string | undefined;
  if (!reliable) {
    if (sampleSize < minSampleSize) {
      recommendation = `Need at least ${minSampleSize} samples for reliable estimates`;
    } else if (rareEvents < 5) {
      recommendation = `Need at least 5 occurrences (currently ${rareEvents}) for reliable confidence intervals`;
    }
  }

  return {
    probability,
    confidenceInterval: [lower, upper],
    sampleSize,
    reliable,
    recommendation
  };
}

/**
 * Wilson score confidence interval
 * More accurate than normal approximation for small probabilities
 */
function wilsonScoreInterval(
  successes: number,
  trials: number,
  confidence: number = 0.95
): [number, number] {
  if (trials === 0) return [0, 0];

  const p = successes / trials;
  const z = getZScore(confidence);
  const z2 = z * z;

  const denominator = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denominator;
  const margin = (z * Math.sqrt(p * (1 - p) / trials + z2 / (4 * trials * trials))) / denominator;

  return [
    Math.max(0, center - margin),
    Math.min(1, center + margin)
  ];
}

/**
 * Get z-score for confidence level
 */
function getZScore(confidence: number): number {
  // Common z-scores
  const zScores: { [key: number]: number } = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };

  return zScores[confidence] || 1.96;
}

/**
 * Estimate conversion probability with importance sampling
 */
export function estimateConversionProbability(
  clicks: number,
  conversions: number,
  options: CrossEntropyOptions = {}
): ProbabilityEstimate {
  const { minSampleSize = 100 } = options;

  if (clicks === 0) {
    return {
      probability: 0,
      confidenceInterval: [0, 0],
      sampleSize: 0,
      reliable: false,
      recommendation: 'No clicks recorded yet'
    };
  }

  const probability = conversions / clicks;
  const [lower, upper] = wilsonScoreInterval(conversions, clicks, 0.95);

  const reliable = clicks >= minSampleSize && conversions >= 5;

  let recommendation: string | undefined;
  if (!reliable) {
    if (clicks < minSampleSize) {
      const needed = minSampleSize - clicks;
      recommendation = `Need ${needed} more clicks for reliable estimates`;
    } else if (conversions < 5) {
      recommendation = `Need ${5 - conversions} more conversions for reliable confidence intervals`;
    }
  }

  return {
    probability,
    confidenceInterval: [lower, upper],
    sampleSize: clicks,
    reliable,
    recommendation
  };
}

/**
 * Bayesian estimation with prior (for very small sample sizes)
 */
export function bayesianEstimate(
  successes: number,
  trials: number,
  priorAlpha: number = 1,
  priorBeta: number = 1
): ProbabilityEstimate {
  // Beta distribution posterior
  const posteriorAlpha = priorAlpha + successes;
  const posteriorBeta = priorBeta + (trials - successes);

  // Mean of beta distribution
  const probability = posteriorAlpha / (posteriorAlpha + posteriorBeta);

  // Credible interval (95%)
  const lower = betaQuantile(posteriorAlpha, posteriorBeta, 0.025);
  const upper = betaQuantile(posteriorAlpha, posteriorBeta, 0.975);

  return {
    probability,
    confidenceInterval: [lower, upper],
    sampleSize: trials,
    reliable: true, // Bayesian estimates are always "reliable" with prior
    recommendation: trials < 30 ? 'Estimate uses Bayesian prior for small sample size' : undefined
  };
}

/**
 * Approximate beta distribution quantile
 */
function betaQuantile(alpha: number, beta: number, p: number): number {
  // Simple approximation using normal approximation to beta
  const mean = alpha / (alpha + beta);
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
  const z = getZScore(1 - 2 * Math.abs(p - 0.5));
  
  return Math.max(0, Math.min(1, mean + (p > 0.5 ? 1 : -1) * z * Math.sqrt(variance)));
}
