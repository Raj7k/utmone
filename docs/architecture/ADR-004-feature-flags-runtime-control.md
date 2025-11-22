# ADR-004: Feature Flags for Runtime Control

## Metadata

- **ADR Number**: 004
- **Title**: Database-Backed Feature Flags for Runtime Control
- **Status**: ✅ Accepted
- **Date**: 2025-11-22
- **Authors**: Engineering Team
- **Supersedes**: None
- **Related**: [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md)

---

## Context

### Problem Statement

During traffic spikes, expensive features can degrade redirect performance below SLA targets:

**Expensive Features**:
1. **Geolocation Processing**: 200-500ms per redirect (IP lookup, country/city detection)
2. **A/B Testing**: 50-100ms per redirect (variant selection, statistical calculations)
3. **Batch Processing**: Potential queue overflow during extreme load
4. **OG Image Variant Selection**: 30-50ms per redirect (crawler detection, variant selection)

**Current Limitations**:
- Cannot disable features without code redeployment
- No emergency kill switch for problematic features
- Incremental rollout requires separate environments
- Feature experiments require long deployment cycles

**Real-World Scenario**:
```
[10:00 AM] Campaign launches, traffic spike: 50k clicks/hour
[10:05 AM] Geolocation service slow, redirect latency → 400ms
[10:10 AM] Engineer notices issue, wants to disable geolocation
[10:15 AM] Code change, PR review, CI/CD pipeline...
[10:45 AM] Deployment completes (45 minutes of degraded performance)
```

**Desired Outcome**: Toggle geolocation **instantly** via admin dashboard, no redeployment.

### Requirements

- **Instant Control**: Flag changes propagate within 60 seconds
- **Admin Interface**: Toggle flags via `/admin/system-monitoring` dashboard
- **Zero Downtime**: Flag checks must not impact redirect latency
- **Graceful Degradation**: Features must work with flag disabled
- **Audit Trail**: Track who toggled what flag when
- **Simple Storage**: No external dependencies (Redis, etc.)

---

## Decision

### Selected Solution: Database-Backed Feature Flags with Deno KV Caching

Implement **feature flag system** with:
1. **Storage**: Postgres `feature_flags` table (source of truth)
2. **Caching**: Deno KV 1-minute cache (low-latency reads)
3. **Admin UI**: Dashboard for instant flag toggling
4. **Edge Function**: Cached flag checks in redirect logic

### Architecture Diagram

```
┌──────────────────┐
│  Admin Dashboard │  ← Super admin toggles flag
│ (/admin/system)  │
└────────┬─────────┘
         │ (1) Update feature_flags table
         ↓
┌──────────────────┐
│  Postgres DB     │  ← Source of truth
│ (feature_flags)  │
└────────┬─────────┘
         │ (2) Read on cache miss
         ↓
┌──────────────────┐
│   Deno KV Cache  │  ← 1-minute TTL
│ (flag:flag_key)  │
└────────┬─────────┘
         │ (3) Read on every redirect
         ↓
┌──────────────────┐
│  Redirect Edge   │  ← if (enable_geo) { ... }
│    Function      │
└──────────────────┘
```

### Why Database + Deno KV?

| Criteria | DB + Cache | Config File | Redis | Winner |
|----------|------------|-------------|-------|--------|
| **Latency** | 5-10ms (cached) | 0ms (hardcoded) | 10-20ms | ✅ DB + Cache |
| **Runtime Toggle** | ✅ Yes | ❌ Requires redeploy | ✅ Yes | ✅ DB + Cache / Redis |
| **Admin UI** | ✅ Built-in | ❌ Manual editing | ✅ Possible | ✅ DB + Cache |
| **Audit Trail** | ✅ Native | ❌ Git commits only | ⚠️ Custom | ✅ DB + Cache |
| **Cost** | Included | Included | $15-30/month | ✅ DB + Cache |
| **Durability** | ✅ Durable | ✅ Durable | ❌ Ephemeral | ✅ DB + Cache |

**Verdict**: Database storage with Deno KV caching provides best balance.

---

## Implementation

### 1. Database Schema

**Table**: `feature_flags`

```sql
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified_by UUID REFERENCES profiles(id)
);

-- Index for fast lookups
CREATE INDEX idx_feature_flags_key ON feature_flags (flag_key);

-- RLS policies
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

CREATE POLICY "Only super admins can modify feature flags"
  ON feature_flags FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE is_super_admin = true
  ));
```

**Initial Flags**:

```sql
INSERT INTO feature_flags (flag_key, is_enabled, description, category) VALUES
  ('enable_geolocation', true, 'Toggle IP geolocation processing', 'performance'),
  ('enable_og_variants', true, 'Enable OG image A/B testing', 'features'),
  ('enable_batch_processing', true, 'Use batch queue for click tracking', 'performance'),
  ('maintenance_mode', false, 'Serve static maintenance page', 'emergency'),
  ('enable_qr_analytics', true, 'Track QR code specific metrics', 'features'),
  ('enable_utm_validation', true, 'Enforce UTM parameter rules', 'features');
```

### 2. Edge Function Flag Check

**Location**: `supabase/functions/redirect/index.ts`

**Helper Function**:

```typescript
const kv = await Deno.openKv();

async function getFeatureFlag(flagKey: string): Promise<boolean> {
  // Step 1: Check Deno KV cache
  const cacheKey = `flag:${flagKey}`;
  const cached = await kv.get([cacheKey]);

  if (cached.value !== null) {
    console.log(`Feature flag cache HIT: ${flagKey} = ${cached.value}`);
    return cached.value as boolean;
  }

  console.log(`Feature flag cache MISS: ${flagKey}`);

  // Step 2: Query database on cache miss
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase
    .from('feature_flags')
    .select('is_enabled')
    .eq('flag_key', flagKey)
    .single();

  if (error || !data) {
    console.error(`Feature flag lookup failed: ${flagKey}`, error);
    return false; // Safe default: feature disabled if lookup fails
  }

  const isEnabled = data.is_enabled;

  // Step 3: Cache result for 1 minute
  await kv.set([cacheKey], isEnabled, { expireIn: 60_000 }); // 1 min TTL

  return isEnabled;
}
```

**Usage in Redirect Logic**:

```typescript
Deno.serve(async (req) => {
  // ... link lookup logic ...

  // Check maintenance mode (emergency override)
  const maintenanceMode = await getFeatureFlag('maintenance_mode');
  if (maintenanceMode) {
    return new Response('Service temporarily unavailable', { status: 503 });
  }

  // Redirect user
  const response = Response.redirect(link.destination_url, 301);

  // Async processing with feature flags
  const ctx = { waitUntil: (promise: Promise<any>) => promise };
  
  ctx.waitUntil(async () => {
    // Geolocation: toggle based on flag
    const enableGeo = await getFeatureFlag('enable_geolocation');
    if (enableGeo) {
      await processGeolocation(ip_address);
    } else {
      console.log('Geolocation disabled by feature flag');
    }

    // Click tracking: use batch queue or direct write
    const enableBatch = await getFeatureFlag('enable_batch_processing');
    if (enableBatch) {
      await enqueueClickEvent(clickData);
    } else {
      await directWriteClick(clickData);
    }
  });

  return response;
});
```

### 3. Admin Dashboard UI

**Location**: `src/pages/admin/SystemMonitoring.tsx`

**Feature Flags Panel**:

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export const SystemMonitoring = () => {
  const { flags, loading, toggleFlag } = useFeatureFlags();

  return (
    <div className="space-y-8">
      {/* ... other monitoring panels ... */}

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Toggle features at runtime without redeployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flags?.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{flag.flag_key}</span>
                    <Badge variant={flag.category === 'emergency' ? 'destructive' : 'secondary'}>
                      {flag.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {flag.description}
                  </p>
                </div>
                <Switch
                  checked={flag.is_enabled}
                  onCheckedChange={(checked) => toggleFlag(flag.flag_key, checked)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

### 4. React Hook

**Location**: `src/hooks/useFeatureFlags.tsx`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      toast({ title: 'Failed to load feature flags', variant: 'destructive' });
      return;
    }

    setFlags(data);
    setLoading(false);
  };

  const toggleFlag = async (flagKey: string, isEnabled: boolean) => {
    setLoading(true);

    const { error } = await supabase
      .from('feature_flags')
      .update({
        is_enabled: isEnabled,
        last_modified_at: new Date().toISOString(),
        last_modified_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq('flag_key', flagKey);

    if (error) {
      toast({ title: 'Failed to update flag', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Invalidate cache via edge function
    await fetch(`${SUPABASE_URL}/functions/v1/invalidate-flag-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ flag_key: flagKey }),
    });

    toast({ title: `Flag updated: ${flagKey}`, description: `Enabled: ${isEnabled}` });
    fetchFlags();
  };

  return { flags, loading, toggleFlag };
};
```

### 5. Cache Invalidation Edge Function

**Location**: `supabase/functions/invalidate-flag-cache/index.ts`

```typescript
const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const { flag_key } = await req.json();
  const cacheKey = `flag:${flag_key}`;
  
  await kv.delete([cacheKey]);
  console.log(`Invalidated flag cache: ${flag_key}`);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## Performance Impact

### Flag Check Latency

**Cache Hit (99% of requests)**:
- Deno KV read: **5-10ms**
- No database query ✅

**Cache Miss (1% of requests)**:
- Database query: **20-30ms**
- Cache write: **5ms**
- Total: **25-35ms**

**Impact on Redirect**:
- Flag check happens in async context (after redirect sent)
- **Zero impact** on user-facing redirect latency ✅

### Cache Propagation Time

**Flag Toggle Timeline**:
1. Admin clicks toggle: **0s**
2. Database updated: **+50ms**
3. Cache invalidated: **+100ms**
4. Next redirect reads new value: **+0-60s** (depends on cache TTL)

**Maximum Propagation**: **60 seconds** (1-minute cache TTL)

**Acceptable Lag**: Yes, for emergency toggles and feature rollouts ✅

---

## Use Cases & Examples

### Use Case 1: Emergency Geolocation Disable

**Scenario**: Geolocation service experiencing outage, causing 500ms redirect latency.

**Action**:
1. Super admin navigates to `/admin/system-monitoring`
2. Toggles `enable_geolocation` to **OFF**
3. Redirect latency drops to 50ms within 60 seconds

**Code Behavior**:
```typescript
const enableGeo = await getFeatureFlag('enable_geolocation'); // Returns false
if (enableGeo) {
  // Skipped - geolocation disabled
}
// Redirect continues without geolocation
```

**Result**: Immediate performance restoration, no code deployment ✅

### Use Case 2: Incremental A/B Test Rollout

**Scenario**: Testing new OG variant selection algorithm, want gradual rollout.

**Action**:
1. Deploy new algorithm behind `enable_og_variants_v2` flag (disabled)
2. Week 1: Enable for 10% of links (via metadata `rollout_percentage: 10`)
3. Week 2: Increase to 50%
4. Week 3: Full rollout (100%)

**Code Behavior**:
```typescript
const enableV2 = await getFeatureFlag('enable_og_variants_v2');
const rolloutPct = flagMetadata.rollout_percentage || 0;

if (enableV2 && Math.random() * 100 < rolloutPct) {
  variant = selectVariantV2(link);
} else {
  variant = selectVariantV1(link);
}
```

**Result**: Risk-free gradual rollout with instant rollback capability ✅

### Use Case 3: Maintenance Mode

**Scenario**: Database migration requires read-only mode for 10 minutes.

**Action**:
1. Enable `maintenance_mode` flag
2. All redirects serve static maintenance page
3. After migration complete, disable flag

**Code Behavior**:
```typescript
const maintenanceMode = await getFeatureFlag('maintenance_mode');
if (maintenanceMode) {
  return new Response('Service temporarily unavailable. We'll be back soon!', {
    status: 503,
    headers: { 'Retry-After': '300' }, // 5 minutes
  });
}
```

**Result**: Graceful maintenance window without broken redirects ✅

---

## Edge Cases & Mitigations

### 1. Database Unavailable

**Problem**: Database outage prevents flag lookup.

**Mitigation**: **Safe default (feature disabled)**

```typescript
async function getFeatureFlag(flagKey: string): Promise<boolean> {
  try {
    // ... cache + DB lookup logic ...
  } catch (error) {
    console.error(`Feature flag lookup failed: ${flagKey}`, error);
    return false; // Safe default: disable feature if lookup fails
  }
}
```

**Result**: System remains functional with reduced features during DB outage ✅

### 2. Cache Stale During High Toggle Frequency

**Problem**: Admin toggles flag rapidly (ON → OFF → ON), cache may serve stale value.

**Mitigation**: **Cache invalidation on update** (see section 5 above)

**Timeline**:
1. Flag toggled to OFF: **0s**
2. Cache invalidated: **+100ms**
3. Next request fetches fresh value: **+150ms**

**Maximum Staleness**: **100ms** after toggle ✅

### 3. Flag Not Found

**Problem**: Code references non-existent flag key (typo, flag deleted).

**Mitigation**: **Safe default (feature disabled) + logging**

```typescript
const { data, error } = await supabase
  .from('feature_flags')
  .select('is_enabled')
  .eq('flag_key', flagKey)
  .single();

if (error || !data) {
  console.error(`Feature flag not found: ${flagKey}`, error);
  // Log to error tracking (Sentry, etc.)
  return false; // Safe default
}
```

**Result**: Missing flags don't break system, logged for investigation ✅

---

## Monitoring & Observability

### Key Metrics

**Flag Usage**:
- Flag checks per second
- Cache hit rate (target: > 99%)
- Cache miss latency (avg, p95)

**Flag State**:
- Currently enabled flags
- Last toggle timestamp
- Toggle frequency (toggles per hour)

### Monitoring Dashboard

**Location**: `/admin/system-monitoring`

**Feature Flags Panel**:
```
🎛️ Feature Flags (Current State)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
enable_geolocation:      ✅ ON  (last toggled: 2h ago)
enable_og_variants:      ✅ ON  (last toggled: never)
enable_batch_processing: ✅ ON  (last toggled: 5m ago)
maintenance_mode:        ❌ OFF (last toggled: 3d ago)
enable_qr_analytics:     ✅ ON  (last toggled: never)

Cache Hit Rate: 99.2% ✅
Flag Checks/sec: 45
```

### Audit Trail

**Table**: `admin_audit_logs`

```sql
-- Logged on every flag toggle
INSERT INTO admin_audit_logs (
  admin_user_id,
  action,
  resource_type,
  resource_id,
  old_values,
  new_values,
  ip_address,
  user_agent
) VALUES (
  'admin-user-uuid',
  'update',
  'feature_flag',
  'enable_geolocation',
  '{"is_enabled": true}',
  '{"is_enabled": false}',
  '192.168.1.1',
  'Mozilla/5.0...'
);
```

**Dashboard View**: `/admin/audit-logs`

```
📋 Recent Flag Toggles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2025-11-22 14:35  admin@utm.one  enable_geolocation   ON → OFF
2025-11-22 10:12  admin@utm.one  maintenance_mode     OFF → ON
2025-11-21 18:45  admin@utm.one  enable_batch_processing   ON → OFF
```

---

## Alternatives Considered

### Option 1: Environment Variables

**Pros**:
- Simple (no database table)
- Fast (no lookup overhead)

**Cons**:
- ❌ Requires redeployment to change
- ❌ No admin UI
- ❌ No audit trail

**Decision**: ❌ Rejected - fails "instant control" requirement

### Option 2: Config File (YAML/JSON)

**Pros**:
- Human-readable
- Version controlled (Git)

**Cons**:
- ❌ Requires redeployment to change
- ❌ No runtime toggling
- ❌ No admin UI

**Decision**: ❌ Rejected - same issues as env vars

### Option 3: Redis

**Pros**:
- Extremely low latency (< 5ms)
- Native pub/sub for instant propagation
- High throughput (10k+ ops/sec)

**Cons**:
- External service ($15-30/month)
- Ephemeral (data loss if Redis crashes)
- Requires separate deployment

**Decision**: ❌ Rejected - Deno KV provides sufficient performance at zero additional cost

### Option 4: Hardcoded Flags (No System)

**Pros**:
- Zero overhead
- Maximum simplicity

**Cons**:
- ❌ Cannot toggle at runtime
- ❌ No emergency kill switch
- ❌ Cannot experiment with features

**Decision**: ❌ Rejected - fails all requirements

---

## Future Enhancements

### 1. Percentage-Based Rollouts

Add `rollout_percentage` to metadata:

```sql
UPDATE feature_flags
SET metadata = '{"rollout_percentage": 10}'::jsonb
WHERE flag_key = 'enable_new_feature';
```

**Usage**:
```typescript
const flag = await getFeatureFlagWithMetadata('enable_new_feature');
if (flag.is_enabled && Math.random() * 100 < flag.metadata.rollout_percentage) {
  // Feature enabled for 10% of requests
}
```

**Benefit**: Gradual rollout with instant adjustment  
**Complexity**: Low (add metadata parsing)  
**Priority**: High

### 2. User/Workspace-Specific Flags

Enable feature for specific users or workspaces:

```sql
UPDATE feature_flags
SET metadata = '{"enabled_workspaces": ["workspace-uuid-1", "workspace-uuid-2"]}'::jsonb
WHERE flag_key = 'enable_beta_feature';
```

**Usage**:
```typescript
const flag = await getFeatureFlagForWorkspace('enable_beta_feature', workspaceId);
```

**Benefit**: Beta testing with specific customers  
**Complexity**: Moderate (add workspace filtering)  
**Priority**: Medium

### 3. Scheduled Flag Toggles

Schedule flag changes in advance:

```sql
INSERT INTO feature_flag_schedules (flag_key, enabled_at, disabled_at) VALUES
  ('enable_campaign_feature', '2025-12-01 00:00:00', '2025-12-15 00:00:00');
```

**Benefit**: Automated feature windows (holiday campaigns, etc.)  
**Complexity**: High (requires cron job, state management)  
**Priority**: Low

---

## Related ADRs

- [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md) - Overall performance strategy
- [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md) - Caching pattern for flag reads
- [ADR-005: Testing Discipline](./ADR-005-testing-discipline.md) - Testing feature flag behavior

---

## References

- [Deno KV Documentation](https://deno.com/kv)
- Code: `src/hooks/useFeatureFlags.tsx`
- Code: `supabase/functions/redirect/index.ts` (flag usage examples)
- Memory: `architecture/feature-flags-runtime-control`

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)
**Status**: ✅ Accepted and Implemented
