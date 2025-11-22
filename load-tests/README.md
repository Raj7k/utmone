# Load Testing for utm.one

Comprehensive load testing suite to validate performance claims:
- ✅ Sub-100ms p95 redirect latency
- ✅ 100x write reduction via batch processing
- ✅ 85%+ cache hit rate
- ✅ Handle 100k concurrent requests

## Prerequisites

Install k6:
```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6

# Docker
docker pull grafana/k6
```

## Test Suites

### 1. Redirect Performance Test
Validates redirect latency under various load patterns.

**Run locally (development):**
```bash
k6 run --env BASE_URL=http://localhost:54321/functions/v1/redirect/utm.one load-tests/redirect-performance.js
```

**Run against production:**
```bash
k6 run --env BASE_URL=https://utm.one load-tests/redirect-performance.js
```

**Key Metrics:**
- p95 redirect latency < 100ms
- p99 latency < 200ms
- Cache hit rate > 85%
- Error rate < 0.1%

**Test Scenarios:**
1. **Ramp-up:** Gradually increase from 0 → 10k concurrent users
2. **Spike test:** Sudden burst to 20k users (campaign launch simulation)
3. **Constant load:** Sustained 5k users for 10 minutes

**Total test duration:** ~30 minutes
**Peak concurrent VUs:** 20,000
**Expected requests:** 100k+


### 2. Batch Processing Validation
Validates 100x write reduction claim via batch queue system.

**Run:**
```bash
k6 run --env BASE_URL=https://utm.one load-tests/batch-processing.js
```

**Key Metrics:**
- Total clicks generated > 100k
- Write reduction > 100x
- Batch efficiency > 90%

**Test Scenarios:**
1. **High-frequency clicks:** 1,000 clicks/second sustained
2. **Burst traffic:** Ramp to 5,000 clicks/second

**Total test duration:** ~9 minutes
**Expected clicks:** 200k+
**Expected write reduction:** 100-150x


## Interpreting Results

### Success Criteria

✅ **PASS** if all conditions met:
- p95 latency < 100ms
- Cache hit rate > 85%
- Error rate < 0.1%
- Write reduction > 100x

⚠️ **PARTIAL** if most conditions met but some marginal

❌ **FAIL** if critical thresholds missed


### Sample Output

```
========================================
PERFORMANCE TEST RESULTS
========================================
Total Redirects: 156,432

Latency (Server-Side):
  P50: 42ms
  P95: 87ms ✓ PASS
  P99: 156ms ✓ PASS

Cache Performance:
  Hit Rate: 88.34% ✓ PASS

Reliability:
  Error Rate: 0.043% ✓ PASS
========================================
```


## Before Running Production Tests

### 1. Create Test Links
```bash
# SSH into production or use API to create test links
# Create 100 test links: utm.one/go/popular-{0-19} and utm.one/go/link-{0-79}
```

### 2. Warm Up Cache
```bash
# Run a small warm-up test first
k6 run --vus 10 --duration 1m load-tests/redirect-performance.js
```

### 3. Monitor Infrastructure
- Open Supabase dashboard (database metrics)
- Open System Monitoring page (feature flags, queue health)
- Watch edge function logs:
```bash
supabase functions logs redirect --tail
supabase functions logs process-click-queue --tail
```


## Advanced Configuration

### Customize VU Stages
Edit `redirect-performance.js`:
```javascript
stages: [
  { duration: '5m', target: 50000 },  // Your custom load
]
```

### Adjust Thresholds
```javascript
thresholds: {
  'redirect_latency{p(95)}': ['value<50'],  // Stricter threshold
}
```

### Run Subset of Scenarios
```bash
# Run only spike test
k6 run --scenarios spike_test load-tests/redirect-performance.js
```


## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Load Test
  run: |
    k6 run --out json=results.json load-tests/redirect-performance.js
    
- name: Check Thresholds
  run: |
    if grep -q "✗ FAIL" results.json; then
      echo "Load test failed"
      exit 1
    fi
```


## Troubleshooting

**High latency:**
- Check Deno KV cache hit rate
- Verify database indexes exist
- Check edge function cold starts

**High error rate:**
- Check rate limiting configuration
- Verify test links exist in database
- Check domain verification status

**Low cache hit rate:**
- Verify feature flag `enable_cache` is true
- Check Deno KV availability
- Increase cache TTL in redirect function


## Results Archive

Store results for comparison:
```bash
mkdir -p load-tests/results
k6 run load-tests/redirect-performance.js | tee load-tests/results/$(date +%Y%m%d-%H%M%S).log
```


## Support

For questions or issues:
1. Check edge function logs
2. Review System Monitoring dashboard
3. Verify feature flags are enabled
4. Check Supabase connection health
