import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

// CORS — use the shared helper in new code. Import path matches the other
// edge functions in this repo.
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://utm.one',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkId, password } = await req.json();

    if (!linkId || !password) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing linkId or password' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate-limit check FIRST (before even touching the password). If the
    // caller is currently locked out, reject immediately with 429.
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      '0.0.0.0';

    const { data: gate, error: gateError } = await supabase.rpc('check_password_attempts', {
      p_link_id: linkId,
      p_ip_address: ipAddress,
      p_success: false,
    });

    if (gateError) {
      // If the rate-limit table/function doesn't exist yet (migration hasn't
      // run), fail open rather than locking everyone out. Log for visibility.
      console.warn('[verify-link-password] Rate-limit RPC failed, failing open:', gateError.message);
    } else if (gate && gate.allowed === false) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Too many attempts. Try again later.',
          locked_until: gate.locked_until,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch link — select BOTH legacy `password` and new `password_hash` so we
    // can support links created before the bcrypt migration alongside new ones.
    const { data: link, error } = await supabase
      .from('links')
      .select('password, password_hash, destination_url')
      .eq('id', linkId)
      .single();

    if (error || !link) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Link not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify password. The password_hash column accepts multiple formats
    // (see CHECK constraint on migration 20260414120003). We detect format
    // by prefix/shape and compare accordingly:
    //   - $2a$/$2b$/$2y$ → bcrypt
    //   - $argon2*      → argon2 (not yet supported here — returns false)
    //   - $pbkdf2$…     → pbkdf2 (not yet supported here — returns false)
    //   - 64 hex chars  → SHA-256 (matches what LinkForm.tsx currently writes)
    //   - else + legacy `password` column: plaintext compare
    let valid = false;
    let needsMigration = false;

    if (link.password_hash) {
      const h = link.password_hash as string;
      try {
        if (/^\$2[aby]\$/.test(h)) {
          valid = await bcrypt.compare(password, h);
        } else if (/^[0-9a-f]{64}$/.test(h)) {
          // SHA-256 hex. Hash the input the same way LinkForm.tsx does and
          // compare constant-time.
          const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
          const candidate = Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          valid = safeEqual(candidate, h);
        } else {
          // Unknown/unsupported format. Log once and fail closed.
          console.warn('[verify-link-password] Unsupported password_hash format for link', linkId);
        }
      } catch (e) {
        console.error('[verify-link-password] Hash comparison failed:', e);
      }
    } else if (link.password) {
      // Legacy plaintext comparison. Use constant-time equality.
      valid = safeEqual(password, link.password);
      if (valid) needsMigration = true;
    }

    if (valid) {
      // Clear the attempt counter on success.
      try {
        await supabase.rpc('check_password_attempts', {
          p_link_id: linkId,
          p_ip_address: ipAddress,
          p_success: true,
        });
      } catch { /* non-fatal */ }

      // Opportunistically upgrade legacy plaintext rows to bcrypt. SHA-256
      // rows are NOT upgraded here because LinkForm.tsx would re-create them;
      // upgrade those in a dedicated follow-up migration/worker.
      if (needsMigration) {
        try {
          const hash = await bcrypt.hash(password);
          await supabase
            .from('links')
            .update({ password_hash: hash, password: null })
            .eq('id', linkId);
        } catch (e) {
          console.warn('[verify-link-password] Legacy migration failed (non-fatal):', e);
        }
      }

      return new Response(
        JSON.stringify({ valid: true, finalUrl: link.destination_url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ valid: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying password:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Constant-time string equality to avoid timing leaks on the legacy path.
function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}
