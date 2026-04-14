import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReferralStats {
  total_referrals: number;
  successful_referrals: number;
  referral_score: number;
  rank: number;
  referral_code: string;
}

export const useReferralStats = (requestId?: string) => {
  return useQuery({
    queryKey: ['referral-stats', requestId],
    queryFn: async () => {
      if (!requestId) return null;

      // Get user's referral code and stats
      const { data: user, error: userError } = await (supabase as any)
        .from('early_access_requests')
        .select('referral_code, referral_score')
        .eq('id', requestId)
        .single();

      if (userError) throw userError;

      // Count total referrals
      const { count: totalReferrals, error: countError } = await supabase
        .from('early_access_requests')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', requestId);

      if (countError) throw countError;

      // Count successful referrals (those who completed the form)
      const { count: successfulReferrals, error: successError } = await supabase
        .from('early_access_requests')
        .select('id', { count: 'exact', head: true })
        .eq('referred_by', requestId)
        .not('email', 'is', null);

      if (successError) throw successError;

      // Get user's rank
      const { data: allUsers, error: rankError } = await (supabase as any)
        .from('early_access_requests')
        .select('id, referral_score')
        .order('referral_score', { ascending: false });

      if (rankError) throw rankError;

      const rank = ((allUsers as any[])?.findIndex((u: any) => u.id === requestId) || 0) + 1;

      return {
        total_referrals: totalReferrals || 0,
        successful_referrals: successfulReferrals || 0,
        referral_score: user.referral_score || 0,
        rank,
        referral_code: user.referral_code,
      } as ReferralStats;
    },
    enabled: !!requestId,
  });
};

export const useReferralLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: ['referral-leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('early_access_requests')
        .select('id, name, email, referral_score, created_at')
        .order('referral_score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // For each user, get their referral count
      const leaderboard = await Promise.all(
        ((data || []) as any[]).map(async (user: any) => {
          const { count } = await supabase
            .from('early_access_requests')
            .select('id', { count: 'exact', head: true })
            .eq('referred_by', user.id);

          return {
            ...user,
            referral_count: count || 0,
          };
        })
      );

      return leaderboard;
    },
  });
};
