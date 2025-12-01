/**
 * Predict Optimal Time Edge Function
 * Server-side Gaussian Process predictions with caching
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TimeSlot {
  dayOfWeek: number;
  hourOfDay: number;
  clicks: number;
}

interface GPPrediction {
  mean: number;
  variance: number;
  std: number;
  confidenceInterval: { lower: number; upper: number };
  expectedImprovement: number;
}

/**
 * RBF Kernel
 */
function rbfKernel(x1: number[], x2: number[], lengthScale: number, variance: number): number {
  const squaredDist = x1.reduce((sum, val, i) => sum + Math.pow(val - x2[i], 2), 0);
  return variance * Math.exp(-squaredDist / (2 * lengthScale * lengthScale));
}

/**
 * Simplified GP prediction (lightweight for edge function)
 */
function predictGP(
  xNew: number[],
  X: number[][],
  y: number[],
  lengthScale: number,
  variance: number,
  noise: number
): GPPrediction {
  const n = X.length;

  // Compute k(x*, X)
  const kStar = X.map(x => rbfKernel(xNew, x, lengthScale, variance));

  // Build K + noise*I
  const K: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      K[i][j] = rbfKernel(X[i], X[j], lengthScale, variance);
      if (i === j) K[i][j] += noise;
    }
  }

  // Simplified inversion (for small n < 100)
  const alpha = solveLinearSystem(K, y);

  // Mean prediction
  const mean = kStar.reduce((sum, k, i) => sum + k * alpha[i], 0);

  // Variance (simplified)
  const kStarStar = rbfKernel(xNew, xNew, lengthScale, variance);
  let variancePred = kStarStar;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      variancePred -= kStar[i] * K[i][j] * kStar[j];
    }
  }
  variancePred = Math.max(variancePred, 1e-8);

  const std = Math.sqrt(variancePred);
  const confidenceInterval = {
    lower: mean - 1.96 * std,
    upper: mean + 1.96 * std,
  };

  const bestObserved = Math.max(...y);
  const ei = std > 0 ? std * (normalPDF((mean - bestObserved) / std) + (mean - bestObserved) * normalCDF((mean - bestObserved) / std)) : 0;

  return { mean, variance: variancePred, std, confidenceInterval, expectedImprovement: ei };
}

/**
 * Simplified linear system solver (Gauss-Seidel)
 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const x = Array(n).fill(0);
  const maxIter = 100;

  for (let iter = 0; iter < maxIter; iter++) {
    for (let i = 0; i < n; i++) {
      let sum = b[i];
      for (let j = 0; j < n; j++) {
        if (j !== i) sum -= A[i][j] * x[j];
      }
      x[i] = sum / A[i][i];
    }
  }

  return x;
}

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { workspaceId, days = 30 } = await req.json();

    if (!workspaceId) {
      return new Response(JSON.stringify({ error: 'workspace_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch historical click data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: clicks, error } = await supabase
      .from('link_clicks')
      .select('clicked_at')
      .eq('workspace_id', workspaceId)
      .gte('clicked_at', startDate.toISOString());

    if (error) throw error;

    // Aggregate by time slots
    const slotMap = new Map<string, number>();
    clicks?.forEach((click) => {
      const date = new Date(click.clicked_at);
      const dayOfWeek = date.getDay();
      const hourOfDay = date.getHours();
      const key = `${dayOfWeek}-${hourOfDay}`;
      slotMap.set(key, (slotMap.get(key) || 0) + 1);
    });

    const timeSlots: TimeSlot[] = [];
    for (const [key, clicks] of slotMap.entries()) {
      const [day, hour] = key.split('-').map(Number);
      timeSlots.push({ dayOfWeek: day, hourOfDay: hour, clicks });
    }

    if (timeSlots.length < 10) {
      return new Response(
        JSON.stringify({ 
          error: 'insufficient data', 
          message: 'need at least 10 time slots with clicks',
          dataPoints: timeSlots.length 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate predictions for all 168 slots
    const X = timeSlots.map(s => [s.dayOfWeek, s.hourOfDay]);
    const y = timeSlots.map(s => s.clicks);

    const predictions: any[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const pred = predictGP([day, hour], X, y, 3.0, 1.0, 0.1);
        predictions.push({
          dayOfWeek: day,
          hourOfDay: hour,
          mean: Math.round(pred.mean * 10) / 10,
          std: Math.round(pred.std * 10) / 10,
          lower: Math.round(pred.confidenceInterval.lower),
          upper: Math.round(pred.confidenceInterval.upper),
          ei: Math.round(pred.expectedImprovement * 100) / 100,
        });
      }
    }

    // Sort by mean descending
    const topPredictions = [...predictions]
      .sort((a, b) => b.mean - a.mean)
      .slice(0, 10);

    return new Response(
      JSON.stringify({
        success: true,
        dataPoints: timeSlots.length,
        totalClicks: y.reduce((sum, c) => sum + c, 0),
        topPredictions,
        allPredictions: predictions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('predict-optimal-time error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
