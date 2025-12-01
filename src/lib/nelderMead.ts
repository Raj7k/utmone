/**
 * Nelder-Mead Simplex Optimization Algorithm
 * From "Algorithms for Optimization" Chapter 7
 * 
 * Gradient-free optimization for finding optimal QR code styles
 */

export interface NelderMeadOptions {
  maxIterations?: number;
  tolerance?: number;
  alpha?: number; // Reflection coefficient
  beta?: number;  // Expansion coefficient
  gamma?: number; // Contraction coefficient
  delta?: number; // Shrink coefficient
}

export interface OptimizationResult {
  bestPoint: number[];
  bestValue: number;
  iterations: number;
  converged: boolean;
}

/**
 * Nelder-Mead simplex optimization algorithm
 * Finds minimum of objective function without using gradients
 */
export function nelderMead(
  objectiveFunction: (x: number[]) => number,
  initialSimplex: number[][],
  options: NelderMeadOptions = {}
): OptimizationResult {
  const {
    maxIterations = 1000,
    tolerance = 1e-6,
    alpha = 1.0,  // Reflection
    beta = 2.0,   // Expansion
    gamma = 0.5,  // Contraction
    delta = 0.5   // Shrink
  } = options;

  // Initialize simplex
  let simplex = initialSimplex.map(point => ({
    point: [...point],
    value: objectiveFunction(point)
  }));

  let iterations = 0;

  while (iterations < maxIterations) {
    // Sort simplex by objective value (ascending for minimization)
    simplex.sort((a, b) => a.value - b.value);

    const best = simplex[0];
    const worst = simplex[simplex.length - 1];
    const secondWorst = simplex[simplex.length - 2];

    // Check convergence
    const range = worst.value - best.value;
    if (range < tolerance) {
      return {
        bestPoint: best.point,
        bestValue: best.value,
        iterations,
        converged: true
      };
    }

    // Calculate centroid (excluding worst point)
    const centroid = calculateCentroid(
      simplex.slice(0, -1).map(s => s.point)
    );

    // Reflection
    const reflected = reflect(worst.point, centroid, alpha);
    const reflectedValue = objectiveFunction(reflected);

    if (reflectedValue < secondWorst.value && reflectedValue >= best.value) {
      // Accept reflection
      simplex[simplex.length - 1] = { point: reflected, value: reflectedValue };
    } else if (reflectedValue < best.value) {
      // Try expansion
      const expanded = reflect(worst.point, centroid, beta);
      const expandedValue = objectiveFunction(expanded);

      if (expandedValue < reflectedValue) {
        simplex[simplex.length - 1] = { point: expanded, value: expandedValue };
      } else {
        simplex[simplex.length - 1] = { point: reflected, value: reflectedValue };
      }
    } else {
      // Contraction
      const contracted = reflect(worst.point, centroid, -gamma);
      const contractedValue = objectiveFunction(contracted);

      if (contractedValue < worst.value) {
        simplex[simplex.length - 1] = { point: contracted, value: contractedValue };
      } else {
        // Shrink entire simplex toward best point
        simplex = simplex.map((s, i) => {
          if (i === 0) return s; // Keep best point
          const shrunk = s.point.map((val, j) => 
            best.point[j] + delta * (val - best.point[j])
          );
          return { point: shrunk, value: objectiveFunction(shrunk) };
        });
      }
    }

    iterations++;
  }

  // Max iterations reached
  simplex.sort((a, b) => a.value - b.value);
  return {
    bestPoint: simplex[0].point,
    bestValue: simplex[0].value,
    iterations,
    converged: false
  };
}

/**
 * Calculate centroid of points
 */
function calculateCentroid(points: number[][]): number[] {
  const n = points.length;
  const dim = points[0].length;
  const centroid = new Array(dim).fill(0);

  for (const point of points) {
    for (let i = 0; i < dim; i++) {
      centroid[i] += point[i] / n;
    }
  }

  return centroid;
}

/**
 * Reflect point through centroid
 * reflected = centroid + coeff * (centroid - point)
 */
function reflect(point: number[], centroid: number[], coeff: number): number[] {
  return point.map((val, i) => 
    centroid[i] + coeff * (centroid[i] - val)
  );
}

/**
 * Generate initial simplex for n-dimensional optimization
 */
export function generateInitialSimplex(
  startPoint: number[],
  stepSize: number = 0.1
): number[][] {
  const n = startPoint.length;
  const simplex: number[][] = [startPoint];

  // Create n additional points by perturbing each dimension
  for (let i = 0; i < n; i++) {
    const point = [...startPoint];
    point[i] += stepSize;
    simplex.push(point);
  }

  return simplex;
}

/**
 * RGB color space optimization helpers
 */
export function rgbToVector(rgb: string): number[] {
  // Parse hex color to RGB vector [0-255, 0-255, 0-255]
  const hex = rgb.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16)
  ];
}

export function vectorToRgb(vector: number[]): string {
  // Clamp values to [0, 255] and convert to hex
  const [r, g, b] = vector.map(v => Math.max(0, Math.min(255, Math.round(v))));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
