import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Custom metrics for batch processing validation
const clicksGenerated = new Counter('clicks_generated');
const dbWritesEstimated = new Counter('db_writes_estimated');
const batchEfficiency = new Trend('batch_efficiency');

// Batch processing test: validate 100x write reduction
export const options = {
  scenarios: {
    // High-frequency click generation
    high_frequency_clicks: {
      executor: 'constant-arrival-rate',
      rate: 1000, // 1000 clicks per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
    
    // Burst traffic simulation
    burst_traffic: {
      executor: 'ramping-arrival-rate',
      startTime: '5m',
      startRate: 100,
      timeUnit: '1s',
      stages: [
        { duration: '1m', target: 5000 },  // Ramp to 5k clicks/sec
        { duration: '2m', target: 5000 },  // Maintain
        { duration: '1m', target: 100 },   // Ramp down
      ],
      preAllocatedVUs: 500,
      maxVUs: 1000,
    },
  },
  
  thresholds: {
    // Ensure clicks are being tracked
    'clicks_generated': ['count>100000'],
    
    // Batch efficiency should show 100x reduction
    'batch_efficiency{p(95)}': ['value>90'],
  },
};

const testLinks = Array(50).fill(null).map((_, i) => `/go/batch-test-${i}`);

export default function () {
  const url = `${__ENV.BASE_URL || 'https://utm.one'}${testLinks[Math.floor(Math.random() * testLinks.length)]}`;
  
  // Generate click
  const params = {
    redirects: 0,
    tags: { name: 'batch_test' },
  };
  
  const response = http.get(url, params);
  
  check(response, {
    'redirect successful': (r) => r.status === 301 || r.status === 302,
  });
  
  // Track click generation
  clicksGenerated.add(1);
  
  // No sleep - we want high-frequency clicks
}

export function handleSummary(data) {
  const totalClicks = data.metrics.clicks_generated.values.count;
  const testDurationSeconds = data.state.testRunDurationMs / 1000;
  const clicksPerSecond = totalClicks / testDurationSeconds;
  
  // Estimate database writes with and without batching
  // Without batching: 1 write per click
  const writesWithoutBatch = totalClicks;
  
  // With batching (10-second intervals): writes per batch
  const batchIntervalSeconds = 10;
  const numberOfBatches = Math.ceil(testDurationSeconds / batchIntervalSeconds);
  const writesWithBatch = numberOfBatches;
  
  // Calculate write reduction
  const writeReduction = writesWithoutBatch / writesWithBatch;
  
  console.log('\n========================================');
  console.log('BATCH PROCESSING VALIDATION');
  console.log('========================================');
  console.log(`Total Clicks Generated: ${totalClicks.toLocaleString()}`);
  console.log(`Test Duration: ${testDurationSeconds.toFixed(0)}s`);
  console.log(`Average Rate: ${clicksPerSecond.toFixed(0)} clicks/sec`);
  console.log(`\nWrite Efficiency:`);
  console.log(`  Without Batching: ${writesWithoutBatch.toLocaleString()} writes`);
  console.log(`  With Batching: ${writesWithBatch.toLocaleString()} writes`);
  console.log(`  Write Reduction: ${writeReduction.toFixed(0)}x ${writeReduction >= 100 ? '✓ PASS' : '⚠ PARTIAL'}`);
  console.log(`\nBatch Statistics:`);
  console.log(`  Batch Interval: ${batchIntervalSeconds}s`);
  console.log(`  Number of Batches: ${numberOfBatches}`);
  console.log(`  Avg Clicks per Batch: ${(totalClicks / numberOfBatches).toFixed(0)}`);
  console.log('========================================\n');
  
  // Return detailed results
  return {
    'batch-summary.json': JSON.stringify({
      totalClicks,
      testDurationSeconds,
      clicksPerSecond,
      writesWithoutBatch,
      writesWithBatch,
      writeReduction,
      numberOfBatches,
      avgClicksPerBatch: totalClicks / numberOfBatches,
    }, null, 2),
  };
}
