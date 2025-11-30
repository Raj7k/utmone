import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  oldPosition: number;
  newPosition: number;
  totalAccessScore: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, oldPosition, newPosition, totalAccessScore }: NotificationRequest = await req.json();

    // Fetch user details
    const { data: user, error: userError } = await supabase
      .from('early_access_requests')
      .select('name, email')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const positionChange = oldPosition - newPosition;
    
    // Create in-app notification
    const { error: notifError } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        notification_type: 'queue_movement',
        title: `you moved up ${positionChange} spots`,
        message: `your total score is now ${totalAccessScore}. you're at position ${newPosition} in the queue.`,
        link: '/early-access',
      });

    if (notifError) console.error('Notification insert error:', notifError);

    // Send email notification
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const { error: emailError } = await resend.emails.send({
      from: 'utm.one <updates@utm.one>',
      to: [user.email],
      subject: `you moved up ${positionChange} spots in the queue`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 32px; font-weight: 600; margin-bottom: 24px; color: #1a1a1a;">you're moving up, ${user.name}</h1>
          
          <p style="font-size: 18px; line-height: 1.6; color: #4e4e4e; margin-bottom: 32px;">
            your engagement and referrals are paying off. you've moved up <strong>${positionChange} spots</strong> in the early access queue.
          </p>

          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <div style="font-size: 14px; color: #6b6b6b; margin-bottom: 8px;">current position</div>
            <div style="font-size: 48px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">#${newPosition}</div>
            <div style="font-size: 14px; color: #6b6b6b;">total score: ${totalAccessScore}</div>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #6b6b6b; margin-bottom: 32px;">
            keep referring friends or engaging with our content to move up faster.
          </p>

          <a href="https://utm.one/early-access" style="display: inline-block; background: #1a1a1a; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            view your position
          </a>
        </div>
      `,
    });

    if (emailError) console.error('Email send error:', emailError);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});