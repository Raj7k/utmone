/**
 * URLShortenerUltimate Page - Super Admin Only
 * Enterprise-grade URL shortening with AI-powered duplicate handling
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { URLShortenerUltimate as URLShortenerUltimateComponent } from '@/components/url-shortener/URLShortenerUltimate';

export default function URLShortenerUltimate() {
  const navigate = useNavigate();

  // Check if user is super admin
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile-super-admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && !profile?.is_super_admin) {
      navigate('/dashboard');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_super_admin) {
    return null;
  }

  return <URLShortenerUltimateComponent />;
}
