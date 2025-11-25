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

    const { workspace_id, links } = await req.json();

    if (!workspace_id || !links || !Array.isArray(links)) {
      throw new Error("Invalid request body");
    }

    if (links.length > 100) {
      throw new Error("Maximum 100 links per upload");
    }

    const results = [];
    const errors = [];
    let successCount = 0;

    for (let i = 0; i < links.length; i++) {
      const linkData = links[i];
      
      try {
        // Generate slug if not provided
        const slug = linkData.slug || Math.random().toString(36).substring(2, 10);
        
        // Build final URL with UTMs
        const url = new URL(linkData.destination_url);
        const params = new URLSearchParams();
        
        params.set("utm_source", linkData.utm_source);
        params.set("utm_medium", linkData.utm_medium);
        params.set("utm_campaign", linkData.utm_campaign);
        if (linkData.utm_term) params.set("utm_term", linkData.utm_term);
        if (linkData.utm_content) params.set("utm_content", linkData.utm_content);
        
        const finalUrl = `${url.origin}${url.pathname}${url.search ? url.search + "&" : "?"}${params.toString()}`;
        
        // Check slug uniqueness
        const { data: existingLink } = await supabase
          .from("links")
          .select("id")
          .eq("workspace_id", workspace_id)
          .eq("domain", "utm.one")
          .eq("path", "go")
          .eq("slug", slug)
          .maybeSingle();
        
        if (existingLink) {
          errors.push({
            row: linkData._rowNumber || i + 2,
            field: "slug",
            message: `Slug "${slug}" already exists`,
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
            domain: "utm.one",
            path: "go",
            slug,
            final_url: finalUrl,
            utm_source: linkData.utm_source,
            utm_medium: linkData.utm_medium,
            utm_campaign: linkData.utm_campaign,
            utm_term: linkData.utm_term || null,
            utm_content: linkData.utm_content || null,
          })
          .select()
          .single();

        if (createError) {
          errors.push({
            row: linkData._rowNumber || i + 2,
            field: "general",
            message: createError.message,
          });
          continue;
        }

        results.push(link);
        successCount++;
      } catch (error: any) {
        errors.push({
          row: linkData._rowNumber || i + 2,
          field: "general",
          message: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success_count: successCount,
        total: links.length,
        errors: errors.length > 0 ? errors : null,
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
