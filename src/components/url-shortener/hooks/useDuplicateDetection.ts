/**
 * useDuplicateDetection Hook
 * Detects duplicate URLs and provides smart resolution suggestions
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PERFORMANCE_CTR_THRESHOLD } from '@/lib/constants';

export interface DuplicateAnalysis {
  isDifferentCampaign: boolean;
  isDifferentUTM: boolean;
  bestPerforming: any | null;
  worstPerforming: any | null;
  totalClicks: number;
  avgCTR: number;
}

export interface DuplicateSuggestion {
  type: 'use-best' | 'new-campaign' | 'ab-test' | 'archive' | 'force-new';
  action: string;
  description: string;
  recommended: boolean;
}

export const useDuplicateDetection = (workspaceId: string) => {
  const checkForDuplicates = useCallback(async (destinationUrl: string) => {
    try {
      const { data: existingLinks, error } = await supabase
        .from('links')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('destination_url', destinationUrl)
        .limit(20);

      if (error) throw error;

      return existingLinks || [];
    } catch (error) {
      console.error('Duplicate check error:', error);
      return [];
    }
  }, [workspaceId]);

  const analyzeDuplicate = useCallback((
    newUrl: any,
    existingVersions: any[]
  ): DuplicateAnalysis => {
    const analysis: DuplicateAnalysis = {
      isDifferentCampaign: false,
      isDifferentUTM: false,
      bestPerforming: null,
      worstPerforming: null,
      totalClicks: 0,
      avgCTR: 0,
    };

    // Check campaign differences
    existingVersions.forEach(existing => {
      if (existing.campaign !== newUrl.campaign) {
        analysis.isDifferentCampaign = true;
      }

      // Check UTM differences
      const existingUTM = JSON.stringify(existing.utm_params || {});
      const newUTM = JSON.stringify(newUrl.utm_params || {});
      if (existingUTM !== newUTM) {
        analysis.isDifferentUTM = true;
      }

      analysis.totalClicks += existing.total_clicks || 0;
    });

    // Find best and worst performing
    if (existingVersions.length > 0) {
      existingVersions.sort((a, b) => (b.total_clicks || 0) - (a.total_clicks || 0));
      analysis.bestPerforming = existingVersions[0];
      analysis.worstPerforming = existingVersions[existingVersions.length - 1];

      // Calculate average CTR (mock - would need real analytics)
      analysis.avgCTR = analysis.totalClicks / existingVersions.length;
    }

    return analysis;
  }, []);

  const generateSuggestions = useCallback((
    newUrl: any,
    existingVersions: any[],
    analysis: DuplicateAnalysis
  ): DuplicateSuggestion[] => {
    const suggestions: DuplicateSuggestion[] = [];

    // Suggest using best performing version
    if (analysis.bestPerforming && analysis.avgCTR > PERFORMANCE_CTR_THRESHOLD) {
      suggestions.push({
        type: 'use-best',
        action: 'Use Best Performing',
        description: `Use existing link with ${analysis.bestPerforming.total_clicks} clicks`,
        recommended: true,
      });
    }

    // Suggest creating new version for different campaign
    if (analysis.isDifferentCampaign) {
      suggestions.push({
        type: 'new-campaign',
        action: 'Create Campaign Version',
        description: `Create new version for different campaign`,
        recommended: !suggestions.some(s => s.recommended),
      });
    }

    // Suggest A/B test
    if (existingVersions.length < 3) {
      suggestions.push({
        type: 'ab-test',
        action: 'Create A/B Test',
        description: 'Create variant for A/B testing',
        recommended: false,
      });
    }

    // Suggest archiving old versions
    const oldVersions = existingVersions.filter(v => {
      const ageInDays = (Date.now() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return ageInDays > 30 && (v.total_clicks || 0) < 100;
    });

    if (oldVersions.length > 0) {
      suggestions.push({
        type: 'archive',
        action: 'Archive & Replace',
        description: `Archive ${oldVersions.length} old version(s) and create new`,
        recommended: false,
      });
    }

    // Always provide create new option
    suggestions.push({
      type: 'force-new',
      action: 'Create New Version',
      description: `Create as version ${existingVersions.length + 1}`,
      recommended: suggestions.length === 0,
    });

    return suggestions;
  }, []);

  return {
    checkForDuplicates,
    analyzeDuplicate,
    generateSuggestions,
  };
};
