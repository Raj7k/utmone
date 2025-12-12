import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Bot User Agents to detect
const AI_BOT_AGENTS = [
  'GPTBot',
  'ChatGPT-User', 
  'PerplexityBot',
  'ClaudeBot',
  'Google-Extended',
  'Googlebot',
  'anthropic-ai',
  'CCBot',
  'FacebookBot',
  'Bytespider',
];

interface SentinelConfig {
  inventory_check?: {
    enabled: boolean;
    shopify_sku?: string;
    threshold?: number;
    fallback_url?: string;
    fallback_type?: 'category' | 'similar' | 'custom';
  };
  health_preflight?: {
    enabled: boolean;
    timeout_ms?: number;
    fallback_url?: string;
  };
  ai_bot_mode?: {
    enabled: boolean;
    json_payload?: Record<string, unknown>;
  };
  auto_heal?: {
    enabled: boolean;
    sitemap_url?: string;
  };
}

interface SentinelRequest {
  link_id: string;
  destination_url: string;
  sentinel_config: SentinelConfig;
  workspace_id: string;
  user_agent?: string;
  visitor_info?: Record<string, unknown>;
}

interface SentinelResponse {
  redirect_to: string;
  save_recorded: boolean;
  save_type?: 'inventory' | 'health' | 'ai_bot' | 'auto_heal';
  serve_json?: boolean;
  json_payload?: Record<string, unknown>;
  check_details?: {
    health_status?: number;
    inventory_count?: number;
    is_ai_bot?: boolean;
    healed_from?: string;
  };
}

// Check if User-Agent is an AI bot
function isAIBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return AI_BOT_AGENTS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

// Perform health check on destination URL
async function checkDestinationHealth(
  url: string, 
  timeoutMs: number = 500
): Promise<{ healthy: boolean; status: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'utm.one-Sentinel/1.0 (Health Check)',
      },
    });
    clearTimeout(timeoutId);
    
    // Consider 2xx and 3xx as healthy
    const healthy = response.status >= 200 && response.status < 400;
    return { healthy, status: response.status };
  } catch {
    clearTimeout(timeoutId);
    console.error('Health check failed');
    return { healthy: false, status: 0 };
  }
}

// Check Shopify inventory (placeholder - requires OAuth integration)
async function checkShopifyInventory(
  _sku: string,
  _threshold: number,
  _workspaceId: string
): Promise<{ available: boolean; count: number }> {
  // TODO: Implement Shopify API integration in Phase 2
  // For now, return available to not block redirects
  console.log('Shopify inventory check - integration pending');
  return { available: true, count: 999 };
}

// Log sentinel save to database
async function logSentinelSave(
  supabaseUrl: string,
  supabaseKey: string,
  params: {
    link_id: string;
    workspace_id: string;
    save_type: string;
    original_destination: string;
    redirected_to: string;
    estimated_value?: number;
    visitor_info?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/sentinel_saves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        link_id: params.link_id,
        workspace_id: params.workspace_id,
        save_type: params.save_type,
        original_destination: params.original_destination,
        redirected_to: params.redirected_to,
        estimated_value: params.estimated_value || 0,
        visitor_info: params.visitor_info || {},
        metadata: params.metadata || {},
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to log sentinel save:', await response.text());
    } else {
      console.log(`Sentinel save recorded: ${params.save_type}`);
    }
  } catch (err) {
    console.error('Error logging sentinel save:', err);
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      link_id,
      destination_url,
      sentinel_config,
      workspace_id,
      user_agent,
      visitor_info,
    }: SentinelRequest = await req.json();

    console.log(`Sentinel guard activated for link: ${link_id}`);

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const response: SentinelResponse = {
      redirect_to: destination_url,
      save_recorded: false,
      check_details: {},
    };

    // ============================================
    // CHECK 1: AI Bot Detection (fastest check first)
    // ============================================
    if (sentinel_config.ai_bot_mode?.enabled && user_agent) {
      const isBot = isAIBot(user_agent);
      response.check_details!.is_ai_bot = isBot;

      if (isBot && sentinel_config.ai_bot_mode.json_payload) {
        console.log('AI bot detected, serving JSON payload');
        response.serve_json = true;
        response.json_payload = sentinel_config.ai_bot_mode.json_payload;
        response.save_type = 'ai_bot';
        response.save_recorded = true;

        // Log the save asynchronously
        logSentinelSave(supabaseUrl, supabaseKey, {
          link_id,
          workspace_id,
          save_type: 'ai_bot',
          original_destination: destination_url,
          redirected_to: 'JSON_PAYLOAD',
          visitor_info,
          metadata: { user_agent, payload_served: true },
        });

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // CHECK 2: Inventory Check (Shopify/Stripe)
    // ============================================
    if (sentinel_config.inventory_check?.enabled) {
      const { shopify_sku, threshold = 0, fallback_url, fallback_type } = 
        sentinel_config.inventory_check;

      if (shopify_sku) {
        const inventory = await checkShopifyInventory(
          shopify_sku, 
          threshold, 
          workspace_id
        );
        response.check_details!.inventory_count = inventory.count;

        if (!inventory.available || inventory.count <= threshold) {
          console.log(`Inventory low/out for SKU ${shopify_sku}: ${inventory.count}`);
          
          const redirectUrl = fallback_url || destination_url;
          response.redirect_to = redirectUrl;
          response.save_type = 'inventory';
          response.save_recorded = true;

          // Log the save
          logSentinelSave(supabaseUrl, supabaseKey, {
            link_id,
            workspace_id,
            save_type: 'inventory',
            original_destination: destination_url,
            redirected_to: redirectUrl,
            estimated_value: 2.5, // Default estimated value per click
            visitor_info,
            metadata: { 
              sku: shopify_sku, 
              inventory_count: inventory.count,
              threshold,
              fallback_type,
            },
          });

          return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ============================================
    // CHECK 3: Health Preflight (404/500 detection)
    // ============================================
    if (sentinel_config.health_preflight?.enabled) {
      const timeoutMs = sentinel_config.health_preflight.timeout_ms || 500;
      const health = await checkDestinationHealth(destination_url, timeoutMs);
      response.check_details!.health_status = health.status;

      if (!health.healthy) {
        console.log(`Destination unhealthy: ${destination_url} - Status: ${health.status}`);
        
        const fallbackUrl = sentinel_config.health_preflight.fallback_url;
        
        if (fallbackUrl) {
          response.redirect_to = fallbackUrl;
          response.save_type = 'health';
          response.save_recorded = true;

          // Log the save
          logSentinelSave(supabaseUrl, supabaseKey, {
            link_id,
            workspace_id,
            save_type: 'health',
            original_destination: destination_url,
            redirected_to: fallbackUrl,
            estimated_value: 3.0, // Saved from dead end
            visitor_info,
            metadata: { 
              original_status: health.status,
              error_type: health.status >= 500 ? 'server_error' : 
                          health.status === 404 ? 'not_found' : 'other',
            },
          });

          return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ============================================
    // CHECK 4: Auto-Heal (Sitemap Recovery)
    // ============================================
    // TODO: Implement in Phase 4
    // This will scan sitemap for semantic matches when destination is broken

    // All checks passed, return original destination
    console.log('Sentinel checks passed, proceeding with original destination');
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Sentinel guard error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // On error, fail open - return original destination
    return new Response(JSON.stringify({
      redirect_to: null,
      save_recorded: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
