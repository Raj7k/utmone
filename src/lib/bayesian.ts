/**
 * Bayesian A/B Testing Utilities
 * Based on Beta-Binomial Bayesian inference
 * 
 * Reference: Algorithms for Optimization, Chapter 21 (Monte Carlo Methods)
 */

/**
 * Sample from Beta distribution using Gamma distribution relationship
 * Beta(α, β) = Gamma(α) / (Gamma(α) + Gamma(β))
 */
function gammaRandom(alpha: number): number {
  // Simple approximation using Marsaglia and Tsang's method
  if (alpha < 1) {
    return gammaRandom(alpha + 1) * Math.pow(Math.random(), 1 / alpha);
  }

  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = randomNormal();
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = Math.random();
    const x2 = x * x;

    if (u < 1 - 0.0331 * x2 * x2) {
      return d * v;
    }

    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

/**
 * Box-Muller transform for normal distribution
 */
function randomNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Sample from Beta distribution Beta(α, β)
 */
function betaSample(alpha: number, beta: number): number {
  const x = gammaRandom(alpha);
  const y = gammaRandom(beta);
  return x / (x + y);
}

/**
 * Calculate probability that Variant B is better than Variant A
 * using Monte Carlo simulation with Beta distributions
 * 
 * @param clicksA - Total clicks for variant A
 * @param conversionsA - Conversions for variant A
 * @param clicksB - Total clicks for variant B
 * @param conversionsB - Conversions for variant B
 * @param simulations - Number of Monte Carlo samples (default: 10000)
 * @returns Probability that B > A (0 to 1)
 */
export function calculateProbabilityBWins(
  clicksA: number,
  conversionsA: number,
  clicksB: number,
  conversionsB: number,
  simulations: number = 10000
): number {
  // Prior: Beta(1, 1) = Uniform(0, 1)
  // Posterior: Beta(α + conversions, β + non-conversions)
  const alphaA = 1 + conversionsA;
  const betaA = 1 + (clicksA - conversionsA);
  const alphaB = 1 + conversionsB;
  const betaB = 1 + (clicksB - conversionsB);

  let bWinsCount = 0;

  // Monte Carlo simulation
  for (let i = 0; i < simulations; i++) {
    const sampleA = betaSample(alphaA, betaA);
    const sampleB = betaSample(alphaB, betaB);

    if (sampleB > sampleA) {
      bWinsCount++;
    }
  }

  return bWinsCount / simulations;
}

/**
 * Calculate expected loss if we choose the wrong variant
 * Used to determine when to stop the experiment
 */
export function calculateExpectedLoss(
  clicksA: number,
  conversionsA: number,
  clicksB: number,
  conversionsB: number,
  simulations: number = 10000
): { lossIfChooseA: number; lossIfChooseB: number } {
  const alphaA = 1 + conversionsA;
  const betaA = 1 + (clicksA - conversionsA);
  const alphaB = 1 + conversionsB;
  const betaB = 1 + (clicksB - conversionsB);

  let totalLossA = 0;
  let totalLossB = 0;

  for (let i = 0; i < simulations; i++) {
    const sampleA = betaSample(alphaA, betaA);
    const sampleB = betaSample(alphaB, betaB);

    // Loss if we choose A but B is better
    if (sampleB > sampleA) {
      totalLossA += sampleB - sampleA;
    }

    // Loss if we choose B but A is better
    if (sampleA > sampleB) {
      totalLossB += sampleA - sampleB;
    }
  }

  return {
    lossIfChooseA: totalLossA / simulations,
    lossIfChooseB: totalLossB / simulations,
  };
}

/**
 * Determine if experiment has reached statistical significance
 * Typically use 95% confidence threshold
 */
export function shouldDeclareWinner(
  probabilityBWins: number,
  confidenceThreshold: number = 0.95
): {
  shouldStop: boolean;
  winner: 'A' | 'B' | 'inconclusive';
  confidence: number;
} {
  if (probabilityBWins >= confidenceThreshold) {
    return {
      shouldStop: true,
      winner: 'B',
      confidence: probabilityBWins,
    };
  }

  if (probabilityBWins <= (1 - confidenceThreshold)) {
    return {
      shouldStop: true,
      winner: 'A',
      confidence: 1 - probabilityBWins,
    };
  }

  return {
    shouldStop: false,
    winner: 'inconclusive',
    confidence: Math.max(probabilityBWins, 1 - probabilityBWins),
  };
}

/**
 * Calculate conversion rate with credible interval
 */
export function calculateConversionRate(
  clicks: number,
  conversions: number,
  simulations: number = 10000
): {
  mean: number;
  lower: number;
  upper: number;
} {
  if (clicks === 0) {
    return { mean: 0, lower: 0, upper: 0 };
  }

  const alpha = 1 + conversions;
  const beta = 1 + (clicks - conversions);

  const samples: number[] = [];
  for (let i = 0; i < simulations; i++) {
    samples.push(betaSample(alpha, beta));
  }

  samples.sort((a, b) => a - b);

  return {
    mean: samples.reduce((a, b) => a + b, 0) / samples.length,
    lower: samples[Math.floor(simulations * 0.025)],
    upper: samples[Math.floor(simulations * 0.975)],
  };
}

/**
 * Calculate minimum sample size needed for experiment
 * Based on desired power and effect size
 */
export function calculateMinimumSampleSize(
  baselineRate: number,
  minimumDetectableEffect: number,
  alpha: number = 0.05,
  power: number = 0.80
): number {
  // Simplified formula for equal sample sizes
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minimumDetectableEffect);

  const pooled = (p1 + p2) / 2;
  const zAlpha = 1.96; // 95% confidence
  const zBeta = 0.84; // 80% power

  const numerator =
    Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);

  return Math.ceil(numerator / denominator);
}