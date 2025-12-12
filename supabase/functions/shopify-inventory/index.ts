import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Shopify Admin API configuration
const SHOPIFY_STORE_DOMAIN = 'utmone-6110i.myshopify.com';
const SHOPIFY_API_VERSION = '2025-01';

interface InventoryCheckRequest {
  sku: string;
  threshold?: number;
  workspace_id: string;
}

interface InventoryCheckResponse {
  available: boolean;
  quantity: number;
  sku: string;
  product_title?: string;
  variant_title?: string;
  error?: string;
}

// GraphQL query to find product by SKU
const FIND_PRODUCT_BY_SKU_QUERY = `
  query findProductBySKU($query: String!) {
    productVariants(first: 1, query: $query) {
      edges {
        node {
          id
          sku
          title
          inventoryQuantity
          product {
            id
            title
            handle
          }
        }
      }
    }
  }
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sku, threshold = 0, workspace_id }: InventoryCheckRequest = await req.json();

    if (!sku) {
      return new Response(JSON.stringify({
        available: false,
        quantity: 0,
        sku: '',
        error: 'SKU is required',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Checking inventory for SKU: ${sku}, threshold: ${threshold}`);

    // Get Shopify Admin API token from workspace integrations
    // For now, use the storefront token (in production, would use Admin API token)
    const shopifyToken = Deno.env.get('SHOPIFY_ADMIN_TOKEN');
    
    if (!shopifyToken) {
      console.log('Shopify Admin token not configured, returning mock data');
      // Return mock available data when not configured
      return new Response(JSON.stringify({
        available: true,
        quantity: 999,
        sku,
        error: 'Shopify integration not configured - using fallback',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query Shopify Admin API for inventory
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyToken,
        },
        body: JSON.stringify({
          query: FIND_PRODUCT_BY_SKU_QUERY,
          variables: {
            query: `sku:${sku}`,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Shopify API error:', response.status);
      return new Response(JSON.stringify({
        available: true, // Fail open
        quantity: 999,
        sku,
        error: `Shopify API error: ${response.status}`,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return new Response(JSON.stringify({
        available: true, // Fail open
        quantity: 999,
        sku,
        error: data.errors[0]?.message || 'GraphQL error',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const variants = data.data?.productVariants?.edges || [];
    
    if (variants.length === 0) {
      console.log(`SKU ${sku} not found in Shopify`);
      return new Response(JSON.stringify({
        available: true, // Fail open if product not found
        quantity: 0,
        sku,
        error: 'Product SKU not found',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const variant = variants[0].node;
    const quantity = variant.inventoryQuantity || 0;
    const available = quantity > threshold;

    console.log(`SKU ${sku}: quantity=${quantity}, threshold=${threshold}, available=${available}`);

    const result: InventoryCheckResponse = {
      available,
      quantity,
      sku,
      product_title: variant.product?.title,
      variant_title: variant.title,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Inventory check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Fail open on errors
    return new Response(JSON.stringify({
      available: true,
      quantity: 999,
      sku: '',
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
