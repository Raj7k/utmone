import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { workspace_id, domain, links } = await req.json();

    if (!workspace_id || !links || !Array.isArray(links)) {
      throw new Error("Invalid request body");
    }

    if (links.length > 100) {
      throw new Error("Maximum 100 links per upload");
    }

    const targetDomain = domain || "utm.click";
    const results = [];
    let successCount = 0;

    for (let i = 0; i < links.length; i++) {
      const linkData = links[i];
      
      try {
        // Generate slug if not provided
        const slug = linkData.slug || Math.random().toString(36).substring(2, 10);
        
        // Use destination_url as final_url (already processed by frontend)
        const finalUrl = linkData.destination_url;
        
        // Check slug uniqueness
        const { data: existingLink } = await supabase
          .from("links")
          .select("id")
          .eq("workspace_id", workspace_id)
          .eq("domain", targetDomain)
          .eq("path", "")
          .eq("slug", slug)
          .maybeSingle();
        
        if (existingLink) {
          results.push({
            success: false,
            destination_url: linkData.destination_url,
            error: `Slug "${slug}" already exists`,
          });
          continue;
        }

        // Create link
        const { data: link, error: createError } = await supabase
          .from("links")
          .insert({
            workspace_id,
            created_by: user.id,
            title: linkData.title,
            description: linkData.description || null,
            destination_url: linkData.destination_url,
            domain: targetDomain,
            path: "",
            slug,
            final_url: finalUrl,
            utm_source: linkData.utm_source || null,
            utm_medium: linkData.utm_medium || null,
            utm_campaign: linkData.utm_campaign || null,
            utm_term: linkData.utm_term || null,
            utm_content: linkData.utm_content || null,
          })
          .select()
          .single();

        if (createError) {
          results.push({
            success: false,
            destination_url: linkData.destination_url,
            error: createError.message,
          });
          continue;
        }

        results.push({
          success: true,
          destination_url: linkData.destination_url,
          link,
        });
        successCount++;
      } catch (error: any) {
        results.push({
          success: false,
          destination_url: linkData.destination_url,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        created: successCount,
        total: links.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Bulk create error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
