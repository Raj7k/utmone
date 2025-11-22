# ADR-005: Testing Discipline & Load Testing Standards

## Metadata

- **ADR Number**: 005
- **Title**: k6 Load Testing Standards and CI/CD Integration
- **Status**: ✅ Accepted
- **Date**: 2025-11-22
- **Authors**: Engineering Team
- **Supersedes**: None
- **Related**: [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md)

---

## Context

### Problem Statement

Performance regressions are difficult to detect without systematic load testing:

**Real-World Incidents** (prior to testing discipline):
1. **N+1 Query Bug**: Nested link lookup caused 300ms latency regression (undetected for 2 weeks)
2. **Geolocation Blocking**: Synchronous IP lookup added 500ms to redirect path (discovered in production)
3. **Cache Invalidation Bug**: Missing cache eviction caused stale redirects (customer report)
4. **Batch Queue Overflow**: Queue depth exceeded limit during campaign launch (data loss)

**Root Cause**: No automated performance validation before production deployment.

### Requirements

- **Prevent Regressions**: Catch performance degradations before production
- **SLA Enforcement**: Block deployments that fail SLA targets (p95 < 100ms)
- **Continuous Validation**: Test on every PR, merge, and deployment
- **Realistic Load**: Simulate campaign launches (10k-50k clicks/hour bursts)
- **Fast Feedback**: PR smoke tests complete in < 5 minutes
- **Cost Effective**: Use existing infrastructure (no dedicated load testing environment)

---

## Decision

### Selected Solution: k6 Load Testing with GitHub Actions CI/CD

Implement **comprehensive load testing suite** using:
1. **k6 Testing Tool**: JavaScript-based load testing with Grafana ecosystem
2. **GitHub Actions**: CI/CD integration for automated testing
3. **Test Scenarios**: Redirect performance, batch processing, and smoke tests
4. **Performance Baselines**: Historical tracking with regression detection
5. **Automated Gating**: Block merges/deployments on SLA failures

### Why k6?

| Criteria | k6 | Artillery | Gatling | JMeter | Winner |
|----------|-----|-----------|---------|--------|--------|
| **JavaScript/TypeScript** | ✅ Yes | ✅ Yes | ❌ Scala/Java | ❌ Java | ✅ k6 / Artillery |
| **VUs (Virtual Users)** | 30k+ | 20k+ | 10k+ | 5k+ | ✅ k6 |
| **Scripting** | Simple JS | YAML + JS | DSL | XML GUI | ✅ k6 |
| **CI/CD Integration** | Native | Native | Moderate | Complex | ✅ k6 / Artillery |
| **Grafana Ecosystem** | ✅ Native | ⚠️ Plugin | ⚠️ Plugin | ❌ No | ✅ k6 |
| **Open Source** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ All |
| **Learning Curve** | Low | Low | Medium | High | ✅ k6 / Artillery |

**Verdict**: k6 provides best balance of performance, simplicity, and ecosystem integration.

---

## Implementation

### 1. Test Suite Structure

**Location**: `/load-tests/`

```
load-tests/
├── README.md                     # Load testing documentation
├── redirect-performance.js       # Full redirect test (40 min, 20k VUs)
├── batch-processing.js           # Batch queue validation (20 min, 10k VUs)
├── smoke-test.js                 # Quick CI/CD test (2 min, 1k VUs)
├── analyze-results.js            # Results analysis script
├── setup-test-data.sql           # Database seeding script
└── .github/
    └── workflows/
        ├── load-testing.yml      # PR and main branch tests
        └── scheduled-load-test.yml  # Weekly comprehensive tests
```

### 2. Core Test: Redirect Performance

**File**: `load-tests/redirect-performance.js`

**Purpose**: Validate redirect latency, cache effectiveness, and error rate under load.

**Scenarios**:
1. **Warm-up**: 30 seconds, 100 VUs (cache warming)
2. **Ramp-up**: 5 minutes, 100 → 5000 VUs (gradual load increase)
3. **Sustained Load**: 20 minutes, 5000 VUs (steady state)
4. **Spike Test**: 5 minutes, 5000 → 20000 VUs (campaign launch simulation)
5. **Recovery**: 5 minutes, 20000 → 0 VUs (cool down)
6. **Constant Load**: 5 minutes, 10000 VUs (high sustained traffic)

**Success Thresholds**:
```javascript
export const options = {
  thresholds: {
    'http_req_duration{type:redirect}': ['p95<100'], // p95 latency < 100ms
    'http_req_failed': ['rate<0.001'],              // Error rate < 0.1%
    'cache_hit_rate': ['value>0.85'],               // Cache hit > 85%
    'http_req_duration{cached:true}': ['p95<20'],   // Cached redirect < 20ms
  },
  stages: [
    { duration: '30s', target: 100 },    // Warm-up
    { duration: '5m', target: 5000 },    // Ramp-up
    { duration: '20m', target: 5000 },   // Sustained
    { duration: '5m', target: 20000 },   // Spike
    { duration: '5m', target: 0 },       // Recovery
    { duration: '5m', target: 10000 },   // Constant
  ],
};
```

**Test Logic**:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const cacheHitRate = new Rate('cache_hit_rate');

export default function () {
  // Select random test link (from 1000 seeded links)
  const linkIndex = Math.floor(Math.random() * 1000) + 1;
  const url = `${BASE_URL}/go/test-${linkIndex}`;

  // Make request
  const response = http.get(url, {
    redirects: 0,          // Don't follow redirect
    tags: { type: 'redirect' },
  });

  // Check redirect status
  check(response, {
    'is redirect': (r) => r.status === 301 || r.status === 302,
    'has location': (r) => r.headers['Location'] !== undefined,
  });

  // Check cache header (custom header added by edge function)
  const cached = response.headers['X-Cache'] === 'HIT';
  cacheHitRate.add(cached ? 1 : 0);
  response.tags.cached = cached;

  sleep(0.1); // 100ms think time between requests
}
```

**Run Command**:
```bash
k6 run --out json=results.json load-tests/redirect-performance.js
```

### 3. Batch Processing Validation

**File**: `load-tests/batch-processing.js`

**Purpose**: Validate write reduction, queue depth, and data integrity.

**Scenarios**:
1. **High Volume Burst**: 10k VUs for 5 minutes (simulate campaign launch)
2. **Sustained Traffic**: 5k VUs for 10 minutes (sustained high traffic)
3. **Validation**: Check database writes vs expected

**Success Thresholds**:
```javascript
export const options = {
  thresholds: {
    'batch_write_reduction': ['value>100'],  // Write reduction > 100x
    'queue_depth': ['max<5000'],             // Queue never overflows
    'data_integrity': ['rate>0.999'],        // No data loss (>99.9%)
  },
  stages: [
    { duration: '5m', target: 10000 },  // Burst
    { duration: '10m', target: 5000 },  // Sustained
    { duration: '1m', target: 0 },      // Drain queue
  ],
};
```

**Test Logic**:
```javascript
export default function () {
  const linkIndex = Math.floor(Math.random() * 1000) + 1;
  const url = `${BASE_URL}/go/test-${linkIndex}`;

  http.get(url, { redirects: 0 });
  sleep(0.5); // 500ms think time (sustained load)
}

export function teardown(data) {
  // After test: validate write reduction
  const totalClicks = getTotalClicks(); // From test data
  const dbWrites = getDBWrites();       // From database metrics

  const writeReduction = totalClicks / dbWrites;
  console.log(`Write reduction: ${writeReduction}x`);
  
  check(null, {
    'write reduction > 100x': () => writeReduction > 100,
  });
}
```

### 4. CI/CD Smoke Test

**File**: `load-tests/smoke-test.js`

**Purpose**: Quick validation for PR feedback loop (< 5 min total runtime).

**Scenarios**:
1. **Quick Ramp**: 30s, 0 → 500 VUs
2. **Sustained Load**: 1 min, 500 VUs
3. **Ramp Down**: 30s, 500 → 0 VUs

**Success Thresholds**: Same as full test (p95 < 100ms, error < 0.1%, cache > 85%)

**Run Command**:
```bash
k6 run --duration 2m --vus 500 load-tests/smoke-test.js
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/load-testing.yml`

**Triggers**:
- **Pull Request**: Run smoke test (2 min)
- **Main Branch Merge**: Run full test suite (40 min)
- **Production Deploy**: Run production smoke test (3 min)

**Workflow Structure**:

```yaml
name: Load Testing

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  smoke-test:
    name: PR Smoke Test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
          sudo mv k6-v0.47.0-linux-amd64/k6 /usr/local/bin/
      
      - name: Setup test data
        run: |
          psql $DATABASE_URL -f load-tests/setup-test-data.sql
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
      
      - name: Run smoke test
        run: |
          k6 run --out json=smoke-results.json load-tests/smoke-test.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      
      - name: Analyze results
        run: node load-tests/analyze-results.js smoke-results.json
      
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: smoke-test-results
          path: smoke-results.json
      
      - name: Comment PR
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const results = require('./smoke-results.json');
            const summary = `
            ## 🚀 Load Test Results
            
            - **p95 Latency**: ${results.p95}ms (target: <100ms)
            - **Cache Hit Rate**: ${results.cacheHitRate}% (target: >85%)
            - **Error Rate**: ${results.errorRate}% (target: <0.1%)
            - **Status**: ${results.passed ? '✅ PASSED' : '❌ FAILED'}
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });

  full-test:
    name: Full Load Test Suite
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Install k6
        run: |
          curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
          sudo mv k6-v0.47.0-linux-amd64/k6 /usr/local/bin/
      
      - name: Setup test data
        run: psql $DATABASE_URL -f load-tests/setup-test-data.sql
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
      
      - name: Run redirect performance test
        run: k6 run --out json=redirect-results.json load-tests/redirect-performance.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      
      - name: Run batch processing test
        run: k6 run --out json=batch-results.json load-tests/batch-processing.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      
      - name: Analyze results
        run: |
          node load-tests/analyze-results.js redirect-results.json
          node load-tests/analyze-results.js batch-results.json
      
      - name: Compare to baseline
        run: node load-tests/compare-baseline.js redirect-results.json
      
      - name: Update baseline
        if: success()
        run: |
          cp redirect-results.json .github/performance-baseline.json
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .github/performance-baseline.json
          git commit -m "Update performance baseline [skip ci]"
          git push
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: full-test-results
          path: |
            redirect-results.json
            batch-results.json
          retention-days: 90
```

### Results Analysis Script

**File**: `load-tests/analyze-results.js`

```javascript
const fs = require('fs');

const resultsFile = process.argv[2];
const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

// Extract key metrics
const p95Latency = results.metrics.http_req_duration.values['p(95)'];
const errorRate = results.metrics.http_req_failed.values.rate;
const cacheHitRate = results.metrics.cache_hit_rate?.values.rate || 0;

// Check thresholds
const passed = 
  p95Latency < 100 &&
  errorRate < 0.001 &&
  cacheHitRate > 0.85;

// Output summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Load Test Summary');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`p95 Latency:    ${p95Latency.toFixed(2)}ms ${p95Latency < 100 ? '✅' : '❌'} (target: <100ms)`);
console.log(`Error Rate:     ${(errorRate * 100).toFixed(3)}% ${errorRate < 0.001 ? '✅' : '❌'} (target: <0.1%)`);
console.log(`Cache Hit Rate: ${(cacheHitRate * 100).toFixed(1)}% ${cacheHitRate > 0.85 ? '✅' : '❌'} (target: >85%)`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Overall: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Exit with appropriate code
process.exit(passed ? 0 : 1);
```

### Baseline Comparison Script

**File**: `load-tests/compare-baseline.js`

```javascript
const fs = require('fs');

const currentFile = process.argv[2];
const baselineFile = '.github/performance-baseline.json';

const current = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

const currentP95 = current.metrics.http_req_duration.values['p(95)'];
const baselineP95 = baseline.metrics.http_req_duration.values['p(95)'];

const regression = ((currentP95 - baselineP95) / baselineP95) * 100;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📈 Regression Analysis');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Baseline p95:  ${baselineP95.toFixed(2)}ms`);
console.log(`Current p95:   ${currentP95.toFixed(2)}ms`);
console.log(`Regression:    ${regression > 0 ? '+' : ''}${regression.toFixed(1)}%`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Fail if regression > 10%
if (regression > 10) {
  console.error('❌ REGRESSION DETECTED: Latency increased by more than 10%');
  process.exit(1);
} else {
  console.log('✅ No significant regression');
  process.exit(0);
}
```

---

## Test Data Management

### Database Seeding

**File**: `load-tests/setup-test-data.sql`

**Purpose**: Create test workspace, domains, and 1000 links for load testing.

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

-- Create test user profile
INSERT INTO profiles (id, email, full_name, is_super_admin)
VALUES (
  'ci-test-user',
  'loadtest@utm.one',
  'Load Test User',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Create workspace membership
INSERT INTO workspace_members (user_id, workspace_id, role)
VALUES ('ci-test-user', 'ci-loadtest-workspace', 'workspace_admin')
ON CONFLICT (user_id, workspace_id) DO NOTHING;

-- Create test domain
INSERT INTO domains (
  id,
  domain,
  workspace_id,
  created_by,
  is_verified,
  is_primary
)
VALUES (
  'ci-loadtest-domain',
  'utm.one',
  'ci-loadtest-workspace',
  'ci-test-user',
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Create 1000 test links
INSERT INTO links (
  id,
  workspace_id,
  created_by,
  domain,
  path,
  slug,
  title,
  destination_url,
  final_url,
  status,
  total_clicks,
  unique_clicks
)
SELECT
  'ci-test-link-' || gs.id::text,
  'ci-loadtest-workspace',
  'ci-test-user',
  'utm.one',
  '/go/',
  'test-' || gs.id::text,
  'Load Test Link ' || gs.id::text,
  'https://example.com/destination-' || gs.id::text,
  'https://example.com/destination-' || gs.id::text,
  'active',
  0,
  0
FROM generate_series(1, 1000) AS gs(id)
ON CONFLICT (id) DO NOTHING;

-- Vacuum analyze for optimal query performance
VACUUM ANALYZE links;
VACUUM ANALYZE link_clicks;
VACUUM ANALYZE workspaces;
```

**Run Command**:
```bash
psql $STAGING_DATABASE_URL -f load-tests/setup-test-data.sql
```

---

## Performance Targets & SLAs

### Redirect Latency

| Metric | Target | Action on Failure |
|--------|--------|-------------------|
| **p50** | < 50ms | Warning (investigate) |
| **p95** | < 100ms | **FAIL CI** (block merge) |
| **p99** | < 200ms | Warning (acceptable outlier) |

### Cache Performance

| Metric | Target | Action on Failure |
|--------|--------|-------------------|
| **Cache Hit Rate** | > 85% | **FAIL CI** (investigate cache logic) |
| **Cached p95** | < 20ms | Warning (Deno KV slow) |
| **Uncached p95** | < 100ms | **FAIL CI** (DB query slow) |

### Error Rate

| Metric | Target | Action on Failure |
|--------|--------|-------------------|
| **Error Rate** | < 0.1% | **FAIL CI** (bugs in redirect logic) |
| **404 Rate** | < 1% | Warning (test data issue) |
| **5xx Rate** | < 0.01% | **FAIL CI** (server errors) |

### Batch Processing

| Metric | Target | Action on Failure |
|--------|--------|-------------------|
| **Write Reduction** | > 100x | Warning (queue not batching effectively) |
| **Queue Depth** | < 5000 | **FAIL CI** (overflow risk) |
| **Data Integrity** | > 99.9% | **FAIL CI** (data loss) |

---

## Monitoring & Observability

### Test Results Dashboard

**Location**: GitHub Actions Artifacts

**Artifacts Stored**:
- `smoke-results.json` (retained 30 days)
- `redirect-results.json` (retained 90 days)
- `batch-results.json` (retained 90 days)

**View Results**:
1. Navigate to GitHub Actions run
2. Download artifacts ZIP
3. Open JSON files for detailed metrics

### Historical Baseline Tracking

**File**: `.github/performance-baseline.json`

**Updated**: On every successful main branch full test

**Tracked Metrics**:
```json
{
  "date": "2025-11-22T14:35:00Z",
  "commit": "abc123def",
  "metrics": {
    "http_req_duration": {
      "values": {
        "p(95)": 78.5,
        "p(99)": 142.3
      }
    },
    "cache_hit_rate": { "values": { "rate": 0.872 } },
    "http_req_failed": { "values": { "rate": 0.0005 } }
  }
}
```

---

## Alternatives Considered

### Option 1: Artillery

**Pros**: Simple YAML config, good Node.js integration

**Cons**: Lower VU capacity (20k vs 30k+ for k6), less mature Grafana integration

**Decision**: ❌ Rejected - k6 provides better scale

### Option 2: Gatling

**Pros**: Very high throughput, mature enterprise tooling

**Cons**: Scala/Java DSL (higher learning curve), complex CI/CD setup

**Decision**: ❌ Rejected - overkill for our scale, team prefers JavaScript

### Option 3: JMeter

**Pros**: Mature ecosystem, GUI for test design

**Cons**: XML config, poor CI/CD integration, lower performance

**Decision**: ❌ Rejected - outdated UX, not developer-friendly

### Option 4: No Load Testing

**Pros**: Zero effort

**Cons**: ❌ No performance validation, regressions undetected

**Decision**: ❌ Rejected - unacceptable risk for production SLA

---

## Future Enhancements

### 1. Grafana Cloud Integration

Stream k6 results to Grafana Cloud for real-time dashboards.

**Benefit**: Live performance graphs during tests  
**Complexity**: Moderate (requires Grafana account, API keys)  
**Priority**: Medium

### 2. Geographic Load Testing

Run tests from multiple regions (US, EU, Asia) to validate CDN/latency.

**Benefit**: Catch region-specific performance issues  
**Complexity**: High (requires multi-region runners)  
**Priority**: Low

### 3. Chaos Engineering

Inject failures (DB outage, Deno KV unavailable) during load tests.

**Benefit**: Validate graceful degradation strategies  
**Complexity**: High (requires chaos tooling)  
**Priority**: Medium

---

## Related ADRs

- [ADR-001: Performance-First Architecture](./ADR-001-performance-first-architecture.md) - Overall performance strategy
- [ADR-002: Caching Strategy](./ADR-002-caching-strategy.md) - Validates cache performance
- [ADR-003: Batch Processing System](./ADR-003-batch-processing-system.md) - Validates write reduction

---

## References

- [k6 Documentation](https://k6.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
- Load Tests: `/load-tests/`
- Memory: `architecture/scalability-performance-priorities`

---

**Last Updated**: 2025-11-22  
**Next Review**: 2026-02-22 (quarterly)  
**Status**: ✅ Accepted and Implemented
