import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { targetEmail, senderEmail, workspaceId } = await req.json();

    if (!targetEmail || !senderEmail || !workspaceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get sender's user ID
    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check 1: Get last invite timestamp
    const { data: lastInvite } = await supabase
      .from('workspace_invitations')
      .select('created_at')
      .eq('invited_by', user.id)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Check 2: Get recent invites (last 10 from this user)
    const { data: recentInvites } = await supabase
      .from('workspace_invitations')
      .select('email')
      .eq('invited_by', user.id)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentEmails = recentInvites?.map(inv => inv.email) || [];

    // Run fraud checks
    let score = 0;
    const reasons: string[] = [];

    // Velocity check
    if (lastInvite) {
      const secondsSinceLastInvite = (Date.now() - new Date(lastInvite.created_at).getTime()) / 1000;
      if (secondsSinceLastInvite < 5) {
        score += 40;
        reasons.push('Rapid-fire invites detected (bot behavior)');
      }
    }

    // Email aliasing check
    if (targetEmail.includes('+')) {
      const [localPart] = targetEmail.split('@');
      const baseEmail = localPart.split('+')[0];
      const [senderLocal] = senderEmail.split('@');
      
      if (baseEmail === senderLocal || baseEmail === senderLocal.split('+')[0]) {
        score += 30;
        reasons.push('Email alias pattern detected');
      }
    }

    // Disposable domain check
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com',
      'throwaway.email', 'mailinator.com', 'yopmail.com'
    ];
    const domain = targetEmail.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      score += 20;
      reasons.push('Disposable email domain');
    }

    // Sequential pattern check
    const bases = [...recentEmails, targetEmail].map(email => {
      const [local] = email.split('@');
      return local.replace(/\d+$/, '').toLowerCase();
    });
    const uniqueBases = new Set(bases);
    if (uniqueBases.size < bases.length) {
      score += 10;
      reasons.push('Sequential email pattern detected');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    let allowed: boolean;

    if (score >= 60) {
      riskLevel = 'high';
      allowed = false;
    } else if (score >= 30) {
      riskLevel = 'medium';
      allowed = true;
    } else {
      riskLevel = 'low';
      allowed = true;
    }

    // Log security event if high risk
    if (riskLevel === 'high') {
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: user.id,
        action: 'fraud_invite_blocked',
        resource_type: 'security_event',
        new_values: {
          target_email: targetEmail,
          workspace_id: workspaceId,
          risk_score: score,
          reasons
        }
      });
    }

    return new Response(
      JSON.stringify({
        allowed,
        riskLevel,
        reasons,
        score
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking invite fraud:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
