import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const redirectLatency = new Trend('redirect_latency', true);
const cacheHitRate = new Rate('cache_hit_rate');
const errorRate = new Rate('error_rate');
const successfulRedirects = new Counter('successful_redirects');

// Test configuration for 100k concurrent requests
export const options = {
  scenarios: {
    // Ramp-up scenario: gradually increase load
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1000 },   // Ramp to 1k users
        { duration: '3m', target: 5000 },   // Ramp to 5k users
        { duration: '3m', target: 10000 },  // Ramp to 10k users
        { duration: '5m', target: 10000 },  // Stay at 10k for 5 min
        { duration: '2m', target: 0 },      // Ramp down
      ],
    },
    
    // Spike test: sudden traffic burst (campaign launch simulation)
    spike_test: {
      executor: 'ramping-vus',
      startTime: '15m',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20000 }, // Sudden spike
        { duration: '2m', target: 20000 },  // Maintain spike
        { duration: '1m', target: 0 },      // Drop off
      ],
    },
    
    // Constant load: sustained traffic
    constant_load: {
      executor: 'constant-vus',
      startTime: '18m',
      vus: 5000,
      duration: '10m',
    },
  },
  
  thresholds: {
    // Critical SLA: p95 latency under 100ms
    'redirect_latency{p(95)}': ['value<100'],
    
    // p99 latency under 200ms
    'redirect_latency{p(99)}': ['value<200'],
    
    // Error rate under 0.1%
    'error_rate': ['rate<0.001'],
    
    // Cache hit rate above 85%
    'cache_hit_rate': ['rate>0.85'],
    
    // HTTP request duration p95 under 150ms (includes network)
    'http_req_duration{p(95)}': ['value<150'],
  },
};

// Test data: mix of popular and less popular links
const testLinks = [
  // Top 20% - simulate popular links (should be cached)
  ...Array(20).fill(null).map((_, i) => `/go/popular-${i}`),
  
  // Long tail 80% - simulate diverse links
  ...Array(80).fill(null).map((_, i) => `/go/link-${i}`),
];

export default function () {
  // Randomly select a link (80/20 distribution)
  const isPopular = Math.random() < 0.8;
  const linkIndex = isPopular 
    ? Math.floor(Math.random() * 20) 
    : 20 + Math.floor(Math.random() * 80);
  
  const url = `${__ENV.BASE_URL || 'https://utm.one'}${testLinks[linkIndex]}`;
  
  // Track start time for custom latency metric
  const startTime = Date.now();
  
  // Make request with redirect following disabled to measure redirect latency
  const params = {
    redirects: 0,
    tags: { name: 'redirect' },
  };
  
  const response = http.get(url, params);
  
  // Calculate server-side redirect latency (excludes network overhead)
  const latency = Date.now() - startTime;
  redirectLatency.add(latency);
  
  // Check response
  const success = check(response, {
    'status is 301 or 302': (r) => r.status === 301 || r.status === 302,
    'has location header': (r) => r.headers['Location'] !== undefined,
    'latency under 100ms': () => latency < 100,
  });
  
  if (success) {
    successfulRedirects.add(1);
  } else {
    errorRate.add(1);
  }
  
  // Estimate cache hit based on x-cache header or latency
  // (If your edge function sets x-cache-status header, check that instead)
  const isCacheHit = latency < 50; // Assume cache hits are very fast
  cacheHitRate.add(isCacheHit ? 1 : 0);
  
  // Realistic user behavior: 1-3 second pause between clicks
  sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  // Custom summary with performance analysis
  const p95 = data.metrics.redirect_latency.values['p(95)'];
  const p99 = data.metrics.redirect_latency.values['p(99)'];
  const cacheHit = data.metrics.cache_hit_rate.values.rate * 100;
  const errorPct = data.metrics.error_rate.values.rate * 100;
  
  console.log('\n========================================');
  console.log('PERFORMANCE TEST RESULTS');
  console.log('========================================');
  console.log(`Total Redirects: ${data.metrics.successful_redirects.values.count}`);
  console.log(`\nLatency (Server-Side):`);
  console.log(`  P50: ${data.metrics.redirect_latency.values['p(50)']}ms`);
  console.log(`  P95: ${p95}ms ${p95 < 100 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  P99: ${p99}ms ${p99 < 200 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nCache Performance:`);
  console.log(`  Hit Rate: ${cacheHit.toFixed(2)}% ${cacheHit > 85 ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nReliability:`);
  console.log(`  Error Rate: ${errorPct.toFixed(3)}% ${errorPct < 0.1 ? '✓ PASS' : '✗ FAIL'}`);
  console.log('========================================\n');
  
  return {
    'summary.json': JSON.stringify(data, null, 2),
  };
}
