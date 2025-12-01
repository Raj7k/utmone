/**
 * AI-Powered Send Time Predictor Hook
 * Uses Gaussian Process Regression from "Algorithms for Optimization"
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GaussianProcess, TimeSlot, GPPrediction } from '@/lib/gaussianProcess';

interface TimeSlotPrediction {
  dayOfWeek: number;
  hourOfDay: number;
  dayName: string;
  timeLabel: string;
  prediction: GPPrediction;
  isExploration: boolean; // High EI but low observations
}

interface AITimeRecommendations {
  topPredictions: TimeSlotPrediction[];
  explorationSuggestions: TimeSlotPrediction[];
  weeklyPattern: TimeSlotPrediction[][]; // [day][hour]
  insights: string[];
  confidence: 'high' | 'medium' | 'low';
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const formatTimeLabel = (hour: number): string => {
  const ampm = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}${ampm}`;
};

/**
 * Fetch historical click data aggregated by time slots
 */
async function fetchClickHeatmapData(workspaceId: string, days: number = 30): Promise<TimeSlot[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: clicks, error } = await supabase
    .from('link_clicks')
    .select('clicked_at')
    .eq('workspace_id', workspaceId)
    .gte('clicked_at', startDate.toISOString());

  if (error) throw error;

  // Aggregate by day-hour slots
  const slotMap = new Map<string, number>();

  clicks?.forEach((click) => {
    const date = new Date(click.clicked_at);
    const dayOfWeek = date.getDay();
    const hourOfDay = date.getHours();
    const key = `${dayOfWeek}-${hourOfDay}`;
    slotMap.set(key, (slotMap.get(key) || 0) + 1);
  });

  // Convert to TimeSlot array
  const timeSlots: TimeSlot[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const key = `${day}-${hour}`;
      const clicks = slotMap.get(key) || 0;
      if (clicks > 0) {
        // Only include slots with observations
        timeSlots.push({ dayOfWeek: day, hourOfDay: hour, clicks });
      }
    }
  }

  return timeSlots;
}

/**
 * Generate AI predictions for all time slots
 */
function generatePredictions(trainingData: TimeSlot[]): AITimeRecommendations {
  if (trainingData.length < 10) {
    return {
      topPredictions: [],
      explorationSuggestions: [],
      weeklyPattern: [],
      insights: ['not enough data yet. keep sharing links to get ai predictions.'],
      confidence: 'low',
    };
  }

  // Train Gaussian Process
  const gp = new GaussianProcess(
    3.0, // lengthScale - controls smoothness
    1.0, // variance - signal variance
    0.1  // noise - measurement noise
  );

  gp.fit(trainingData);

  // Predict for all 168 time slots (7 days × 24 hours)
  const allPredictions: TimeSlotPrediction[] = [];
  const observedSlots = new Set(trainingData.map(s => `${s.dayOfWeek}-${s.hourOfDay}`));

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const prediction = gp.predict(day, hour);
      const isExploration = !observedSlots.has(`${day}-${hour}`) && prediction.expectedImprovement > 0.5;

      allPredictions.push({
        dayOfWeek: day,
        hourOfDay: hour,
        dayName: DAY_NAMES[day],
        timeLabel: formatTimeLabel(hour),
        prediction,
        isExploration,
      });
    }
  }

  // Top predictions by mean (exploitation)
  const topPredictions = [...allPredictions]
    .filter(p => !p.isExploration) // Exclude unexplored slots
    .sort((a, b) => b.prediction.mean - a.prediction.mean)
    .slice(0, 5);

  // Exploration suggestions (high EI, unexplored)
  const explorationSuggestions = allPredictions
    .filter(p => p.isExploration)
    .sort((a, b) => b.prediction.expectedImprovement - a.prediction.expectedImprovement)
    .slice(0, 3);

  // Weekly pattern (grid view)
  const weeklyPattern: TimeSlotPrediction[][] = Array(7)
    .fill(0)
    .map((_, day) => allPredictions.filter(p => p.dayOfWeek === day));

  // Generate insights
  const insights = generateInsights(topPredictions, explorationSuggestions, trainingData);

  // Confidence based on data volume and variance
  const avgVariance = allPredictions.reduce((sum, p) => sum + p.prediction.variance, 0) / allPredictions.length;
  const confidence = trainingData.length > 50 && avgVariance < 100 ? 'high' 
    : trainingData.length > 20 ? 'medium' 
    : 'low';

  return {
    topPredictions,
    explorationSuggestions,
    weeklyPattern,
    insights,
    confidence,
  };
}

function generateInsights(
  topPredictions: TimeSlotPrediction[],
  explorations: TimeSlotPrediction[],
  trainingData: TimeSlot[]
): string[] {
  const insights: string[] = [];

  if (topPredictions.length > 0) {
    const best = topPredictions[0];
    const ci = best.prediction.confidenceInterval;
    insights.push(
      `best time: ${best.dayName} ${best.timeLabel} (predicted ${Math.round(best.prediction.mean)} ± ${Math.round(best.prediction.std)} clicks)`
    );
  }

  if (topPredictions.length >= 2) {
    const dayPattern = topPredictions.slice(0, 3).map(p => p.dayName);
    const uniqueDays = new Set(dayPattern);
    if (uniqueDays.size === 1) {
      insights.push(`${dayPattern[0]}s are consistently your best day`);
    }
  }

  if (explorations.length > 0) {
    const explore = explorations[0];
    insights.push(
      `unexplored opportunity: try ${explore.dayName} ${explore.timeLabel} - high potential, low data`
    );
  }

  const totalClicks = trainingData.reduce((sum, s) => sum + s.clicks, 0);
  insights.push(`analyzed ${trainingData.length} time slots with ${totalClicks} total clicks`);

  return insights;
}

/**
 * React Hook: AI-Powered Send Time Predictor
 */
export const useAISendTimePredictor = (workspaceId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['ai-send-time-predictor', workspaceId, days],
    queryFn: async () => {
      const trainingData = await fetchClickHeatmapData(workspaceId, days);
      return generatePredictions(trainingData);
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
