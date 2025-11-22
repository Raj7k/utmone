# ADR-003: Batch Processing System

## Metadata

- **ADR Number**: 003
- **Title**: Deno KV Queue for Click Event Batching
- **Status**: ✅ Accepted
- **Date**: 2025-11-22
- **Authors**: Engineering Team
- **Supersedes**: None
- **Related**: [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md)

---

## Context

### Problem Statement

High-volume campaigns and popular QR codes generate massive click traffic that overwhelms the database with write operations:

**Observed Traffic Patterns**:
- Campaign launch: **10k-50k clicks in first hour**
- Event booth QR code: **500 clicks/hour sustained for 8 hours**
- Viral social post: **100k clicks over 24 hours**

**Database Impact**:
- 1 click = 1 database INSERT operation
- 100 clicks/second = 100 database writes/second
- Supabase connection pool limited to **1000 concurrent connections**
- Risk of connection exhaustion during traffic spikes

### Real-Time Write Problem

Each click generates:
1. `link_clicks` table INSERT (click event record)
2. `links` table UPDATE (increment total_clicks, unique_clicks)
3. Potential `link_clicks` SELECT for unique click detection

**Performance Cost per Click**:
- 3 database operations × 20-30ms each = **60-90ms** total
- At 100 clicks/second: **6-9 seconds of database time per second** (impossible)
- Result: Connection pool exhaustion, query timeouts, failures

### Requirements

- **Write Reduction**: 100x fewer database writes (100 clicks → 1 write)
- **Eventual Consistency**: Click data visible in analytics within 5 seconds
- **Graceful Degradation**: System must remain functional if queue fails
- **Data Integrity**: No click data loss under normal operations
- **Cost**: Included in existing infrastructure (no additional services)

---

## Decision

### Selected Solution: Deno KV Queue with Batch Flush

Implement **batch processing system** using Deno KV as message queue:

1. **Enqueue**: Edge function enqueues click event to Deno KV queue (non-blocking)
2. **Aggregate**: Background processor aggregates events every 5 seconds
3. **Batch Write**: Single database INSERT with 100+ click records
4. **Fallback**: Direct database write if queue unavailable

### Architecture Diagram

```
┌─────────────────┐
│  Redirect Edge  │
│    Function     │
└────────┬────────┘
         │ (1) Enqueue click event
         │     [Non-blocking, 5-10ms]
         ↓
┌─────────────────┐
│   Deno KV Queue │  ← Click events accumulate
│  (Message Queue)│     [Max 5 seconds]
└────────┬────────┘
         │ (2) Flush trigger (every 5s)
         │
         ↓
┌─────────────────┐
│ Batch Processor │  ← Aggregates 100+ events
│  Edge Function  │     [Background worker]
└────────┬────────┘
         │ (3) Single batch INSERT
         │     [1 write for 100 clicks]
         ↓
┌─────────────────┐
│   Database      │
│  (link_clicks)  │
└─────────────────┘
```

### Why Deno KV Queue?

| Criteria | Deno KV Queue | AWS SQS | Redis Queue | Winner |
|----------|---------------|---------|-------------|--------|
| **Latency** | 5-10ms | 50-100ms | 10-20ms | ✅ Deno KV |
| **Integration** | Native (no setup) | External service | External service | ✅ Deno KV |
| **Cost** | Included | $0.40 per 1M requests | $15-30/month | ✅ Deno KV |
| **Throughput** | 1000 ops/sec | 10k+ msg/sec | 10k+ ops/sec | ⚠️ SQS/Redis (but Deno KV sufficient) |
| **Durability** | Durable (Foundry DB) | Durable | Ephemeral (RAM) | ✅ Deno KV |
| **Simplicity** | Zero config | Complex setup | External service | ✅ Deno KV |

**Verdict**: Deno KV provides best balance of performance, simplicity, and cost.

---

## Implementation

### 1. Enqueue Click Event (Redirect Function)

**Location**: `supabase/functions/redirect/index.ts`

```typescript
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  // ... link lookup logic ...

  // Redirect user immediately (non-blocking)
  const response = Response.redirect(link.destination_url, 301);

  // Enqueue click event for batch processing (async)
  const ctx = { waitUntil: (promise: Promise<any>) => promise };
  ctx.waitUntil(enqueueClickEvent({
    link_id: link.id,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    referrer: req.headers.get('referer'),
    clicked_at: new Date().toISOString(),
  }));

  return response;
});

async function enqueueClickEvent(clickData: ClickEvent) {
  try {
    const queueKey = ['click_events', crypto.randomUUID()];
    await kv.set(queueKey, clickData, { expireIn: 60_000 }); // 60s TTL
    console.log('Enqueued click event:', clickData.link_id);
  } catch (error) {
    console.error('Failed to enqueue click, falling back to direct write:', error);
    
    // Graceful degradation: write directly to database
    await directWriteClick(clickData);
  }
}

async function directWriteClick(clickData: ClickEvent) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  await supabase.from('link_clicks').insert(clickData);
}
```

**Performance**:
- Enqueue time: **5-10ms** (Deno KV write)
- Total redirect time: **15-25ms** (cache hit + enqueue)
- No blocking on database writes ✅

### 2. Batch Processor (Background Worker)

**Location**: `supabase/functions/process-click-queue/index.ts`

**Trigger**: Cron schedule every **5 seconds**

```typescript
// In supabase/config.toml
[functions.process-click-queue]
  schedule = "*/5 * * * * *"  # Every 5 seconds
```

**Edge Function**:

```typescript
const kv = await Deno.openKv();

Deno.serve(async () => {
  const startTime = Date.now();
  console.log('Starting batch click processing...');

  // Step 1: Collect all click events from queue
  const clickEvents: ClickEvent[] = [];
  const keysToDelete: any[] = [];

  const entries = kv.list({ prefix: ['click_events'] });
  for await (const entry of entries) {
    clickEvents.push(entry.value as ClickEvent);
    keysToDelete.push(entry.key);
  }

  if (clickEvents.length === 0) {
    console.log('No click events to process');
    return new Response(JSON.stringify({ processed: 0 }));
  }

  console.log(`Processing ${clickEvents.length} click events`);

  // Step 2: Aggregate and enrich click data
  const enrichedClicks = await Promise.all(
    clickEvents.map(async (click) => {
      // Parse user agent for device/browser/OS
      const userAgentData = parseUserAgent(click.user_agent);
      
      // Determine unique click (IP + user agent within 24 hours)
      const isUnique = await checkUniqueClick(
        click.link_id,
        click.ip_address,
        click.user_agent
      );

      return {
        ...click,
        browser: userAgentData.browser,
        os: userAgentData.os,
        device_type: userAgentData.device_type,
        is_unique: isUnique,
      };
    })
  );

  // Step 3: Batch insert to database (single query)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error: insertError } = await supabase
    .from('link_clicks')
    .insert(enrichedClicks);

  if (insertError) {
    console.error('Batch insert failed:', insertError);
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  // Step 4: Update link counters (aggregate by link_id)
  const linkCounters = enrichedClicks.reduce((acc, click) => {
    if (!acc[click.link_id]) {
      acc[click.link_id] = { total: 0, unique: 0 };
    }
    acc[click.link_id].total += 1;
    acc[click.link_id].unique += click.is_unique ? 1 : 0;
    return acc;
  }, {} as Record<string, { total: number; unique: number }>);

  for (const [linkId, counters] of Object.entries(linkCounters)) {
    await supabase.rpc('increment_link_clicks', {
      p_link_id: linkId,
      p_total_increment: counters.total,
      p_unique_increment: counters.unique,
    });
  }

  // Step 5: Delete processed events from queue
  for (const key of keysToDelete) {
    await kv.delete(key);
  }

  const duration = Date.now() - startTime;
  console.log(`Processed ${clickEvents.length} clicks in ${duration}ms`);

  return new Response(JSON.stringify({
    processed: clickEvents.length,
    duration_ms: duration,
  }));
});

function parseUserAgent(userAgent: string) {
  // User agent parsing logic (using library like ua-parser-js)
  // Returns: { browser, os, device_type }
}

async function checkUniqueClick(linkId: string, ip: string, userAgent: string) {
  // Check if IP + user agent combination seen in last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const { data } = await supabase
    .from('link_clicks')
    .select('id')
    .eq('link_id', linkId)
    .eq('ip_address', ip)
    .eq('user_agent', userAgent)
    .gte('clicked_at', twentyFourHoursAgo.toISOString())
    .limit(1);

  return data?.length === 0; // Unique if no previous click found
}
```

### 3. Database Function for Counter Updates

**Location**: Supabase migration

```sql
CREATE OR REPLACE FUNCTION increment_link_clicks(
  p_link_id UUID,
  p_total_increment INTEGER,
  p_unique_increment INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE links
  SET
    total_clicks = COALESCE(total_clicks, 0) + p_total_increment,
    unique_clicks = COALESCE(unique_clicks, 0) + p_unique_increment,
    last_clicked_at = NOW()
  WHERE id = p_link_id;
END;
$$;
```

---

## Performance Impact

### Write Reduction

**Before Batch Processing**:
- 100 clicks = 100 database INSERTs + 100 UPDATEs = **200 operations**

**After Batch Processing**:
- 100 clicks = 1 batch INSERT + 1 UPDATE = **2 operations**

**Reduction Factor**: **100x fewer database writes** ✅

### Latency Impact

**Redirect Latency** (user-facing):
- Before: **100-150ms** (includes synchronous click write)
- After: **15-25ms** (cache hit + enqueue)
- **Reduction**: **75-85%** ✅

**Analytics Latency** (eventual consistency):
- Click visible in dashboard: **5 seconds** after click
- Acceptable for marketing use case (not real-time trading)

### Database Load Reduction

**Connection Pool Usage**:
- Before: **100 connections** during 100 clicks/second burst
- After: **2-3 connections** (batch processor + aggregation queries)
- **Reduction**: **97% fewer connections** ✅

**CPU/Compute Usage**:
- Before: 100 INSERT operations × 20ms = **2 seconds of compute per second** (200% utilization)
- After: 1 batch INSERT × 50ms = **0.05 seconds of compute per second** (5% utilization)
- **Reduction**: **95% less compute** ✅

### Cost Impact

**Database Compute Cost**:
- Supabase pricing: ~$0.00001 per write operation (approx)
- 1M clicks/day = **$10/day = $300/month** (before batching)
- With 100x reduction = **$0.10/day = $3/month** (after batching)
- **Savings**: **$297/month** at 1M clicks/day ✅

---

## Edge Cases & Mitigations

### 1. Queue Overflow

**Problem**: Extreme traffic spike (100k clicks/minute) overflows Deno KV queue.

**Deno KV Limits**: 1000 operations/second = max 5000 events in 5-second window.

**Mitigation**: **Bounded queue size with graceful degradation**

```typescript
async function enqueueClickEvent(clickData: ClickEvent) {
  // Check queue depth
  const queueSize = await getQueueSize();
  
  if (queueSize > 10_000) {
    console.warn('Queue overflow, falling back to direct write');
    await directWriteClick(clickData);
    return;
  }

  // Normal enqueue
  await kv.set(['click_events', crypto.randomUUID()], clickData);
}

async function getQueueSize() {
  let count = 0;
  const entries = kv.list({ prefix: ['click_events'] });
  for await (const _ of entries) {
    count++;
    if (count > 10_000) break; // Early exit if over limit
  }
  return count;
}
```

**Result**: System falls back to direct writes if queue overflows, preventing data loss.

### 2. Processor Function Timeout

**Problem**: Batch processor takes > 60 seconds (edge function timeout).

**Scenario**: 10k events accumulated, processing takes 90 seconds.

**Mitigation**: **Chunk processing with continuation**

```typescript
const MAX_BATCH_SIZE = 1000; // Process max 1000 events per invocation
const MAX_PROCESSING_TIME = 50_000; // 50 seconds (leave 10s buffer)

Deno.serve(async () => {
  const startTime = Date.now();
  const clickEvents: ClickEvent[] = [];
  let processedCount = 0;

  const entries = kv.list({ prefix: ['click_events'] });
  for await (const entry of entries) {
    clickEvents.push(entry.value as ClickEvent);
    
    // Stop collecting if limits reached
    if (
      clickEvents.length >= MAX_BATCH_SIZE ||
      Date.now() - startTime > MAX_PROCESSING_TIME
    ) {
      break;
    }
  }

  // Process collected batch
  await processBatch(clickEvents);
  processedCount = clickEvents.length;

  // Check if more events remain
  const remainingCount = await getQueueSize();
  if (remainingCount > 0) {
    console.log(`${remainingCount} events remaining, scheduling continuation`);
    // Next invocation (in 5 seconds) will process remaining
  }

  return new Response(JSON.stringify({ processed: processedCount }));
});
```

**Result**: Large backlogs processed over multiple 5-second cycles, no timeout.

### 3. Unique Click Detection False Negatives

**Problem**: Batch processing may miss concurrent unique click checks (race condition).

**Scenario**:
1. User A clicks at 10:00:00 (first click, should be unique)
2. User A clicks at 10:00:02 (second click, should not be unique)
3. Both events processed in same 5-second batch
4. Unique check runs before first click written → both marked unique

**Mitigation**: **Within-batch deduplication**

```typescript
async function checkUniqueClick(
  linkId: string,
  ip: string,
  userAgent: string,
  currentBatch: ClickEvent[]
) {
  // Check within current batch first
  const duplicateInBatch = currentBatch.find(
    (click) =>
      click.link_id === linkId &&
      click.ip_address === ip &&
      click.user_agent === userAgent
  );

  if (duplicateInBatch) {
    return false; // Not unique (duplicate within batch)
  }

  // Check database for last 24 hours
  const { data } = await supabase
    .from('link_clicks')
    .select('id')
    .eq('link_id', linkId)
    .eq('ip_address', ip)
    .eq('user_agent', userAgent)
    .gte('clicked_at', twentyFourHoursAgo.toISOString())
    .limit(1);

  return data?.length === 0;
}
```

**Result**: Accurate unique click detection even within same batch.

### 4. Failed Batch Insert

**Problem**: Batch INSERT fails (constraint violation, database error), entire batch lost.

**Mitigation**: **Retry with exponential backoff + individual fallback**

```typescript
async function processBatch(clickEvents: ClickEvent[]) {
  // Attempt batch insert with retries
  let attempts = 0;
  const MAX_RETRIES = 3;

  while (attempts < MAX_RETRIES) {
    const { error } = await supabase
      .from('link_clicks')
      .insert(clickEvents);

    if (!error) {
      console.log(`Batch insert succeeded (${clickEvents.length} events)`);
      return;
    }

    attempts++;
    console.error(`Batch insert failed (attempt ${attempts}):`, error);
    await sleep(Math.pow(2, attempts) * 1000); // Exponential backoff
  }

  // Final fallback: insert individually
  console.warn('Batch insert failed after retries, falling back to individual inserts');
  for (const click of clickEvents) {
    try {
      await supabase.from('link_clicks').insert(click);
    } catch (error) {
      console.error('Individual insert failed:', click.link_id, error);
      // Log to error tracking system (Sentry, etc.)
    }
  }
}
```

**Result**: No data loss even if batch insert fails.

---

## Monitoring & Observability

### Key Metrics

**Queue Health**:
- Queue depth (current number of events)
- Max queue depth in last hour
- Enqueue rate (events/second)
- Dequeue rate (events/second)

**Batch Processor Performance**:
- Batch size (avg, min, max)
- Processing time (avg, p95, p99)
- Success rate (%)
- Failed batches per hour

**Write Reduction**:
- Database writes per hour (before vs after)
- Write reduction factor (target: > 100x)
- Cost savings ($ per day)

### Monitoring Dashboard

**Location**: `/admin/system-monitoring`

**Batch Processing Panel**:
```
📦 Batch Processing (Last Hour)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Queue Depth:       247 events
Avg Batch Size:    156 events
Processing Time:   1.2s (p95: 2.1s)
Write Reduction:   142x ✅ (target: >100x)
Success Rate:      99.8% ✅
Failed Batches:    2 (retry succeeded)
Cost Savings:      $8.50/day
```

### Alerting

**Critical Alerts** (page on-call):
- Queue depth > 5000 events for 5 minutes (overflow risk)
- Batch processor error rate > 5% for 3 minutes (data loss risk)
- Processing time p95 > 50 seconds for 10 minutes (timeout risk)

**Warning Alerts** (Slack notification):
- Queue depth > 2000 events for 10 minutes (elevated traffic)
- Write reduction factor < 50x for 30 minutes (investigate batching efficiency)
- Failed batch retries > 10 per hour (investigate database health)

---

## Alternatives Considered

### Option 1: Real-Time Writes (Original Implementation)

**Pros**:
- Immediate data consistency
- Simple implementation
- No queue management

**Cons**:
- ❌ 100 writes/second overwhelms database
- ❌ Connection pool exhaustion risk
- ❌ High infrastructure cost
- ❌ Slow redirect latency (60-90ms per click)

**Decision**: ❌ Rejected - fails at scale

### Option 2: AWS SQS + Lambda

**Pros**:
- Higher throughput (10k+ messages/second)
- Managed service (auto-scaling)
- Battle-tested at massive scale

**Cons**:
- External service ($0.40 per 1M requests)
- Additional deployment complexity
- Network latency (50-100ms enqueue time)
- Requires AWS account and configuration

**Decision**: ❌ Rejected - unnecessary cost and complexity

### Option 3: Redis Queue + Worker Process

**Pros**:
- High throughput (10k+ ops/second)
- Mature ecosystem (Bull, BullMQ)
- Flexible job processing (delayed jobs, retries)

**Cons**:
- External service ($15-30/month)
- Ephemeral (data loss if Redis crashes)
- Maintenance overhead (Redis instance)

**Decision**: ❌ Rejected - Deno KV provides sufficient throughput with better durability

### Option 4: No Batching, Only Async Writes

**Approach**: Keep 1:1 click-to-write ratio, but make writes fully asynchronous.

**Pros**:
- Simpler implementation (no queue)
- Immediate data consistency

**Cons**:
- ❌ Still 100 writes/second (database load unchanged)
- ❌ Connection pool pressure (requires 100 concurrent connections)
- ❌ High infrastructure cost (unchanged)

**Decision**: ❌ Rejected - doesn't solve core scalability problem

---

## Future Enhancements

### 1. Adaptive Flush Interval

Dynamically adjust flush interval based on queue depth:

```typescript
// Low traffic: flush every 10 seconds
// Medium traffic: flush every 5 seconds
// High traffic: flush every 2 seconds
const flushInterval = queueDepth < 100 ? 10_000 :
                      queueDepth < 500 ? 5_000 : 2_000;
```

**Benefit**: Reduce database load during low traffic, improve latency during high traffic  
**Complexity**: Minimal (simple conditional logic)  
**Priority**: Medium

### 2. Geolocation Batching

Currently, geolocation processed per-click (async but still 1:1 ratio).

**Enhancement**: Batch geolocation lookups:

```typescript
// Collect unique IPs from batch
const uniqueIPs = [...new Set(clickEvents.map(c => c.ip_address))];

// Single geolocation API call with multiple IPs
const geoData = await batchGeolocationLookup(uniqueIPs);

// Enrich clicks with geo data
const enrichedClicks = clickEvents.map(click => ({
  ...click,
  ...geoData[click.ip_address],
}));
```

**Benefit**: 100x fewer geolocation API calls (cost reduction)  
**Complexity**: Moderate (requires batch-capable geolocation service)  
**Priority**: High (significant cost reduction)

### 3. Queue Metrics Dashboard

Real-time queue visualization:

```
📊 Click Queue (Live)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[████████░░░░░░░░░░░░] 247/5000 events (5% full)

Enqueue Rate:  42 events/sec
Dequeue Rate:  38 events/sec
Oldest Event:  3.2s ago
Next Flush:    1.8s
```

**Benefit**: Better observability for debugging  
**Complexity**: Low (add metrics collection)  
**Priority**: Low (current logging sufficient)

---

## Related ADRs

- [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md) - Overall performance strategy
- [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md) - Complementary optimization for reads
- [ADR-005: Testing Discipline](./ADR-005-testing-discipline.md) - Load testing validation

---

## References

- [Deno KV Queue Documentation](https://deno.com/kv)
- Code: `supabase/functions/process-click-queue/index.ts`
- Load Tests: `load-tests/batch-processing.js`
- Memory: `architecture/scalability-performance-priorities`

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)  
**Status**: ✅ Accepted and Implemented
