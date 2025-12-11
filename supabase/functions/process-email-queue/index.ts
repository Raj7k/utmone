import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

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

    // Fetch pending emails scheduled for now or earlier
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_queue')
      .select(`
        *,
        user_id:early_access_requests!inner(name, email),
        campaign_id:email_campaigns!inner(subject, html_content, template_name)
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .limit(50);

    if (fetchError) throw fetchError;

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    let successCount = 0;
    let failureCount = 0;

    // Process emails in batches
    for (const email of pendingEmails) {
      try {
        const { error: sendError } = await resend.emails.send({
          from: 'utm.one <onboarding@utm.one>',
          replyTo: 'hello@utm.one',
          to: [email.user_id.email],
          subject: email.campaign_id.subject,
          html: email.campaign_id.html_content
            .replace('{{name}}', email.user_id.name)
            .replace('{{email}}', email.user_id.email),
        });

        if (sendError) {
          console.error('Email send error:', sendError);
          await supabase
            .from('email_queue')
            .update({ status: 'failed' })
            .eq('id', email.id);
          failureCount++;
        } else {
          await supabase
            .from('email_queue')
            .update({ 
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', email.id);
          successCount++;
        }
      } catch (error) {
        console.error('Error processing email:', error);
        await supabase
          .from('email_queue')
          .update({ status: 'failed' })
          .eq('id', email.id);
        failureCount++;
      }
    }

    console.log(`Processed ${successCount + failureCount} emails: ${successCount} sent, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: successCount + failureCount,
        sent: successCount,
        failed: failureCount
      }),
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