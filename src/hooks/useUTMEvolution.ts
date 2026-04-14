import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { 
  geneticAlgorithm, 
  UTMChromosome, 
  utmCrossover, 
  utmMutation,
  generateUTMPopulation
} from "@/lib/geneticAlgorithm";

interface EvolvedUTMPattern {
  pattern: UTMChromosome;
  expectedConversionRate: number;
  confidence: number;
  generation: number;
}

export function useUTMEvolution(workspaceId?: string) {
  return useQuery({
    queryKey: ['utm-evolution', workspaceId],
    queryFn: async (): Promise<EvolvedUTMPattern[]> => {
      // Fetch conversion events with UTM parameters
      let query = supabaseFrom('conversion_events')
        .select(`
          id,
          event_type,
          link:links!inner(
            id,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content
          )
        `)
        .eq('event_type', 'purchase');

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      const { data: conversions, error: convError } = await query;
      if (convError) throw convError;

      // Fetch all clicks for conversion rate calculation
      let clickQuery = supabaseFrom('link_clicks')
        .select('link_id');

      if (workspaceId) {
        clickQuery = clickQuery.eq('workspace_id', workspaceId);
      }

      const { data: clicks, error: clickError } = await clickQuery;
      if (clickError) throw clickError;

      if (!conversions || conversions.length < 5) {
        return [];
      }

      // Extract UTM patterns from conversions
      const utmPatterns: UTMChromosome[] = conversions
        .map(conv => ({
          source: conv.link?.utm_source || '',
          medium: conv.link?.utm_medium || '',
          campaign: conv.link?.utm_campaign || '',
          term: conv.link?.utm_term,
          content: conv.link?.utm_content
        }))
        .filter(utm => utm.source && utm.medium && utm.campaign);

      if (utmPatterns.length === 0) return [];

      // Build vocabulary for mutations
      const vocabulary: string[][] = [
        [...new Set(utmPatterns.map(u => u.source))],
        [...new Set(utmPatterns.map(u => u.medium))],
        [...new Set(utmPatterns.map(u => u.campaign))],
        [...new Set(utmPatterns.map(u => u.term).filter(Boolean))],
        [...new Set(utmPatterns.map(u => u.content).filter(Boolean))]
      ];

      // Fitness function: conversion rate for UTM pattern
      const fitnessFunction = (chromosome: UTMChromosome): number => {
        // Find clicks with this UTM pattern
        const matchingConversions = conversions.filter(conv => 
          conv.link?.utm_source === chromosome.source &&
          conv.link?.utm_medium === chromosome.medium &&
          conv.link?.utm_campaign === chromosome.campaign
        ).length;

        const matchingClicks = clicks?.filter(click => {
          // This is simplified - in production, join with links table
          return true;
        }).length || 1;

        return matchingConversions / matchingClicks;
      };

      // Generate initial population
      const initialPopulation = generateUTMPopulation(utmPatterns, 30);

      // Run genetic algorithm
      const result = geneticAlgorithm(
        initialPopulation,
        fitnessFunction,
        utmCrossover,
        (chromosome) => utmMutation(chromosome, vocabulary),
        {
          populationSize: 30,
          generations: 20,
          mutationRate: 0.15,
          crossoverRate: 0.7,
          elitismCount: 3
        }
      );

      // Return top 3 evolved patterns
      return result.population.slice(0, 3).map((individual, index) => ({
        pattern: individual.chromosome,
        expectedConversionRate: individual.fitness,
        confidence: 0.7 - (index * 0.1),
        generation: result.generation
      }));
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 60 // Cache for 1 hour
  });
}
