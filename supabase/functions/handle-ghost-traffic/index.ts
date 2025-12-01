import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { link_id, visitor_id, ip_address, user_agent, referrer } = await req.json()

    if (!link_id) {
      return new Response(
        JSON.stringify({ error: 'link_id is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`👻 Ghost traffic detected for deleted link: ${link_id}`)

    // Get the deleted link details
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('id, title, short_url, workspace_id, created_by, deleted_at, traffic_score')
      .eq('id', link_id)
      .not('deleted_at', 'is', null)
      .maybeSingle()

    if (linkError || !link) {
      console.error('Error fetching deleted link:', linkError)
      return new Response(
        JSON.stringify({ error: 'Link not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Log the ghost traffic event
    const { error: logError } = await supabase
      .from('link_clicks')
      .insert({
        link_id: link_id,
        workspace_id: link.workspace_id,
        visitor_id: visitor_id || null,
        ip_address: ip_address || null,
        user_agent: user_agent || null,
        referrer: referrer || null,
        is_unique: false,
        clicked_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Error logging ghost traffic:', logError)
    }

    // Get workspace owner/admin emails
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('owner_id, name')
      .eq('id', link.workspace_id)
      .single()

    if (workspaceError) {
      console.error('Error fetching workspace:', workspaceError)
      return new Response(
        JSON.stringify({ success: true, notification_sent: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Get owner profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', workspace.owner_id)
      .single()

    if (profile?.email) {
      console.log(`Sending ghost traffic alert to ${profile.email}`)

      // Create notification record
      const { error: notifError } = await supabase
        .from('workspace_hygiene_notifications')
        .insert({
          workspace_id: link.workspace_id,
          notification_type: 'broken_qr_codes',
          item_count: 1,
          item_ids: [link_id],
          metadata: {
            link_title: link.title,
            short_url: link.short_url,
            ghost_traffic_at: new Date().toISOString(),
            deleted_at: link.deleted_at,
            traffic_score: link.traffic_score
          }
        })

      if (notifError) {
        console.error('Error creating ghost traffic notification:', notifError)
      }

      // TODO: Send email via Resend
      // For now, just log it
      console.log(`📧 Email alert queued for ${profile.email}`)
      console.log(`Subject: Someone just accessed your deleted link: ${link.title}`)
      console.log(`Body: A user just tried to access "${link.short_url}" which was deleted. Would you like to restore it?`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        link: {
          id: link.id,
          title: link.title,
          short_url: link.short_url,
          deleted_at: link.deleted_at,
          traffic_score: link.traffic_score
        },
        notification_sent: !!profile?.email
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error handling ghost traffic:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})