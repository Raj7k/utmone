/**
 * Cloudflare Worker for utm.one
 * Routes all short link requests to Supabase edge function
 * 
 * Deploy this to Cloudflare Workers and configure utm.one DNS to point to Cloudflare
 */

const SUPABASE_FUNCTION_URL = 'https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/redirect';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Extract the full path (e.g., /test or /go/test from utm.one/test or utm.one/go/test)
  const pathname = url.pathname;
  
  // If no path (root domain), handle appropriately
  if (!pathname || pathname === '/') {
    // utm.one and go.utm.one redirect to main site
    if (url.hostname === 'utm.one' || url.hostname === 'go.utm.one') {
      return Response.redirect('https://utm.one', 302);
    }
    // Custom domains show 404 at root (short links require a slug)
    return new Response('Short link not found. Links require a path (e.g., yourdomain.com/slug)', { status: 404 });
  }
  
  // Forward to Supabase edge function with the same path
  // Add X-Original-Domain header so edge function knows the original domain
  const supabaseUrl = `${SUPABASE_FUNCTION_URL}${pathname}`;
  
  try {
    const response = await fetch(supabaseUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects - pass them through
      headers: {
        'User-Agent': request.headers.get('User-Agent') || '',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'Referer': request.headers.get('Referer') || '',
        'X-Original-Domain': url.hostname, // Pass original domain
      },
    });
    
    // Return response directly (redirects will be followed by browser)
    return response;
    
  } catch (error) {
    console.error('Error forwarding request:', error);
    return new Response('Link not found', { status: 404 });
  }
}
