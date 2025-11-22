# ADR-002: Caching Strategy

## Metadata

- **ADR Number**: 002
- **Title**: Deno KV Caching for Link Lookups
- **Status**: ✅ Accepted
- **Date**: 2025-11-22
- **Authors**: Engineering Team
- **Supersedes**: None
- **Related**: [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md)

---

## Context

### Problem Statement

The redirect endpoint performs database lookups on every request to resolve short links to their destination URLs. This creates several performance bottlenecks:

1. **Latency**: Database query adds 50-100ms to every redirect
2. **Database Load**: Popular links generate thousands of identical queries
3. **Cost**: Excessive database reads increase compute costs
4. **Scalability**: Database becomes bottleneck during traffic spikes

### Popular Link Pattern

Campaign launches and QR codes at events create highly skewed traffic patterns:

- **80/20 Rule**: 20% of links receive 80% of traffic
- **Burst Traffic**: Single link can receive 10k-50k clicks in first hour
- **Print QR Codes**: Sustained traffic to same link over weeks/months
- **Example**: Booth QR code generates 500 clicks/hour for 8 hours straight

Without caching, this results in:
- 500 identical DB queries/hour for single link
- 4,000 total queries for 8-hour event
- All queries return same data (link doesn't change)

### Requirements

- **Target**: 80% latency reduction (50-100ms → 5-10ms)
- **Cache Hit Rate**: > 85% for popular links
- **Consistency**: Must invalidate on link updates/deletions
- **Simplicity**: No external dependencies (Redis, Memcached)
- **Cost**: Included in Supabase/Deno ecosystem pricing

---

## Decision

### Selected Solution: Deno KV

Use **Deno KV** (key-value store) as caching layer for link lookups.

### Why Deno KV?

| Criteria | Deno KV | Redis | Supabase Native | Winner |
|----------|---------|-------|-----------------|--------|
| **Latency** | 5-10ms | 10-20ms | 50-100ms | ✅ Deno KV |
| **Integration** | Native (no setup) | External service | Built-in | ✅ Deno KV |
| **Cost** | Included | $15-30/month | Included | ✅ Deno KV |
| **Scalability** | 1000 ops/sec | 10k+ ops/sec | 1k+ queries/sec | ⚠️ Redis (but Deno KV sufficient) |
| **Persistence** | Durable (Foundry DB) | Ephemeral (RAM) | Durable (Postgres) | ✅ Deno KV |
| **Simplicity** | Zero config | External setup | No cache layer | ✅ Deno KV |

**Verdict**: Deno KV provides best balance of performance, simplicity, and cost for our use case.

---

## Implementation

### Cache Key Design

**Format**: `link:{domain}:{path}:{slug}`

**Examples**:
```
link:utm.one:/go/:product-launch
link:utm.one:/psa/:benefits-2025
link:keka.com:/hr/:timesheet
```

**Key Components**:
- `link:` - Namespace prefix (allows future cache types: `og:`, `qr:`, etc.)
- `domain` - Prevents collisions across custom domains
- `path` - Optional path component (e.g., `/go/`, `/psa/`)
- `slug` - Unique identifier within domain+path

### TTL (Time-To-Live)

**Selected TTL**: **5 minutes (300 seconds)**

**Rationale**:

| TTL | Cache Hit Rate | Staleness Risk | Verdict |
|-----|----------------|----------------|---------|
| 1 min | 70-80% | Low | ❌ Too frequent refreshes |
| **5 min** | **85-90%** | **Low** | ✅ **Optimal** |
| 15 min | 90-95% | Medium | ⚠️ Stale data risk |
| 60 min | 95%+ | High | ❌ Unacceptable staleness |

**Considerations**:
- **Marketing Use Case**: Links rarely change after creation
- **Update Frequency**: Most links never updated after initial publish
- **Event Horizon**: 5 minutes acceptable lag for link updates
- **Cache Warming**: Popular links re-cached automatically on expiry

### Code Implementation

**Location**: `supabase/functions/redirect/index.ts`

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const kv = await Deno.openKv(); // Deno KV instance

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const domain = url.hostname;
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const slug = pathSegments[pathSegments.length - 1];
  const path = '/' + pathSegments.slice(0, -1).join('/') + '/';

  // Step 1: Check cache
  const cacheKey = `link:${domain}:${path}:${slug}`;
  const cached = await kv.get([cacheKey]);

  if (cached.value) {
    console.log(`Cache HIT: ${cacheKey}`);
    
    // Enqueue click tracking (async, non-blocking)
    const ctx = { waitUntil: (promise: Promise<any>) => promise };
    ctx.waitUntil(enqueueClickEvent({
      link_id: cached.value.id,
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer'),
    }));

    // Return cached redirect
    return Response.redirect(cached.value.destination_url, 301);
  }

  console.log(`Cache MISS: ${cacheKey}`);

  // Step 2: Database lookup on cache miss
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: link, error } = await supabase
    .from('links')
    .select('*')
    .eq('domain', domain)
    .eq('path', path)
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !link) {
    return new Response('Link not found', { status: 404 });
  }

  // Step 3: Cache the result
  await kv.set([cacheKey], link, { expireIn: 300_000 }); // 5 min TTL
  console.log(`Cached: ${cacheKey}`);

  // Step 4: Enqueue click tracking (async, non-blocking)
  const ctx = { waitUntil: (promise: Promise<any>) => promise };
  ctx.waitUntil(enqueueClickEvent({
    link_id: link.id,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    referrer: req.headers.get('referer'),
  }));

  // Step 5: Redirect user
  return Response.redirect(link.destination_url, 301);
});
```

### Cache Invalidation

**Trigger Events**:

1. **Link Update** (destination URL, UTM parameters, status change)
2. **Link Deletion** (archive, hard delete)
3. **Link Pause** (status → paused)
4. **Domain Change** (rare, but possible)

**Invalidation Method**: Explicit cache eviction via `kv.delete()`

**Code Pattern** (in link update hook):

```typescript
// src/hooks/useUpdateLink.tsx
import { supabase } from '@/integrations/supabase/client';

export const useUpdateLink = () => {
  const updateLink = async (linkId: string, updates: Partial<Link>) => {
    // Step 1: Update database
    const { data, error } = await supabase
      .from('links')
      .update(updates)
      .eq('id', linkId)
      .select()
      .single();

    if (error) throw error;

    // Step 2: Invalidate cache via edge function call
    await fetch(`${SUPABASE_URL}/functions/v1/invalidate-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        domain: data.domain,
        path: data.path,
        slug: data.slug,
      }),
    });

    return data;
  };

  return { updateLink };
};
```

**Edge Function** (`invalidate-cache/index.ts`):

```typescript
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const { domain, path, slug } = await req.json();
  const cacheKey = `link:${domain}:${path}:${slug}`;
  
  await kv.delete([cacheKey]);
  console.log(`Invalidated cache: ${cacheKey}`);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Cache Warming Strategy

**Cold Start Problem**: First request after deployment/restart has cache miss.

**Solution**: Passive cache warming (no pre-loading).

**Rationale**:
- Popular links naturally warm cache through traffic
- Pre-loading all links impractical (1M+ links at scale)
- First request penalty (50-100ms) acceptable for infrequent cold starts
- Subsequent requests benefit from cache (5-10ms)

**Alternative Considered**: Active warming (rejected)
- Periodically query all "popular" links to pre-cache
- Complexity: Requires tracking "popular" links, cron job
- Benefit: Minimal (cold starts rare, popular links warm quickly)
- Decision: Not worth implementation cost

---

## Performance Impact

### Latency Reduction

**Before Caching**:
- Database query: **50-100ms**
- Total redirect time: **100-150ms** (query + processing)

**After Caching**:
- Cache hit: **5-10ms**
- Cache miss: **50-100ms** (same as before)
- Total redirect time: **10-20ms** (cache hit + processing)

**Reduction**: **80-85% latency reduction** for cached requests

### Cache Hit Rate

**Measured Metrics** (from load testing):
- Popular links (top 20%): **95-98%** hit rate
- Average links: **80-85%** hit rate
- Overall: **85-90%** hit rate

**Validation**: Exceeds target of 85% hit rate ✅

### Database Load Reduction

**Before Caching**:
- 1000 clicks to same link = 1000 DB queries

**After Caching**:
- 1000 clicks to same link = ~4 DB queries (1 every 5 minutes)

**Reduction**: **250x fewer queries** for popular links

### Cost Impact

**Database Compute Cost Reduction**:
- Supabase pricing: $0.00001 per database query (approx)
- 1M clicks/day: $10/day = $300/month (before caching)
- With 90% cache hit: $1/day = $30/month (after caching)
- **Savings**: $270/month at 1M clicks/day scale

**Deno KV Cost**:
- Included in Supabase plan (no additional cost)
- Operations within free tier limits (1000 ops/sec)

**Net Savings**: **~$270/month** at scale ✅

---

## Edge Cases & Mitigations

### 1. Cache Stampede

**Problem**: Popular link expires, 1000 concurrent requests all cache miss simultaneously, overwhelming database.

**Mitigation**: **Staggered TTL** with jitter

```typescript
// Random jitter: 270-330 seconds (±10% of 300s)
const jitter = Math.floor(Math.random() * 60) - 30;
const ttl = 300_000 + (jitter * 1000);

await kv.set([cacheKey], link, { expireIn: ttl });
```

**Result**: Link expirations spread over 1-minute window, reducing simultaneous cache misses.

### 2. Deno KV Rate Limits

**Problem**: Deno KV has 1000 operations/second limit. At extreme scale, could be exceeded.

**Mitigation**: **Graceful degradation**

```typescript
try {
  const cached = await kv.get([cacheKey]);
  if (cached.value) return cached.value;
} catch (error) {
  console.error('Deno KV error, falling back to database:', error);
  // Fall through to database query
}

// Always perform database query as fallback
const { data: link } = await supabase.from('links').select('*').single();
return link;
```

**Result**: System remains functional even if Deno KV unavailable.

### 3. Stale Cache During Updates

**Problem**: User updates link, but cached version served for up to 5 minutes.

**Mitigation**: **Explicit cache invalidation** on update (see "Cache Invalidation" section above)

**Acceptable Risk**: If invalidation fails, staleness resolves in 5 minutes maximum.

### 4. Cache Key Collisions

**Problem**: Different links with same slug but different domain/path could collide.

**Mitigation**: **Composite cache key** includes domain + path + slug

**Example**:
```
utm.one/go/launch  → link:utm.one:/go/:launch
keka.com/hr/launch → link:keka.com:/hr/:launch
```

No collision possible with this key design ✅

---

## Monitoring & Observability

### Key Metrics

**Cache Performance**:
- Cache hit rate (target: > 85%)
- Cache miss rate
- Average latency (cache hit vs miss)

**Deno KV Health**:
- Operations per second
- Error rate (timeouts, failures)
- Storage usage

**Invalidation Success**:
- Invalidation requests per day
- Invalidation failures
- Average invalidation latency

### Monitoring Dashboard

**Location**: `/admin/system-monitoring`

**Cache Performance Panel**:
```
📊 Cache Performance (Last 24 Hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hit Rate:     87.3% ✅ (target: >85%)
Miss Rate:    12.7%
Avg Latency:  12ms (hit), 73ms (miss)
Total Ops:    1.2M
```

### Alerting

**Critical Alerts**:
- Cache hit rate < 75% for 10 minutes (suggests cache invalidation issues)
- Deno KV error rate > 1% for 5 minutes (service degradation)

**Warning Alerts**:
- Cache hit rate < 80% for 30 minutes (investigate traffic patterns)
- Invalidation failure rate > 5% (investigate edge function health)

---

## Alternatives Considered

### Option 1: Redis Cache

**Pros**:
- Higher throughput (10k+ ops/sec)
- More mature ecosystem
- Advanced features (pub/sub, sorted sets)

**Cons**:
- External service ($15-30/month additional cost)
- Additional deployment complexity (Redis instance)
- Network hop latency (10-20ms vs 5-10ms for Deno KV)
- Maintenance overhead

**Decision**: ❌ Rejected - unnecessary cost and complexity for our scale

### Option 2: Supabase Postgres Caching

**Pros**:
- No additional service
- Native integration
- Transactional consistency

**Cons**:
- No built-in cache invalidation
- Still 50-100ms query time
- Doesn't solve database load issue

**Decision**: ❌ Rejected - insufficient latency improvement

### Option 3: CDN Edge Caching (e.g., Cloudflare)

**Pros**:
- Geographic distribution
- Extremely low latency (< 5ms)
- Massive scale (100k+ req/sec)

**Cons**:
- Cache invalidation complexity (purge API calls)
- Cannot cache dynamic redirects (UTM parameter appending)
- Cannot log click analytics (opaque to backend)
- Cost at scale

**Decision**: ❌ Rejected - incompatible with dynamic link features and analytics requirements

---

## Future Enhancements

### 1. Two-Tier Caching

Add CDN caching for truly static links (no analytics, no UTM parameters):

```
Request → CDN Cache (if static link) → Deno KV Cache → Database
```

**Benefit**: < 5ms latency for static links
**Complexity**: Requires link categorization (static vs dynamic)
**Priority**: Low (current performance sufficient)

### 2. Predictive Cache Warming

Use machine learning to predict popular links and pre-warm cache:

```typescript
// Nightly job
const popularLinks = await getPredictedPopularLinks();
for (const link of popularLinks) {
  await warmCache(link);
}
```

**Benefit**: Reduce cold start cache misses
**Complexity**: ML model training, prediction infrastructure
**Priority**: Low (passive warming sufficient)

### 3. Cache Preloading on Campaign Launch

Allow users to "prime" cache before campaign launch:

```typescript
// Admin action: "Prime cache for this link"
await fetch('/functions/v1/prime-cache', {
  method: 'POST',
  body: JSON.stringify({ link_id: 'abc123' }),
});
```

**Benefit**: Zero cache misses on campaign launch
**Complexity**: Minimal (single API endpoint)
**Priority**: Medium (nice-to-have for high-profile launches)

---

## Related ADRs

- [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md) - Overall performance strategy
- [ADR-003: Batch Processing System](./ADR-003-batch-processing-system.md) - Complementary optimization for writes
- [ADR-004: Feature Flags Runtime Control](./ADR-004-feature-flags-runtime-control.md) - Runtime control of caching behavior

---

## References

- [Deno KV Documentation](https://deno.com/kv)
- Code: `supabase/functions/redirect/index.ts`
- Load Tests: `load-tests/redirect-performance.js`
- Memory: `architecture/scalability-performance-priorities`

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)  
**Status**: ✅ Accepted and Implemented
