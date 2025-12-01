/**
 * Statistical Power Analysis for A/B Testing
 * Based on "Algorithms for Optimization" book principles
 */

/**
 * Calculate required sample size for A/B test
 * @param baselineRate - Current conversion rate (e.g., 0.05 for 5%)
 * @param minDetectableEffect - Minimum effect to detect (e.g., 0.2 for 20% relative improvement)
 * @param alpha - Significance level (default 0.05 for 95% confidence)
 * @param power - Statistical power (default 0.8 for 80% power)
 */
export function calculateRequiredSampleSize(
  baselineRate: number,
  minDetectableEffect: number,
  alpha: number = 0.05,
  power: number = 0.8
): number {
  // Z-scores for alpha and power
  const zAlpha = normalQuantile(1 - alpha / 2);
  const zBeta = normalQuantile(power);
  
  // Expected conversion rates
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minDetectableEffect);
  
  // Pooled standard deviation
  const pBar = (p1 + p2) / 2;
  const sd = Math.sqrt(2 * pBar * (1 - pBar));
  
  // Effect size
  const delta = p2 - p1;
  
  // Sample size per variant
  const n = Math.pow((zAlpha + zBeta) * sd / delta, 2);
  
  return Math.ceil(n);
}

/**
 * Calculate effect size (Cohen's h)
 */
export function calculateEffectSize(rate1: number, rate2: number): number {
  const phi1 = 2 * Math.asin(Math.sqrt(rate1));
  const phi2 = 2 * Math.asin(Math.sqrt(rate2));
  return Math.abs(phi2 - phi1);
}

/**
 * Calculate statistical significance using Z-test
 */
export function calculateSignificance(
  variant1: { clicks: number; conversions: number },
  variant2: { clicks: number; conversions: number }
): {
  pValue: number;
  isSignificant: boolean;
  zScore: number;
  confidenceInterval: [number, number];
} {
  const p1 = variant1.conversions / variant1.clicks;
  const p2 = variant2.conversions / variant2.clicks;
  
  // Pooled proportion
  const pPool = (variant1.conversions + variant2.conversions) / 
                (variant1.clicks + variant2.clicks);
  
  // Standard error
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / variant1.clicks + 1 / variant2.clicks));
  
  // Z-score
  const zScore = (p2 - p1) / se;
  
  // Two-tailed p-value
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  // 95% confidence interval for difference
  const diff = p2 - p1;
  const seDiff = Math.sqrt(
    (p1 * (1 - p1) / variant1.clicks) + 
    (p2 * (1 - p2) / variant2.clicks)
  );
  const margin = 1.96 * seDiff;
  
  return {
    pValue,
    isSignificant: pValue < 0.05,
    zScore,
    confidenceInterval: [diff - margin, diff + margin]
  };
}

/**
 * Calculate confidence interval for conversion rate
 */
export function calculateConfidenceInterval(
  conversions: number,
  clicks: number,
  confidence: number = 0.95
): [number, number] {
  if (clicks === 0) return [0, 0];
  
  const rate = conversions / clicks;
  const z = normalQuantile((1 + confidence) / 2);
  const se = Math.sqrt((rate * (1 - rate)) / clicks);
  
  return [
    Math.max(0, rate - z * se),
    Math.min(1, rate + z * se)
  ];
}

/**
 * Calculate minimum runtime based on traffic
 */
export function calculateMinRuntime(
  requiredSampleSize: number,
  dailyTraffic: number,
  numVariants: number = 2
): {
  days: number;
  samplesPerVariant: number;
  totalSamples: number;
} {
  const samplesPerVariant = requiredSampleSize;
  const totalSamples = samplesPerVariant * numVariants;
  const days = Math.ceil(totalSamples / dailyTraffic);
  
  return {
    days,
    samplesPerVariant,
    totalSamples
  };
}

/**
 * Calculate current test progress
 */
export function calculateTestProgress(
  currentSamples: number,
  requiredSamples: number
): {
  progress: number;
  samplesRemaining: number;
  isComplete: boolean;
} {
  const progress = Math.min(1, currentSamples / requiredSamples);
  const samplesRemaining = Math.max(0, requiredSamples - currentSamples);
  
  return {
    progress,
    samplesRemaining,
    isComplete: progress >= 1
  };
}

// Normal distribution CDF
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return x > 0 ? 1 - prob : prob;
}

// Normal distribution quantile
function normalQuantile(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833];
  
  const y = p - 0.5;
  
  if (Math.abs(y) < 0.42) {
    const r = y * y;
    let x = y * (((a[3] * r + a[2]) * r + a[1]) * r + a[0]);
    x /= ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
    return x;
  }
  
  let r = p;
  if (y > 0) r = 1 - p;
  r = Math.log(-Math.log(r));
  
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
             0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
             0.0000321767881768, 0.0000002888167364, 0.0000003960315187];
  
  let x = c[0];
  for (let i = 1; i < c.length; i++) {
    x += c[i] * Math.pow(r, i);
  }
  
  return y < 0 ? -x : x;
}
