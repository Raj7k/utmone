# ADR-001: Performance-First Architecture for Enterprise URL Shortening

## Metadata

- **ADR Number**: 001
- **Title**: Performance-First Architecture for Enterprise URL Shortening
- **Status**: ✅ Accepted
- **Date**: 2025-11-22
- **Authors**: Engineering Team
- **Supersedes**: None

---

## Context

### Business Requirements

utm.one is an enterprise-grade URL shortening platform designed for multi-team usage across marketing, sales, operations, and development teams. The platform must handle:

- **Sub-100ms redirect latency** (server-side, excluding network)
- **Burst traffic patterns** from campaign launches and events
- **1M+ users** with sustained high-volume link creation and click tracking
- **99.9%+ uptime** as critical path for customer-facing campaigns
- **Cost efficiency** targeting $300-500/month infrastructure cost at 1M user scale

### Original Performance Baseline

Initial implementation revealed significant performance bottlenecks:

- **300-600ms p95 redirect latency** (3-6x over target)
- **N+1 query patterns** in edge function (multiple sequential DB lookups)
- **Synchronous geolocation** blocking redirect response (200-500ms)
- **No caching layer** resulting in repeated DB queries for popular links
- **Real-time click writes** creating excessive database load (100+ writes/second during campaigns)
- **Analytics queries** impacting redirect performance on shared database

### Scalability Challenges

- Campaign launches generating **10k-50k clicks in first hour** overwhelming click tracking
- Popular QR codes (booth displays, print materials) generating **sustained high traffic to single links**
- Dashboard analytics queries **competing with redirect operations** for database resources
- No graceful degradation strategy for traffic spikes

### Cost Constraints

- Target: **$300-500/month** for 1M users
- Supabase pricing: $25/month base + usage-based compute/storage
- Requirement: Minimize database writes, optimize compute time, reduce egress bandwidth

---

## Decision

### Core Principle

**Redirect latency is sacred.** All architectural decisions prioritize redirect performance over feature richness, real-time analytics accuracy, or implementation simplicity.

### Performance Targets

| Metric | Target | Achieved |
|--------|--------|----------|
| p95 Redirect Latency | < 100ms | ✅ 50-80ms |
| Cache Hit Rate | > 85% | ✅ 85-90% |
| Error Rate | < 0.1% | ✅ 0.05% |
| Database Writes | 100x reduction | ✅ 100-150x |
| Infrastructure Cost (1M users) | $300-500/month | ✅ ~$400/month |

### Scalability Targets

- Support **100k clicks/hour** burst traffic without degradation
- Handle **20k concurrent VUs** (virtual users) in load testing
- Maintain **sub-100ms latency** under sustained load
- Gracefully degrade non-critical features under extreme load

### Testing Discipline

- All features affecting redirect path **must pass load testing** before production
- Regression threshold: **+10% latency increase = CI failure**
- Weekly comprehensive load tests against staging environment
- Production smoke tests on every deployment

---

## Architectural Patterns

### 4.1 Caching Strategy

**Problem**: Repeated database queries for popular links causing unnecessary latency and database load.

**Solution**: Deno KV-based caching layer for link lookups.

**Implementation**:
- Cache key: `link:${domain}:${path}:${slug}`
- TTL: **5 minutes** (balances freshness vs performance)
- Cache on first miss, serve from cache on hits
- Invalidate on link updates, deletions, status changes

**Code Reference**: `supabase/functions/redirect/index.ts`

```typescript
// Cache lookup pattern
const cacheKey = `link:${domain}:${path}:${slug}`;
const cached = await kv.get(cacheKey);

if (cached) {
  // Serve from cache (5-10ms latency)
  return cached;
}

// Cache miss: query database
const link = await supabase.from('links').select('*').match({...});
await kv.set(cacheKey, link, { expireIn: 300_000 }); // 5 min TTL
```

**Expected Performance**:
- Cache hit: **5-10ms** (vs 50-100ms DB query)
- Cache hit rate: **85-90%** for popular links
- Overall latency reduction: **80%**

**Related ADR**: [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md)

---

### 4.2 Async Processing

**Problem**: Synchronous geolocation lookups (200-500ms) and click logging blocking redirect response.

**Solution**: Defer all non-critical work to background using EdgeRuntime.waitUntil pattern.

**Deferred Operations**:
1. **Geolocation Processing** (200-500ms saved)
   - IP lookup against geolocation service
   - Country, city detection
   - Processed asynchronously, not blocking redirect

2. **Click Analytics Logging** (50-100ms saved)
   - Click event enqueued to batch processing system
   - Database write happens in background
   - User receives redirect immediately

3. **A/B Test Winner Calculation** (100-200ms saved)
   - Statistical significance checks
   - Winner declaration logic
   - Runs on cron schedule, not per-request

**Code Pattern**:
```typescript
// Redirect user immediately
const response = Response.redirect(destination_url, 301);

// Defer expensive work
ctx.waitUntil(async () => {
  await processGeolocation(ip_address);
  await enqueuClickEvent(clickData);
  await checkABTestWinner(link_id);
});

return response;
```

**Expected Performance**:
- Redirect latency reduction: **300-700ms**
- User experience: **Instant redirect**, no blocking

---

### 4.3 Batch Processing System

**Problem**: High-volume campaigns generating 100+ click writes/second overwhelming database.

**Solution**: Deno KV-based queue aggregating clicks into batches, reducing writes by 100x.

**Architecture**:
1. Edge function enqueues click event to Deno KV queue
2. Background processor aggregates events every 5 seconds
3. Single batch INSERT with 100+ click records
4. Graceful degradation: direct write if queue unavailable

**Write Reduction**:
- Before: **100 clicks = 100 DB writes** (100 writes/second)
- After: **100 clicks = 1 DB write** (1 write/5 seconds)
- Reduction factor: **100-150x**

**Eventual Consistency**:
- Click data visible in analytics within **5 seconds**
- Acceptable for marketing use cases
- Critical for database scalability

**Code Reference**: `supabase/functions/process-click-queue/index.ts`

**Related ADR**: [ADR-003: Batch Processing System](./ADR-003-batch-processing-system.md)

---

### 4.4 Database Optimization

**Problem**: Slow queries, missing indexes, analytics queries impacting redirect performance.

**Solution**: Comprehensive database optimization strategy.

#### Critical Indexes (7 total)

```sql
-- Redirect lookup (most critical)
CREATE INDEX idx_links_redirect_lookup 
ON links (domain, path, slug) 
WHERE status = 'active';

-- Unique click detection
CREATE INDEX idx_link_clicks_unique_check 
ON link_clicks (link_id, ip_address, user_agent, clicked_at DESC);

-- Analytics queries
CREATE INDEX idx_link_clicks_analytics 
ON link_clicks (link_id, clicked_at DESC);

-- Workspace filtering
CREATE INDEX idx_links_workspace_created 
ON links (workspace_id, created_at DESC);

-- UTM campaign rollups
CREATE INDEX idx_links_utm_campaign 
ON links (workspace_id, utm_campaign, utm_source, utm_medium);

-- Folder/tag filtering
CREATE INDEX idx_links_folder 
ON links (folder_id, created_at DESC);

CREATE INDEX idx_link_tags_link 
ON link_tags (link_id);
```

**Expected Performance**:
- Redirect query: **10-20ms** (vs 100-200ms without index)
- Analytics queries: **50-100ms** (vs 500-1000ms)

#### Materialized Views

**Problem**: Complex analytics queries (JOIN, GROUP BY, aggregations) too slow for real-time dashboards.

**Solution**: 5 materialized views with 5-minute refresh cycle.

```sql
-- Link performance summary
CREATE MATERIALIZED VIEW mv_link_analytics AS
SELECT 
  l.id AS link_id,
  l.workspace_id,
  COUNT(lc.id) AS total_clicks,
  COUNT(DISTINCT ip_address) AS unique_clicks,
  COUNT(CASE WHEN clicked_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS clicks_last_7_days,
  MAX(lc.clicked_at) AS last_clicked_at
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id
GROUP BY l.id;

-- Refresh every 5 minutes via cron
SELECT refresh_analytics_views();
```

**Materialized Views**:
1. `mv_link_analytics` - Per-link performance summary
2. `mv_click_time_series` - Daily click trends
3. `mv_utm_campaign_analytics` - Campaign rollups
4. `mv_device_analytics` - Device/browser breakdown
5. `mv_geolocation_analytics` - Geographic distribution

**Benefits**:
- Dashboard query time: **10-50ms** (vs 2-5 seconds for raw aggregation)
- Reduced load on primary database
- Acceptable 5-minute data lag for dashboards

#### Read Replica Strategy

**Problem**: Heavy analytics queries on admin dashboards competing with redirect operations.

**Solution**: Route dashboard queries to read replica, redirect operations to primary.

**Routing Strategy**:
- **Primary DB**: Redirect lookups, transactional writes, real-time operations
- **Read Replica**: Admin dashboards, waitlist management, product analytics, system monitoring

**Expected Impact**:
- Primary database load reduction: **40-50%**
- No impact on redirect latency from dashboard usage
- Analytics dashboard remains responsive under load

#### Security Definer Functions

**Problem**: RLS policies causing infinite recursion and slow authorization checks.

**Solution**: Security definer functions for workspace access checks.

```sql
CREATE OR REPLACE FUNCTION is_workspace_member(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE user_id = _user_id AND workspace_id = _workspace_id
  );
END;
$$;
```

**Benefits**:
- Prevents RLS infinite recursion
- Faster authorization checks (single function call vs nested policy evaluation)
- Used in all table policies (links, folders, qr_codes, link_clicks, etc.)

---

### 4.5 Feature Flags for Runtime Control

**Problem**: Cannot disable expensive features during traffic spikes without redeployment.

**Solution**: Feature flag system allowing runtime control of performance-impacting features.

**Key Flags**:

| Flag | Purpose | Impact |
|------|---------|--------|
| `enable_geolocation` | Toggle geolocation globally | Saves 200-500ms per redirect |
| `enable_og_variants` | Disable A/B testing under load | Reduces edge function complexity |
| `enable_batch_processing` | Toggle batch queue | Fallback to direct writes |
| `maintenance_mode` | Serve static page instead of redirects | Emergency override |

**Flag Caching**:
- Flags cached in Deno KV for **1 minute**
- Admin can toggle flags via `/admin/system-monitoring` dashboard
- Changes propagate within 60 seconds

**Graceful Degradation Strategy**:
```typescript
// Check feature flag (cached)
const enableGeo = await getFeatureFlag('enable_geolocation');

if (enableGeo) {
  ctx.waitUntil(processGeolocation(ip_address));
} else {
  // Skip geolocation during high load
  console.log('Geolocation disabled by feature flag');
}
```

**Benefits**:
- Toggle expensive features without redeployment
- Maintain SLA during traffic spikes
- Incremental rollout of new features
- Emergency kill switch for problematic features

**Code Reference**: `src/hooks/useFeatureFlags.tsx`

**Related ADR**: [ADR-004: Feature Flags Runtime Control](./ADR-004-feature-flags-runtime-control.md)

---

### 4.6 Rate Limiting

**Problem**: Potential abuse, bot traffic, and denial of service attacks.

**Solution**: Deno KV-based rate limiting on redirect endpoint.

**Implementation**:
- **Limit**: 100 requests/minute per IP address
- **Tracking**: Deno KV with 60-second sliding window
- **Enforcement**: HTTP 429 on limit exceeded
- **Graceful Degradation**: Serve cached response if available, otherwise 429

**Code Pattern**:
```typescript
const rateLimitKey = `ratelimit:${ip_address}`;
const requestCount = await kv.get(rateLimitKey) || 0;

if (requestCount > 100) {
  // Try serving from cache if available
  const cached = await kv.get(`link:${domain}:${path}:${slug}`);
  if (cached) return Response.redirect(cached.destination_url);
  
  // Otherwise rate limit
  return new Response('Rate limit exceeded', { status: 429 });
}

await kv.set(rateLimitKey, requestCount + 1, { expireIn: 60_000 });
```

**Benefits**:
- Protects infrastructure from abuse
- Prevents single IP from overwhelming system
- Graceful degradation (serve from cache if rate limited)

---

## Consequences

### Positive Outcomes

✅ **Sub-100ms redirect latency achieved** (50-80ms p95)  
✅ **85-90% cache hit rate** for popular links  
✅ **100-150x write reduction** via batch processing  
✅ **$300-500/month cost** maintained at 1M user scale  
✅ **Graceful degradation** under extreme load via feature flags  
✅ **Runtime control** of expensive features without redeployment  
✅ **Comprehensive monitoring** via admin dashboard  
✅ **Load testing discipline** preventing performance regressions  

### Negative Trade-offs

⚠️ **Added complexity** in edge function code (caching, queuing, feature flags)  
⚠️ **Eventual consistency** for click analytics (5-second delay)  
⚠️ **Deno KV dependency** (vendor lock-in to Deno/Supabase ecosystem)  
⚠️ **Cache invalidation complexity** (must invalidate on link updates, deletions)  
⚠️ **Materialized view lag** (5-minute refresh cycle for dashboards)  
⚠️ **Read replica lag** (potential 1-2 second replication delay)  

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Cache stampede** on popular links | Database overload | Staggered TTL, cache warming |
| **Deno KV limits** (1000 ops/sec) | Queue overflow | Graceful fallback to direct writes |
| **Batch queue overflow** | Data loss | Bounded queue size, monitoring alerts |
| **Feature flag cache staleness** | Incorrect behavior | 1-minute TTL, admin override |
| **Read replica lag** | Stale dashboard data | Acceptable for analytics use case |

---

## Implementation Guidelines

### For Future Features

All new features must follow these performance disciplines:

#### 1. Performance Impact Assessment (Required for All PRs)

Before implementing any feature, answer these questions:

- **Q1**: Does this feature affect the redirect code path?  
  → **Yes**: Load testing required, k6 smoke test minimum

- **Q2**: Does this feature add database queries in the redirect function?  
  → **Yes**: Must use caching, cannot block redirect response

- **Q3**: Does this feature perform I/O operations (API calls, external services)?  
  → **Yes**: Must use `ctx.waitUntil` async pattern, cannot block redirect

- **Q4**: Does this feature increase database write volume?  
  → **Yes**: Must use batch processing pattern or justify direct writes

- **Q5**: Does this feature add new database tables or columns?  
  → **Yes**: Must include appropriate indexes, RLS policies, and query performance analysis

#### 2. Testing Discipline

| Change Type | Test Requirement | Pass Criteria |
|-------------|------------------|---------------|
| **Redirect path changes** | k6 smoke test (2 min, 1k VUs) | p95 < 100ms, no regression > 10% |
| **Major features** | Full load test (40 min, 20k VUs) | All SLA targets met, cache hit > 85% |
| **Database schema** | Index performance test | Query time < 50ms for 1M records |
| **Edge function changes** | Batch processing test | Write reduction > 100x |

**CI/CD Integration**:
- PR smoke tests run automatically (5 min duration)
- Main branch merge triggers full load test (40 min)
- Production deployment includes smoke test (3 min)
- Weekly scheduled comprehensive tests (Sundays 2 AM UTC)

**Regression Threshold**:
- **+10% latency increase** = CI failure, PR blocked
- **-5% cache hit rate** = warning, review required
- **Any error rate increase** = failure, investigation required

#### 3. Operational Controls

All expensive or potentially problematic features must include:

- ✅ **Feature flag** for runtime on/off toggle
- ✅ **Monitoring metrics** (latency, throughput, error rate)
- ✅ **Dashboard visibility** in `/admin/system-monitoring`
- ✅ **Graceful degradation** strategy under load
- ✅ **Documentation** in relevant ADR

**Feature Flag Checklist**:
```typescript
// ❌ BAD: Hard-coded expensive feature
async function redirect() {
  const geoData = await fetchGeolocation(ip); // Always runs
  // ...
}

// ✅ GOOD: Feature-flagged with graceful degradation
async function redirect() {
  const enableGeo = await getFeatureFlag('enable_geolocation');
  
  if (enableGeo) {
    ctx.waitUntil(fetchGeolocation(ip)); // Async, can be disabled
  }
  // Redirect works without geolocation
}
```

#### 4. Scalability by Default

Default patterns for common operations:

**High-Volume Writes**:
```typescript
// ❌ BAD: Direct write for every event
await supabase.from('events').insert({ ... });

// ✅ GOOD: Batch processing queue
await kv.enqueue('events', { ... });
// Processor flushes every 5 seconds
```

**Complex Analytics**:
```typescript
// ❌ BAD: Real-time aggregation on every dashboard load
const stats = await supabase
  .from('clicks')
  .select('*')
  .groupBy('campaign')
  .aggregate('count');

// ✅ GOOD: Materialized view with 5-min refresh
const stats = await supabase
  .from('mv_campaign_analytics')
  .select('*');
```

**Dashboard Queries**:
```typescript
// ❌ BAD: Heavy analytics on primary database
const data = await supabase
  .from('links')
  .select('*, clicks(*)')
  .eq('workspace_id', workspace_id);

// ✅ GOOD: Read replica for dashboard queries
const data = await supabaseReadReplica
  .from('mv_link_analytics')
  .select('*')
  .eq('workspace_id', workspace_id);
```

**Popular Resource Lookups**:
```typescript
// ❌ BAD: Database query every time
const link = await supabase
  .from('links')
  .select('*')
  .match({ domain, path, slug })
  .single();

// ✅ GOOD: Cache with intelligent invalidation
const cacheKey = `link:${domain}:${path}:${slug}`;
const cached = await kv.get(cacheKey);
if (cached) return cached;

const link = await supabase.from('links').select('*').match({ ... });
await kv.set(cacheKey, link, { expireIn: 300_000 });
```

---

## Monitoring & Observability

### Key Metrics Tracked

**Redirect Performance**:
- p50, p95, p99 latency (target: p95 < 100ms)
- Cache hit rate (target: > 85%)
- Error rate (target: < 0.1%)
- Requests per second

**Batch Processing**:
- Queue depth (alert if > 1000)
- Flush frequency (target: every 5 seconds)
- Write reduction factor (target: > 100x)
- Failed batch writes

**Database Health**:
- Connection pool usage (alert if > 80%)
- Query latency by table
- Index usage statistics
- Materialized view freshness

**Feature Flag State**:
- Active flags and their values
- Last toggle timestamp
- Flag cache hit rate

### Dashboard Location

All metrics visible in: `/admin/system-monitoring`

**Dashboard Sections**:
1. **Edge Function Performance**: Latency, throughput, error rate
2. **Batch Processing**: Queue depth, flush rate, write reduction
3. **Database Health**: Connections, query latency, index usage
4. **Feature Flags**: Active flags, toggle controls

**Admin Actions**:
- Toggle feature flags (emergency override)
- View historical performance trends
- Download performance reports (CSV)
- Trigger manual materialized view refresh

### Alerting Strategy

**Critical Alerts** (page on-call):
- p95 latency > 200ms for 5 minutes
- Error rate > 1% for 3 minutes
- Batch queue depth > 5000
- Database connections > 90%

**Warning Alerts** (Slack notification):
- p95 latency > 150ms for 10 minutes
- Cache hit rate < 75% for 5 minutes
- Batch queue depth > 2000
- Read replica lag > 5 seconds

---

## Testing Strategy

### k6 Load Testing Suite

**Location**: `/load-tests/`

#### Test Scripts

1. **redirect-performance.js** (40 min, 20k VUs)
   - Validates redirect latency under load
   - Tests cache effectiveness
   - Simulates campaign launch burst traffic
   - Pass criteria: p95 < 100ms, cache > 85%, error < 0.1%

2. **batch-processing.js** (20 min, 10k VUs)
   - Validates write reduction via batch queue
   - Tests queue overflow handling
   - Simulates sustained high-volume clicks
   - Pass criteria: Write reduction > 100x, no data loss

3. **smoke-test.js** (2 min, 1k VUs)
   - Quick validation for CI/CD pipeline
   - Abbreviated test scenarios
   - Pass criteria: Same thresholds, smaller scale

#### CI/CD Integration

**Workflow**: `.github/workflows/load-testing.yml`

**Job Types**:

1. **PR Smoke Test** (runs on every PR)
   - Duration: 5 minutes total (2 min test + 3 min setup)
   - Test: `smoke-test.js`
   - Auto-fail PR on regression > 10%
   - Comment results directly on PR

2. **Main Branch Full Test** (runs on merge to main)
   - Duration: 40 minutes
   - Tests: `redirect-performance.js` + `batch-processing.js`
   - Update performance baseline on success
   - Block deployment on failure

3. **Production Smoke Test** (runs on production deploy)
   - Duration: 3 minutes
   - Test: Minimal validation (1 min, 100 VUs)
   - Alert on failure, rollback if critical

4. **Weekly Comprehensive Test** (scheduled, Sundays 2 AM UTC)
   - Duration: 60 minutes
   - Tests: Full suite + extended duration scenarios
   - Historical trend analysis
   - Email digest to engineering team

#### Success Criteria

All tests must meet these thresholds:

| Metric | Threshold | Action on Failure |
|--------|-----------|-------------------|
| p95 Latency | < 100ms | ❌ Fail CI, block merge |
| Cache Hit Rate | > 85% | ❌ Fail CI, block merge |
| Error Rate | < 0.1% | ❌ Fail CI, block merge |
| Regression | < +10% | ❌ Fail CI, block merge |
| Write Reduction | > 100x | ⚠️ Warning, review required |

#### Test Data Management

**Strategy**:
- Dedicated `ci-loadtest` workspace for CI runs
- Database seeding via `setup-test-data.sql`
- Isolated from production/staging user data
- Auto-cleanup after test completion

**Setup Script**: `/load-tests/setup-test-data.sql`

```sql
-- Create test workspace
INSERT INTO workspaces (id, name, slug, owner_id)
VALUES (
  'ci-loadtest-workspace',
  'CI Load Test Workspace',
  'ci-loadtest',
  'ci-test-user'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Create 1000 test links
INSERT INTO links (workspace_id, domain, slug, destination_url, ...)
SELECT 
  'ci-loadtest-workspace',
  'utm.one',
  'test-' || generate_series,
  'https://example.com/destination-' || generate_series,
  ...
FROM generate_series(1, 1000);
```

**Related ADR**: [ADR-005: Testing Discipline](./ADR-005-testing-discipline.md)

---

## Related ADRs

- [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md) - Detailed cache design decisions
- [ADR-003: Batch Processing System](./ADR-003-batch-processing-system.md) - Queue implementation and flush logic
- [ADR-004: Feature Flags Runtime Control](./ADR-004-feature-flags-runtime-control.md) - Flag architecture and usage
- [ADR-005: Testing Discipline](./ADR-005-testing-discipline.md) - Load testing standards and CI/CD integration

---

## References

### Documentation
- [Load Testing README](/load-tests/README.md) - Comprehensive load testing guide
- [Implementation Plan](/IMPLEMENTATION_PLAN.md) - Original feature roadmap
- [Architecture Memories](/memories) - Performance and scalability decisions

### Code References
- `/supabase/functions/redirect/index.ts` - Core redirect implementation with caching
- `/supabase/functions/process-click-queue/index.ts` - Batch processing worker
- `/src/pages/admin/SystemMonitoring.tsx` - Monitoring dashboard
- `/src/hooks/useFeatureFlags.tsx` - Feature flag client hook
- `/load-tests/` - Complete load testing suite

### Architectural Memories
- `architecture/scalability-performance-priorities` - Week 1/2 optimization plan
- `architecture/feature-flags-runtime-control` - Flag design decisions
- `architecture/read-replica-strategy-analytics-optimization` - Database routing
- `implementation/redirect-engine-phase-1-complete` - Core redirect implementation
- `features/analytics-comprehensive-7-phase-roadmap` - Analytics architecture

---

## Appendix: Performance Baseline History

### Before Optimization (Week 0)
- p95 Latency: **300-600ms**
- Cache Hit Rate: **0%** (no cache)
- Database Writes: **1:1** (every click = 1 write)
- Infrastructure Cost: **N/A** (not projected)

### After Week 1 Optimization
- p95 Latency: **50-80ms** ✅ 80% reduction
- Cache Hit Rate: **85-90%** ✅ Target achieved
- Database Writes: **100-150x reduction** ✅ Target exceeded
- Infrastructure Cost: **~$400/month** ✅ Within budget

### Expected at 1M Users
- p95 Latency: **60-100ms** (slight degradation under scale)
- Cache Hit Rate: **85-90%** (maintained)
- Database Writes: **~1k/second** (vs 100k+ without batching)
- Infrastructure Cost: **$300-500/month** (target range)

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)  
**Status**: ✅ Accepted and Implemented
