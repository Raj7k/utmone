import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { workspaceId, firstName, lastName, phone, email, company, title, website, address } = body;

    if (!workspaceId) {
      return new Response(JSON.stringify({ error: "Missing workspaceId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!firstName && !lastName) {
      return new Response(JSON.stringify({ error: "At least first or last name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate unique slug
    let slug = generateSlug();
    let attempts = 0;
    const maxAttempts = 5;

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    while (attempts < maxAttempts) {
      const { data: existing } = await serviceClient
        .from("vcard_entries")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    // Insert vCard entry
    const { data: vcard, error: insertError } = await serviceClient
      .from("vcard_entries")
      .insert({
        workspace_id: workspaceId,
        slug,
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        company,
        title,
        website,
        address,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating vCard:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create vCard" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate short URL using go.utm.one domain (routed via Cloudflare Worker)
    const shortUrl = `https://go.utm.one/v/${slug}`;

    console.log("Created vCard with slug:", slug);

    return new Response(JSON.stringify({ 
      success: true, 
      slug,
      shortUrl,
      vcard 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating vCard link:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
