import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

export type VerificationStatus = 'not_applied' | 'pending' | 'under_review' | 'approved' | 'rejected';

const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

export interface VerificationRequest {
  id: string;
  user_id: string;
  workspace_id: string;
  phone_number: string;
  email: string;
  full_name: string;
  document_type: string;
  document_url: string | null;
  business_name: string | null;
  business_website: string | null;
  category: string | null;
  reason_for_verification: string;
  social_links: Array<{ platform: string; url: string }>;
  status: VerificationStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateVerificationRequest {
  workspace_id: string;
  phone_number: string;
  email: string;
  full_name: string;
  document_type: string;
  document_url?: string;
  business_name?: string;
  business_website?: string;
  category?: string;
  reason_for_verification: string;
  social_links?: Array<{ platform: string; url: string }>;
}

export function useVerificationStatus(workspaceId?: string) {
  return useQuery({
    queryKey: ['verification-status', workspaceId],
    queryFn: async (): Promise<{ status: VerificationStatus; request: VerificationRequest | null }> => {
      const userId = await getUserId();
      if (!userId || !workspaceId) {
        return { status: 'not_applied', request: null };
      }

      const { data, error } = await supabaseFrom('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { status: 'not_applied', request: null };
      }

      return {
        status: data.status as VerificationStatus,
        request: {
          ...data,
          social_links: (data.social_links as Array<{ platform: string; url: string }>) || [],
        } as VerificationRequest,
      };
    },
    enabled: !!workspaceId,
    staleTime: 30000,
  });
}

export function useCreateVerificationRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateVerificationRequest) => {
      const userId = await getUserId();
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabaseFrom('verification_requests')
        .insert({
          user_id: userId,
          workspace_id: request.workspace_id,
          phone_number: request.phone_number,
          email: request.email,
          full_name: request.full_name,
          document_type: request.document_type,
          document_url: request.document_url || null,
          business_name: request.business_name || null,
          business_website: request.business_website || null,
          category: request.category || null,
          reason_for_verification: request.reason_for_verification,
          social_links: request.social_links || [],
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verification-status', variables.workspace_id] });
    },
  });
}

export function useUploadVerificationDocument() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const userId = await getUserId();
      if (!userId) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(filePath);

      return publicUrl;
    },
  });
}

// Admin hooks
export function useAllVerificationRequests() {
  return useQuery({
    queryKey: ['admin-verification-requests'],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('verification_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VerificationRequest[];
    },
    staleTime: 10000,
  });
}

export function useUpdateVerificationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      status, 
      rejection_reason 
    }: { 
      requestId: string; 
      status: 'approved' | 'rejected'; 
      rejection_reason?: string;
    }) => {
      const userId = await getUserId();
      const { data, error } = await supabaseFrom('verification_requests')
        .update({
          status,
          rejection_reason: rejection_reason || null,
          reviewed_by: userId || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] });
      queryClient.invalidateQueries({ queryKey: ['verification-status'] });
    },
  });
}
