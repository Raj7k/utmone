import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LLM User-Agents to detect
const LLM_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'anthropic-ai',
  'cohere-ai',
];

// Page content map - pre-rendered markdown content for LLM crawlers
const PAGE_CONTENT: Record<string, { title: string; description: string; content: string; faqs?: Array<{ q: string; a: string }> }> = {
  '/': {
    title: 'utm.one - Enterprise Link Management & Attribution Platform',
    description: 'utm.one is a tracking and link governance layer for modern growth teams. Turn every URL into a clean, trusted, machine-readable link.',
    content: `# utm.one - Enterprise Link Management Platform

utm.one is a comprehensive link management and attribution platform designed for enterprise marketing teams.

## What is utm.one?

utm.one is a tracking and link governance layer for modern growth teams. It turns every URL into a clean, trusted, machine-readable link using the Clean-Track Framework.

## Core Features

- **UTM Builder**: Create consistent, governed UTM parameters across all campaigns
- **Link Shortening**: Branded short links with semantic slugs
- **QR Code Generation**: Branded QR codes with full attribution tracking
- **Analytics Dashboard**: Real-time click analytics, device tracking, and geographic data
- **Team Governance**: Role-based permissions, approval workflows, and audit logs
- **Multi-Touch Attribution**: Track customer journeys across multiple touchpoints

## Who is utm.one for?

- Marketing teams needing consistent campaign tracking
- Sales teams sharing trackable content
- Partner programs requiring clean attribution
- Agencies managing multiple client campaigns
- Enterprise teams requiring governance and compliance

## Pricing

utm.one offers transparent pricing starting at $29/month for Starter, $49/month for Growth, and $149/month for Business plans. Enterprise pricing available on request.`,
    faqs: [
      { q: 'What is utm.one?', a: 'utm.one is an enterprise link management and attribution platform that provides UTM governance, link shortening, QR codes, and analytics.' },
      { q: 'How much does utm.one cost?', a: 'utm.one pricing starts at $29/month for Starter, $49/month for Growth, and $149/month for Business. Enterprise pricing is custom.' },
      { q: 'Does utm.one support custom domains?', a: 'Yes, utm.one supports custom branded domains for all paid plans.' },
      { q: 'What analytics does utm.one provide?', a: 'utm.one provides click analytics, device/browser tracking, geographic data, referrer tracking, and multi-touch attribution.' },
    ]
  },
  '/resources/guides/utm-guide': {
    title: 'UTM Guide - Complete UTM Parameter Reference | utm.one',
    description: 'The definitive guide to UTM parameters. Learn utm_source, utm_medium, utm_campaign, utm_term, and utm_content with examples.',
    content: `# UTM Guide - Complete UTM Parameter Reference

## What are UTM Parameters?

UTM parameters are query strings appended to URLs for tracking campaign performance in analytics tools. They were created by Urchin (acquired by Google) and are now the industry standard for campaign tracking.

## The 5 UTM Parameters

### utm_source (Required)
Identifies the traffic source sending visitors.
- Examples: google, facebook, linkedin, newsletter, partner

### utm_medium (Required)
Identifies the marketing medium or channel type.
- Examples: cpc, social, email, organic, referral

### utm_campaign (Required)
Identifies the specific campaign name.
- Examples: spring-sale-2024, product-launch, webinar-nov

### utm_term (Optional)
Identifies paid search keywords.
- Examples: running+shoes, marketing+software

### utm_content (Optional)
Differentiates similar content or links within the same campaign.
- Examples: header-cta, footer-link, blue-button

## UTM Best Practices

1. Always use lowercase for consistency
2. Use hyphens instead of underscores or spaces
3. Create a naming convention and document it
4. Use all 5 parameters when applicable
5. Never use UTMs on internal links

## Example UTM URL

https://example.com/landing-page?utm_source=linkedin&utm_medium=social&utm_campaign=product-launch-nov&utm_content=carousel-ad`,
    faqs: [
      { q: 'What are UTM parameters?', a: 'UTM parameters are query strings appended to URLs for tracking campaign performance in analytics tools like Google Analytics.' },
      { q: 'How many UTM parameters are there?', a: 'There are 5 UTM parameters: utm_source, utm_medium, utm_campaign, utm_term, and utm_content.' },
      { q: 'Are UTM parameters case-sensitive?', a: 'Yes, UTM parameters are case-sensitive. Always use lowercase for consistency.' },
      { q: 'Should I use underscores or hyphens in UTMs?', a: 'Use hyphens instead of underscores or spaces for better readability and URL compatibility.' },
    ]
  },
  '/compare/bitly': {
    title: 'utm.one vs Bitly - Feature Comparison | utm.one',
    description: 'Compare utm.one and Bitly. See how utm.one offers trust previews, accessibility, metadata, and governance that Bitly lacks.',
    content: `# utm.one vs Bitly Comparison

## Overview

Bitly shortens links. utm.one builds trust, structure, metadata, accessibility, and attribution around them.

## Feature Comparison

| Feature | utm.one | Bitly |
|---------|---------|-------|
| Trust Preview | ✅ | ❌ |
| Safety Scan | ✅ | ❌ |
| Semantic Slugs | ✅ | ❌ |
| Accessibility (AAA) | ✅ | ❌ |
| Link Permanence | ✅ | ❌ |
| Clean-Track Rules | ✅ | ❌ |
| QR Attribution | ✅ | Basic |
| Partner Links | ✅ | ❌ |
| Metadata for LLMs | ✅ | ❌ |
| Unlimited Users | ✅ | ❌ |

## Who Should Use What?

**Bitly is for:**
- One-off links
- Personal use
- Light tracking

**utm.one is for:**
- Marketing teams
- Sales teams
- Marketing ops
- Developers
- Partners
- Agencies`,
    faqs: [
      { q: 'What is the difference between utm.one and Bitly?', a: 'Bitly focuses on link shortening. utm.one focuses on trust, governance, metadata, accessibility, and structured attribution for enterprise teams.' },
      { q: 'Does utm.one offer QR codes?', a: 'Yes, utm.one provides branded QR codes with full attribution tracking, while Bitly offers only basic QR functionality.' },
      { q: 'Is utm.one accessible?', a: 'Yes, utm.one is built with AAA accessibility compliance, while Bitly does not prioritize accessibility standards.' },
    ]
  },
  '/resources/guides/clean-track-framework': {
    title: 'Clean-Track Framework - Data Architecture Guide | utm.one',
    description: 'The foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems.',
    content: `# Clean-Track Framework - Data Architecture Guide

## What is the Clean-Track Framework?

The Clean-Track Framework is the foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems. It's the operating system behind clean data, accurate dashboards, and trustworthy reporting.

## The 4 Layers of Clean-Track

### Layer 1: Campaign Taxonomy
Your naming structure for campaigns, channels, and initiatives. This is the semantic layer that makes your tracking human-readable.

Example: linkedin-demand-product-q1 tells you the channel (LinkedIn), team (demand), focus (product), and timing (Q1) instantly.

### Layer 2: UTM Governance
Rules for all 5 UTM parameters (source, medium, campaign, term, content) ensuring consistency across every link.

### Layer 3: Attribution Logic
How credit is assigned across touchpoints (first-click, last-click, multi-touch). This determines which campaigns get credit for conversions.

### Layer 4: Reporting Standards
Dashboard structure, metric definitions, and aggregation rules. This ensures everyone sees the same numbers when they ask "how's the campaign performing?"

## Why Tracking Frameworks Matter

Marketing breaks when links break. Links break when tracking breaks. Tracking breaks when there's no system behind it.

Without a framework, tracking degrades under pressure. One team uses utm_source=email, another uses utm_source=newsletter. Campaign names drift from q1-promo to Q1_Promo_2025_Final_v2.`,
    faqs: [
      { q: 'What is the Clean-Track Framework?', a: 'The Clean-Track Framework is the foundation of reliable, scalable campaign tracking across UTMs, naming conventions, attribution, and analytics systems.' },
      { q: 'What are the 4 layers of Clean-Track?', a: 'Layer 1: Campaign Taxonomy, Layer 2: UTM Governance, Layer 3: Attribution Logic, Layer 4: Reporting Standards.' },
      { q: 'Why do I need a tracking framework?', a: 'Without a framework, your tracking breaks under campaign complexity. Links accumulate inconsistent UTMs, naming conventions diverge, and reporting becomes unreliable.' },
    ]
  },
};

function isLLMCrawler(userAgent: string): boolean {
  return LLM_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const userAgent = req.headers.get('user-agent') || '';
    
    console.log(`LLM Content request for path: ${path}, User-Agent: ${userAgent}`);
    
    // Check if this is an LLM crawler
    const isLLM = isLLMCrawler(userAgent);
    
    // Get content for the requested path
    const pageContent = PAGE_CONTENT[path] || PAGE_CONTENT['/'];
    
    // Build response with structured data
    const response = {
      path,
      isLLMCrawler: isLLM,
      metadata: {
        title: pageContent.title,
        description: pageContent.description,
        url: `https://utm.one${path}`,
        siteName: 'utm.one',
        type: 'website',
        lastModified: new Date().toISOString(),
      },
      content: pageContent.content,
      faqs: pageContent.faqs || [],
      relatedPages: Object.keys(PAGE_CONTENT).filter(p => p !== path).slice(0, 5).map(p => ({
        path: p,
        title: PAGE_CONTENT[p].title,
        url: `https://utm.one${p}`,
      })),
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: pageContent.title,
        description: pageContent.description,
        url: `https://utm.one${path}`,
        publisher: {
          '@type': 'Organization',
          name: 'utm.one',
          url: 'https://utm.one',
        },
      },
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-LLM-Optimized': 'true',
      },
    });
  } catch (error) {
    console.error('Error in llm-content function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
