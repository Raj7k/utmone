import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch vCard entry
    const { data: vcard, error } = await supabase
      .from("vcard_entries")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !vcard) {
      console.error("vCard not found:", error);
      return new Response(JSON.stringify({ error: "vCard not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment download count
    await supabase
      .from("vcard_entries")
      .update({ download_count: (vcard.download_count || 0) + 1 })
      .eq("id", vcard.id);

    // Generate vCard content
    const fullName = [vcard.first_name, vcard.last_name].filter(Boolean).join(" ");
    let vcardContent = `BEGIN:VCARD
VERSION:3.0
N:${vcard.last_name || ""};${vcard.first_name || ""};;;
FN:${fullName}`;

    if (vcard.phone) vcardContent += `\nTEL:${vcard.phone}`;
    if (vcard.email) vcardContent += `\nEMAIL:${vcard.email}`;
    if (vcard.company) vcardContent += `\nORG:${vcard.company}`;
    if (vcard.title) vcardContent += `\nTITLE:${vcard.title}`;
    if (vcard.website) vcardContent += `\nURL:${vcard.website}`;
    if (vcard.address) vcardContent += `\nADR:;;${vcard.address};;;;`;

    vcardContent += `\nEND:VCARD`;

    // Return as .vcf file
    const fileName = fullName.replace(/\s+/g, "_") || "contact";
    
    return new Response(vcardContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}.vcf"`,
      },
    });
  } catch (error) {
    console.error("Error serving vCard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
