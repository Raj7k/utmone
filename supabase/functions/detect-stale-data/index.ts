import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StaleLink {
  link_id: string
  title: string
  short_url: string
  created_at: string
  last_clicked_at: string | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🧹 Starting stale data detection job...')

    // Get all active workspaces
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select('id, name')

    if (workspacesError) {
      throw workspacesError
    }

    console.log(`Found ${workspaces?.length || 0} workspaces to scan`)

    let totalStaleLinksFound = 0
    let totalNotificationsCreated = 0

    for (const workspace of workspaces || []) {
      console.log(`Scanning workspace: ${workspace.name} (${workspace.id})`)

      // Call detect_stale_links function
      const { data: staleLinks, error: staleError } = await supabase
        .rpc('detect_stale_links', { p_workspace_id: workspace.id })

      if (staleError) {
        console.error(`Error detecting stale links for ${workspace.id}:`, staleError)
        continue
      }

      const staleLinksData = staleLinks as StaleLink[]

      if (staleLinksData && staleLinksData.length > 0) {
        console.log(`Found ${staleLinksData.length} stale links in workspace ${workspace.name}`)
        totalStaleLinksFound += staleLinksData.length

        // Check if notification already exists and not dismissed
        const { data: existingNotif } = await supabase
          .from('workspace_hygiene_notifications')
          .select('id')
          .eq('workspace_id', workspace.id)
          .eq('notification_type', 'stale_links')
          .eq('dismissed', false)
          .maybeSingle()

        if (existingNotif) {
          // Update existing notification
          const { error: updateError } = await supabase
            .from('workspace_hygiene_notifications')
            .update({
              item_count: staleLinksData.length,
              item_ids: staleLinksData.map(l => l.link_id),
              metadata: {
                oldest_link_date: staleLinksData[0]?.created_at,
                last_scan: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            })
            .eq('id', existingNotif.id)

          if (updateError) {
            console.error('Error updating notification:', updateError)
          } else {
            console.log('Updated existing notification')
          }
        } else {
          // Create new notification
          const { error: insertError } = await supabase
            .from('workspace_hygiene_notifications')
            .insert({
              workspace_id: workspace.id,
              notification_type: 'stale_links',
              item_count: staleLinksData.length,
              item_ids: staleLinksData.map(l => l.link_id),
              metadata: {
                oldest_link_date: staleLinksData[0]?.created_at,
                last_scan: new Date().toISOString()
              }
            })

          if (insertError) {
            console.error('Error creating notification:', insertError)
          } else {
            totalNotificationsCreated++
            console.log('Created new hygiene notification')
          }
        }
      } else {
        console.log(`No stale links found in workspace ${workspace.name}`)
      }
    }

    console.log(`✅ Stale data detection complete!`)
    console.log(`Total stale links found: ${totalStaleLinksFound}`)
    console.log(`Total notifications created/updated: ${totalNotificationsCreated}`)

    return new Response(
      JSON.stringify({
        success: true,
        workspaces_scanned: workspaces?.length || 0,
        total_stale_links: totalStaleLinksFound,
        notifications_created: totalNotificationsCreated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in stale data detection:', error)
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