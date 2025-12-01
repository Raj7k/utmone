/**
 * Usage Forecasting using Linear Regression
 * Based on Chapter 17: Surrogate Models
 */

export interface UsageDataPoint {
  date: Date;
  count: number;
}

export interface ForecastResult {
  predictedLimitDate: Date | null;
  daysUntilLimit: number;
  growthRate: number;
  confidence: 'high' | 'medium' | 'low';
  projectedUsage: Array<{ date: Date; count: number }>;
}

/**
 * Simple Linear Regression: y = mx + b
 * Least Squares Method to fit line to usage data
 */
export function predictLimitDate(
  usageHistory: UsageDataPoint[],
  limit: number
): ForecastResult {
  if (usageHistory.length < 2) {
    return {
      predictedLimitDate: null,
      daysUntilLimit: Infinity,
      growthRate: 0,
      confidence: 'low',
      projectedUsage: []
    };
  }

  // Convert dates to numeric days from first data point
  const firstDate = usageHistory[0].date.getTime();
  const dataPoints = usageHistory.map(point => ({
    x: Math.floor((point.date.getTime() - firstDate) / (1000 * 60 * 60 * 24)),
    y: point.count
  }));

  // Calculate linear regression: y = mx + b
  const n = dataPoints.length;
  const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
  const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);

  // Slope (growth rate per day)
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Intercept
  const b = (sumY - m * sumX) / n;

  // Predict when count will reach limit: limit = mx + b -> x = (limit - b) / m
  let predictedLimitDate: Date | null = null;
  let daysUntilLimit = Infinity;

  if (m > 0) {
    const daysFromStart = (limit - b) / m;
    const limitTimestamp = firstDate + daysFromStart * (1000 * 60 * 60 * 24);
    predictedLimitDate = new Date(limitTimestamp);
    daysUntilLimit = Math.ceil((limitTimestamp - Date.now()) / (1000 * 60 * 60 * 24));
  }

  // Calculate confidence based on R²
  const meanY = sumY / n;
  const ssTotal = dataPoints.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
  const ssResidual = dataPoints.reduce((sum, p) => {
    const predicted = m * p.x + b;
    return sum + Math.pow(p.y - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  
  const confidence: 'high' | 'medium' | 'low' = 
    rSquared > 0.8 ? 'high' : rSquared > 0.5 ? 'medium' : 'low';

  // Generate projected usage for next 30 days
  const projectedUsage: Array<{ date: Date; count: number }> = [];
  const lastDay = dataPoints[dataPoints.length - 1].x;
  
  for (let i = 0; i <= 30; i++) {
    const x = lastDay + i;
    const projectedCount = Math.round(m * x + b);
    const projectedDate = new Date(firstDate + x * (1000 * 60 * 60 * 24));
    projectedUsage.push({ date: projectedDate, count: Math.max(0, projectedCount) });
  }

  return {
    predictedLimitDate,
    daysUntilLimit: Math.max(0, daysUntilLimit),
    growthRate: m,
    confidence,
    projectedUsage
  };
}
