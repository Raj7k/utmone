import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { nelderMead, generateInitialSimplex, rgbToVector, vectorToRgb } from "@/lib/nelderMead";

interface QRStyleRecommendation {
  primaryColor: string;
  secondaryColor: string;
  cornerStyle: string;
  expectedScans: number;
  confidence: number;
  isOptimizing: boolean;
}

export function useQRStyleOptimizer(workspaceId?: string) {
  return useQuery({
    queryKey: ['qr-style-optimizer', workspaceId],
    queryFn: async (): Promise<QRStyleRecommendation> => {
      // Fetch QR codes with their scan counts
      let query = supabase
        .from('qr_codes')
        .select(`
          id,
          primary_color,
          secondary_color,
          corner_style,
          link_id,
          link:links!inner(id)
        `);

      if (workspaceId) {
        query = query.eq('link.workspace_id', workspaceId);
      }

      const { data: qrCodes, error } = await query;

      if (error) throw error;

      if (!qrCodes || qrCodes.length === 0) {
        // Return default recommendation
        return {
          primaryColor: '#191265',
          secondaryColor: '#3B82F6',
          cornerStyle: 'square',
          expectedScans: 0,
          confidence: 0,
          isOptimizing: false
        };
      }

      // Get scan counts for each QR code
      const qrWithScans = await Promise.all(
        qrCodes.map(async (qr) => {
          const { count } = await supabaseFrom('link_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('link_id', qr.link_id);

          return {
            ...qr,
            scans: count || 0
          };
        })
      );

      // Find best performing style
      const bestQR = qrWithScans.reduce((best, current) => 
        current.scans > best.scans ? current : best
      );

      // If we have enough data, optimize the color
      if (qrWithScans.length >= 5) {
        // Objective function: negative scan rate (for minimization)
        const objectiveFunction = (colorVector: number[]): number => {
          const testColor = vectorToRgb(colorVector);
          
          // Find QR codes similar to this color
          const similarQRs = qrWithScans.filter(qr => {
            const qrVector = rgbToVector(qr.primary_color || '#000000');
            const distance = Math.sqrt(
              colorVector.reduce((sum, val, i) => sum + Math.pow(val - qrVector[i], 2), 0)
            );
            return distance < 50; // Within 50 RGB units
          });

          if (similarQRs.length === 0) return 1000; // High penalty

          // Return negative average scans
          const avgScans = similarQRs.reduce((sum, qr) => sum + qr.scans, 0) / similarQRs.length;
          return -avgScans;
        };

        // Start optimization from best color
        const initialColor = rgbToVector(bestQR.primary_color || '#191265');
        const initialSimplex = generateInitialSimplex(initialColor, 20);

        const result = nelderMead(objectiveFunction, initialSimplex, {
          maxIterations: 50,
          tolerance: 1
        });

        const optimizedColor = vectorToRgb(result.bestPoint);

        return {
          primaryColor: optimizedColor,
          secondaryColor: bestQR.secondary_color || '#3B82F6',
          cornerStyle: bestQR.corner_style || 'square',
          expectedScans: Math.round(-result.bestValue),
          confidence: result.converged ? 0.85 : 0.5,
          isOptimizing: true
        };
      }

      // Not enough data for optimization, return best observed
      return {
        primaryColor: bestQR.primary_color || '#191265',
        secondaryColor: bestQR.secondary_color || '#3B82F6',
        cornerStyle: bestQR.corner_style || 'square',
        expectedScans: bestQR.scans,
        confidence: 0.6,
        isOptimizing: false
      };
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 30 // Cache for 30 minutes
  });
}
