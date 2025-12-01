/**
 * Gaussian Process Regression Implementation
 * Based on "Algorithms for Optimization" Chapter 18
 * 
 * Implements GP with RBF kernel for time-series predictions with uncertainty quantification
 */

interface Matrix {
  data: number[][];
  rows: number;
  cols: number;
}

/**
 * Radial Basis Function (RBF) / Squared Exponential Kernel
 * From Chapter 18: k(x, x') = σ² * exp(-||x - x'||² / (2l²))
 */
export function rbfKernel(
  x1: number[],
  x2: number[],
  lengthScale: number,
  variance: number
): number {
  const squaredDist = x1.reduce((sum, val, i) => sum + Math.pow(val - x2[i], 2), 0);
  return variance * Math.exp(-squaredDist / (2 * lengthScale * lengthScale));
}

/**
 * Standard Normal PDF
 */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Standard Normal CDF (approximation)
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/**
 * Expected Improvement Acquisition Function
 * From Chapter 19: Exploration-exploitation balance
 */
export function expectedImprovement(mean: number, std: number, bestSoFar: number, xi: number = 0.01): number {
  if (std === 0) return 0;
  
  const z = (mean - bestSoFar - xi) / std;
  return std * (z * normalCDF(z) + normalPDF(z));
}

/**
 * Cholesky Decomposition for positive definite matrices
 * Used for efficient GP posterior computation
 */
function choleskyDecomposition(matrix: Matrix): Matrix | null {
  const n = matrix.rows;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }

      if (i === j) {
        const val = matrix.data[i][i] - sum;
        if (val <= 0) return null; // Not positive definite
        L[i][j] = Math.sqrt(val);
      } else {
        L[i][j] = (matrix.data[i][j] - sum) / L[j][j];
      }
    }
  }

  return { data: L, rows: n, cols: n };
}

/**
 * Solve Lx = b where L is lower triangular
 */
function forwardSubstitution(L: Matrix, b: number[]): number[] {
  const n = L.rows;
  const x: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L.data[i][j] * x[j];
    }
    x[i] = (b[i] - sum) / L.data[i][i];
  }

  return x;
}

/**
 * Solve L^T x = b where L is lower triangular
 */
function backwardSubstitution(L: Matrix, b: number[]): number[] {
  const n = L.rows;
  const x: number[] = Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += L.data[j][i] * x[j];
    }
    x[i] = (b[i] - sum) / L.data[i][i];
  }

  return x;
}

export interface GPPrediction {
  mean: number;
  variance: number;
  std: number;
  confidenceInterval: { lower: number; upper: number };
  expectedImprovement: number;
}

export interface TimeSlot {
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  clicks: number;
}

/**
 * Gaussian Process Regression Model
 * From "Algorithms for Optimization" Chapter 18
 */
export class GaussianProcess {
  private lengthScale: number;
  private variance: number;
  private noise: number;
  private X: number[][] = [];
  private y: number[] = [];
  private K_inv: number[][] | null = null;
  private alpha: number[] | null = null;
  private bestObserved: number = 0;

  constructor(lengthScale: number = 3.0, variance: number = 1.0, noise: number = 0.1) {
    this.lengthScale = lengthScale;
    this.variance = variance;
    this.noise = noise;
  }

  /**
   * Fit GP to training data
   * Chapter 18: Posterior = Prior conditioned on observations
   */
  fit(timeSlots: TimeSlot[]): void {
    this.X = timeSlots.map(slot => [slot.dayOfWeek, slot.hourOfDay]);
    this.y = timeSlots.map(slot => slot.clicks);
    this.bestObserved = Math.max(...this.y);

    const n = this.X.length;

    // Build kernel matrix K + noise * I
    const K_data: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        K_data[i][j] = rbfKernel(this.X[i], this.X[j], this.lengthScale, this.variance);
        if (i === j) K_data[i][j] += this.noise; // Add noise to diagonal
      }
    }

    const K: Matrix = { data: K_data, rows: n, cols: n };

    // Cholesky decomposition: K = L L^T
    const L = choleskyDecomposition(K);
    if (!L) {
      console.warn('Cholesky decomposition failed, adding jitter');
      // Add jitter and retry
      for (let i = 0; i < n; i++) {
        K_data[i][i] += 1e-6;
      }
      const L_retry = choleskyDecomposition(K);
      if (!L_retry) {
        throw new Error('GP fit failed: kernel matrix not positive definite');
      }
      this.alpha = backwardSubstitution(L_retry, forwardSubstitution(L_retry, this.y));
    } else {
      // Solve K * alpha = y efficiently using Cholesky
      this.alpha = backwardSubstitution(L, forwardSubstitution(L, this.y));
    }

    // Store K_inv for predictions (could be optimized)
    this.K_inv = this.invertMatrix(K_data);
  }

  /**
   * Predict mean and variance for new time slots
   * Chapter 18: μ(x*) = k(x*, X)^T K^-1 y
   *             σ²(x*) = k(x*,x*) - k(x*, X)^T K^-1 k(x*, X)
   */
  predict(dayOfWeek: number, hourOfDay: number): GPPrediction {
    if (!this.alpha || !this.K_inv) {
      throw new Error('Model not fitted. Call fit() first.');
    }

    const x_new = [dayOfWeek, hourOfDay];

    // Compute k(x*, X)
    const k_star = this.X.map(x => rbfKernel(x_new, x, this.lengthScale, this.variance));

    // Mean: k(x*, X)^T * alpha
    const mean = k_star.reduce((sum, k, i) => sum + k * this.alpha![i], 0);

    // Variance: k(x*,x*) - k(x*, X)^T K^-1 k(x*, X)
    const k_star_star = rbfKernel(x_new, x_new, this.lengthScale, this.variance);
    let variance = k_star_star;
    for (let i = 0; i < k_star.length; i++) {
      for (let j = 0; j < k_star.length; j++) {
        variance -= k_star[i] * this.K_inv[i][j] * k_star[j];
      }
    }

    // Ensure non-negative variance
    variance = Math.max(variance, 1e-8);
    const std = Math.sqrt(variance);

    // 95% confidence interval
    const confidenceInterval = {
      lower: mean - 1.96 * std,
      upper: mean + 1.96 * std,
    };

    // Expected Improvement for exploration
    const ei = expectedImprovement(mean, std, this.bestObserved);

    return {
      mean,
      variance,
      std,
      confidenceInterval,
      expectedImprovement: ei,
    };
  }

  /**
   * Matrix inversion using Gauss-Jordan elimination
   * (Simplified - production use would use LU decomposition)
   */
  private invertMatrix(A: number[][]): number[][] {
    const n = A.length;
    const AI: number[][] = A.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))]);

    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(AI[k][i]) > Math.abs(AI[maxRow][i])) {
          maxRow = k;
        }
      }
      [AI[i], AI[maxRow]] = [AI[maxRow], AI[i]];

      // Make diagonal 1
      const divisor = AI[i][i];
      for (let j = 0; j < 2 * n; j++) {
        AI[i][j] /= divisor;
      }

      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = AI[k][i];
          for (let j = 0; j < 2 * n; j++) {
            AI[k][j] -= factor * AI[i][j];
          }
        }
      }
    }

    return AI.map(row => row.slice(n));
  }

  /**
   * Get confidence interval for predictions
   */
  getConfidenceInterval(mean: number, variance: number, confidence: number = 0.95): { lower: number; upper: number } {
    const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
    const std = Math.sqrt(variance);
    return {
      lower: mean - z * std,
      upper: mean + z * std,
    };
  }
}
