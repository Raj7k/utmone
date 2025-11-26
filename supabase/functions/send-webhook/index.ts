import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to decrypt token
async function decryptToken(ciphertext: string): Promise<string> {
  const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    encryptedData
  );

  return decoder.decode(decrypted);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event, data, webhookUrl, secret, secretEncrypted } = await req.json();

    if (!event || !data || !webhookUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    // Decrypt secret if encrypted version is provided, otherwise use plaintext (for backward compatibility)
    let actualSecret = secret;
    if (secretEncrypted) {
      actualSecret = await decryptToken(secretEncrypted);
    }

    // Generate HMAC signature if secret is provided
    let signature = '';
    if (actualSecret) {
      signature = createHmac('sha256', actualSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
    }

    // Validate webhook URL to prevent SSRF attacks
    const allowedProtocols = ['https:', 'http:'];
    const parsedUrl = new URL(webhookUrl);
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook URL protocol. Only HTTP/HTTPS allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Block internal/private IP ranges (basic SSRF protection)
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(parsedUrl.hostname)) {
      return new Response(
        JSON.stringify({ error: 'Webhook URL cannot target internal hosts' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': payload.timestamp,
          'User-Agent': 'utm.one-webhook/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Webhook delivery failed:', await response.text());
        return new Response(
          JSON.stringify({ error: 'Webhook delivery failed', status: response.status }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Webhook fetch error:', fetchError);
      const message = fetchError instanceof Error ? fetchError.message : 'Webhook request failed';
      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
