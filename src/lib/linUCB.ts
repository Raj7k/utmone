/**
 * Linear Upper Confidence Bound (LinUCB) Algorithm
 * Used for contextual bandit routing in multi-destination links
 * 
 * Reference: "A Contextual-Bandit Approach to Personalized News Article Recommendation"
 */

export interface ContextVector {
  is_mobile: number;  // 1 if mobile, 0 if desktop
  is_ios: number;     // 1 if iOS, 0 otherwise
  is_us: number;      // 1 if US, 0 otherwise
}

export interface BanditState {
  destination_index: number;
  context_key: string;
  a_matrix: number[][]; // A = D^T D + I (identity)
  b_vector: number[];   // b = D^T c (context-reward)
  impressions: number;
  conversions: number;
}

export interface DestinationScore {
  destination_index: number;
  score: number;
  ucb: number;
  exploitation: number;
  exploration: number;
}

/**
 * Generate context key from context vector
 */
export function getContextKey(context: ContextVector): string {
  const device = context.is_mobile ? 'mobile' : 'desktop';
  const os = context.is_ios ? 'ios' : 'other';
  const country = context.is_us ? 'us' : 'other';
  return `${device}_${os}_${country}`;
}

/**
 * Parse User-Agent and Cloudflare headers to extract context
 */
export function extractContext(userAgent: string, cfCountry?: string): ContextVector {
  const ua = userAgent.toLowerCase();
  
  return {
    is_mobile: /mobile|android|iphone|ipad|ipod|windows phone/i.test(ua) ? 1 : 0,
    is_ios: /iphone|ipad|ipod/i.test(ua) ? 1 : 0,
    is_us: cfCountry?.toUpperCase() === 'US' ? 1 : 0,
  };
}

/**
 * Convert context vector to array [is_mobile, is_ios, is_us]
 */
export function contextToArray(context: ContextVector): number[] {
  return [context.is_mobile, context.is_ios, context.is_us];
}

/**
 * Matrix-vector multiplication: A * x
 */
function matrixVectorMultiply(A: number[][], x: number[]): number[] {
  return A.map(row => 
    row.reduce((sum, val, i) => sum + val * x[i], 0)
  );
}

/**
 * Vector dot product: x · y
 */
function dotProduct(x: number[], y: number[]): number {
  return x.reduce((sum, val, i) => sum + val * y[i], 0);
}

/**
 * Matrix inversion using Gauss-Jordan elimination (3x3 matrix only)
 */
function invertMatrix3x3(A: number[][]): number[][] {
  const n = 3;
  const augmented: number[][] = A.map((row, i) => 
    [...row, ...[0, 0, 0].map((_, j) => i === j ? 1 : 0)]
  );

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Make diagonal 1
    const divisor = augmented[i][i];
    if (Math.abs(divisor) < 1e-10) {
      // Singular matrix, return identity
      return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor;
    }

    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }

  // Extract inverse from augmented matrix
  return augmented.map(row => row.slice(n));
}

/**
 * Calculate LinUCB score for a destination given context
 * Score = θ^T x + α * sqrt(x^T A^(-1) x)
 * where θ = A^(-1) b
 */
export function calculateLinUCBScore(
  state: BanditState,
  context: ContextVector,
  alpha: number = 1.0
): DestinationScore {
  const x = contextToArray(context);
  
  // Calculate θ = A^(-1) * b
  const A_inv = invertMatrix3x3(state.a_matrix);
  const theta = matrixVectorMultiply(A_inv, state.b_vector);
  
  // Exploitation term: θ^T x
  const exploitation = dotProduct(theta, x);
  
  // Exploration term: α * sqrt(x^T A^(-1) x)
  const A_inv_x = matrixVectorMultiply(A_inv, x);
  const exploration = alpha * Math.sqrt(Math.max(0, dotProduct(x, A_inv_x)));
  
  return {
    destination_index: state.destination_index,
    score: exploitation + exploration,
    ucb: exploration,
    exploitation,
    exploration,
  };
}

/**
 * Select best destination using LinUCB algorithm
 */
export function selectDestination(
  banditStates: BanditState[],
  context: ContextVector,
  alpha: number = 1.0
): number {
  if (banditStates.length === 0) return 0;
  
  const scores = banditStates.map(state => 
    calculateLinUCBScore(state, context, alpha)
  );
  
  // Return destination index with highest score
  return scores.reduce((best, curr) => 
    curr.score > best.score ? curr : best
  ).destination_index;
}

/**
 * Update bandit state after observing reward (conversion)
 * A_new = A + x * x^T
 * b_new = b + r * x
 */
export function updateBanditState(
  state: BanditState,
  context: ContextVector,
  reward: number
): BanditState {
  const x = contextToArray(context);
  
  // Update A matrix: A = A + x * x^T
  const newA = state.a_matrix.map((row, i) =>
    row.map((val, j) => val + x[i] * x[j])
  );
  
  // Update b vector: b = b + r * x
  const newB = state.b_vector.map((val, i) => val + reward * x[i]);
  
  return {
    ...state,
    a_matrix: newA,
    b_vector: newB,
    impressions: state.impressions + 1,
    conversions: state.conversions + (reward > 0 ? 1 : 0),
  };
}

/**
 * Initialize new bandit state with identity matrix
 */
export function initializeBanditState(
  linkId: string,
  destinationIndex: number,
  contextKey: string
): Omit<BanditState, 'impressions' | 'conversions'> {
  return {
    destination_index: destinationIndex,
    context_key: contextKey,
    a_matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ], // 3x3 Identity matrix
    b_vector: [0, 0, 0], // Zero vector
  };
}

/**
 * Get exploration parameter based on total impressions
 * Higher exploration early, lower as we gather more data
 */
export function getAlpha(totalImpressions: number): number {
  if (totalImpressions < 50) return 2.0;  // High exploration
  if (totalImpressions < 200) return 1.5; // Medium exploration
  if (totalImpressions < 500) return 1.0; // Balanced
  return 0.5; // Low exploration, mostly exploit
}
