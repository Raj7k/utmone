/**
 * Bayesian Optimization for A/B Testing
 * Based on "Algorithms for Optimization" book principles
 */

// Beta distribution parameters
interface BetaParams {
  alpha: number;
  beta: number;
}

// Calculate Beta distribution sample using Box-Muller transform
function sampleBeta(alpha: number, beta: number): number {
  // Using Gamma distribution approximation for Beta sampling
  const gamma1 = sampleGamma(alpha, 1);
  const gamma2 = sampleGamma(beta, 1);
  return gamma1 / (gamma1 + gamma2);
}

// Gamma distribution sampling
function sampleGamma(shape: number, scale: number): number {
  if (shape < 1) {
    return sampleGamma(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x, v;
    do {
      x = randomNormal();
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * x * x * x * x) {
      return d * v * scale;
    }
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v * scale;
    }
  }
}

// Box-Muller transform for normal distribution
function randomNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Thompson Sampling for dynamic traffic allocation
 * Samples from posterior Beta distribution to decide variant
 */
export function thompsonSampling(variants: { clicks: number; conversions: number }[]): number {
  const samples = variants.map(v => {
    // Beta(alpha, beta) with alpha = conversions + 1, beta = failures + 1
    const alpha = v.conversions + 1;
    const beta = v.clicks - v.conversions + 1;
    return sampleBeta(alpha, beta);
  });
  
  // Return index of variant with highest sample
  return samples.indexOf(Math.max(...samples));
}

/**
 * Calculate win probability using Beta distribution
 * Returns probability that variant A beats variant B
 */
export function calculateWinProbability(
  variantA: { clicks: number; conversions: number },
  variantB: { clicks: number; conversions: number },
  numSamples: number = 10000
): number {
  let winsA = 0;
  
  for (let i = 0; i < numSamples; i++) {
    const sampleA = sampleBeta(variantA.conversions + 1, variantA.clicks - variantA.conversions + 1);
    const sampleB = sampleBeta(variantB.conversions + 1, variantB.clicks - variantB.conversions + 1);
    
    if (sampleA > sampleB) winsA++;
  }
  
  return winsA / numSamples;
}

/**
 * Expected Improvement (EI) for early stopping
 * Returns whether test should stop based on EI threshold
 */
export function shouldStopTest(
  variants: { clicks: number; conversions: number }[],
  threshold: number = 0.95
): { shouldStop: boolean; winnerIndex: number; confidence: number } {
  if (variants.length !== 2) {
    return { shouldStop: false, winnerIndex: -1, confidence: 0 };
  }
  
  const winProb = calculateWinProbability(variants[0], variants[1]);
  const loseProb = 1 - winProb;
  
  if (winProb >= threshold) {
    return { shouldStop: true, winnerIndex: 0, confidence: winProb };
  }
  
  if (loseProb >= threshold) {
    return { shouldStop: true, winnerIndex: 1, confidence: loseProb };
  }
  
  return { shouldStop: false, winnerIndex: -1, confidence: Math.max(winProb, loseProb) };
}

/**
 * Calculate Upper Confidence Bound (UCB) for multi-armed bandit
 */
export function calculateUCB(
  conversions: number,
  clicks: number,
  totalClicks: number,
  exploration: number = 2
): number {
  if (clicks === 0) return Infinity;
  
  const conversionRate = conversions / clicks;
  const explorationTerm = Math.sqrt((exploration * Math.log(totalClicks)) / clicks);
  
  return conversionRate + explorationTerm;
}

/**
 * Calculate posterior distribution statistics
 */
export function getPosteriorStats(clicks: number, conversions: number): {
  mean: number;
  mode: number;
  variance: number;
  confidenceInterval: [number, number];
} {
  const alpha = conversions + 1;
  const beta = clicks - conversions + 1;
  
  const mean = alpha / (alpha + beta);
  const mode = alpha > 1 && beta > 1 ? (alpha - 1) / (alpha + beta - 2) : mean;
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
  
  // 95% credible interval using Beta distribution quantiles
  const confidenceInterval: [number, number] = [
    betaQuantile(0.025, alpha, beta),
    betaQuantile(0.975, alpha, beta)
  ];
  
  return { mean, mode, variance, confidenceInterval };
}

// Beta distribution quantile function (approximation)
function betaQuantile(p: number, alpha: number, beta: number): number {
  // Using normal approximation for simplicity
  const mean = alpha / (alpha + beta);
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
  const z = normalQuantile(p);
  
  return Math.max(0, Math.min(1, mean + z * Math.sqrt(variance)));
}

// Normal distribution quantile (approximation)
function normalQuantile(p: number): number {
  // Beasley-Springer-Moro approximation
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
             0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
             0.0000321767881768, 0.0000002888167364, 0.0000003960315187];
  
  if (p <= 0 || p >= 1) return 0;
  
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
  
  let x = c[0];
  for (let i = 1; i < c.length; i++) {
    x += c[i] * Math.pow(r, i);
  }
  
  return y < 0 ? -x : x;
}
