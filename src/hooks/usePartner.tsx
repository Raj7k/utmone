import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notify';
import { getCachedUserId, requireUserId } from '@/lib/getCachedUser';

export interface Partner {
  id: string;
  user_id: string;
  workspace_id: string | null;
  partner_code: string;
  status: 'pending' | 'approved' | 'suspended' | 'terminated';
  commission_rate: number;
  payment_email: string | null;
  payment_method: string | null;
  stripe_connect_id: string | null;
  total_referrals: number;
  total_conversions: number;
  total_revenue: number;
  total_earnings: number;
  pending_payout: number;
  lifetime_payout: number;
  referral_url: string | null;
  application_notes: string | null;
  created_at: string;
  approved_at: string | null;
  last_payout_at: string | null;
}

export interface PartnerReferral {
  id: string;
  partner_id: string;
  referred_user_id: string | null;
  referral_code: string;
  signup_date: string | null;
  first_payment_date: string | null;
  conversion_date: string | null;
  conversion_value: number | null;
  commission_earned: number | null;
  commission_paid: boolean;
  status: 'pending' | 'converted' | 'paid' | 'refunded';
  created_at: string;
}

export const usePartner = () => {
  const queryClient = useQueryClient();

  const { data: partner, isLoading } = useQuery({
    queryKey: ['partner'],
    queryFn: async () => {
      const userId = getCachedUserId();
      if (!userId) return null;

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Partner | null;
    },
  });

  const { data: referrals } = useQuery({
    queryKey: ['partner-referrals', partner?.id],
    queryFn: async () => {
      if (!partner?.id) return [];

      const { data, error } = await supabase
        .from('partner_referrals')
        .select('*')
        .eq('partner_id', partner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PartnerReferral[];
    },
    enabled: !!partner?.id,
  });

  const applyAsPartner = useMutation({
    mutationFn: async (application: {
      payment_email: string;
      payment_method: string;
      application_notes: string;
    }) => {
      const userId = requireUserId();
      // Generate unique partner code
      const partnerCode = `PARTNER_${userId.substring(0, 8).toUpperCase()}`;
      const referralUrl = `${window.location.origin}/?ref=${partnerCode}`;

      const { data, error } = await supabase
        .from('partners')
        .insert({
          user_id: userId,
          partner_code: partnerCode,
          referral_url: referralUrl,
          ...application,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      notify.success('application submitted', {
        description: 'your partner application has been submitted for review',
      });
    },
    onError: (error) => {
      notify.error('failed to submit application', {
        description: error.message,
      });
    },
  });

  const requestPayout = useMutation({
    mutationFn: async (amount: number) => {
      if (!partner) throw new Error('No partner profile found');
      if (amount < 50) throw new Error('Minimum payout is $50');
      if (amount > partner.pending_payout) throw new Error('Insufficient balance');

      const { data, error } = await supabase
        .from('partner_payouts')
        .insert({
          partner_id: partner.id,
          amount,
          method: partner.payment_method || 'stripe',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner'] });
      notify.success('payout requested', {
        description: 'your payout request will be processed within 3-5 business days',
      });
    },
    onError: (error) => {
      notify.error('failed to request payout', {
        description: error.message,
      });
    },
  });

  return {
    partner,
    referrals,
    isLoading,
    applyAsPartner: applyAsPartner.mutate,
    requestPayout: requestPayout.mutate,
  };
};
