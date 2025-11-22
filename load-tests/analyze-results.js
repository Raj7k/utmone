#!/usr/bin/env node

/**
 * Load Test Results Analyzer
 * 
 * Analyzes k6 JSON output and generates detailed performance report
 * Usage: node analyze-results.js summary.json
 */

const fs = require('fs');

function analyzeResults(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Extract key metrics
  const metrics = data.metrics;
  const state = data.state;
  
  // Redirect latency analysis
  const redirectLatency = metrics.redirect_latency?.values || {};
  const p50 = redirectLatency['p(50)'] || 0;
  const p95 = redirectLatency['p(95)'] || 0;
  const p99 = redirectLatency['p(99)'] || 0;
  const max = redirectLatency.max || 0;
  
  // Cache performance
  const cacheHitRate = metrics.cache_hit_rate?.values?.rate || 0;
  
  // Reliability
  const errorRate = metrics.error_rate?.values?.rate || 0;
  const successfulRedirects = metrics.successful_redirects?.values?.count || 0;
  
  // HTTP request metrics
  const httpReqDuration = metrics.http_req_duration?.values || {};
  const httpP95 = httpReqDuration['p(95)'] || 0;
  
  // Test duration
  const durationMs = state.testRunDurationMs || 0;
  const durationMin = (durationMs / 1000 / 60).toFixed(1);
  
  // Calculate throughput
  const requestsPerSecond = successfulRedirects / (durationMs / 1000);
  
  // Pass/fail checks
  const checks = {
    p95Latency: p95 < 100,
    p99Latency: p99 < 200,
    cacheHit: cacheHitRate > 0.85,
    errorRate: errorRate < 0.001,
    httpP95: httpP95 < 150,
  };
  
  const allPassed = Object.values(checks).every(v => v);
  
  // Generate report
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║       LOAD TEST PERFORMANCE REPORT                ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 TEST SUMMARY`);
  console.log(`   Duration: ${durationMin} minutes`);
  console.log(`   Total Requests: ${successfulRedirects.toLocaleString()}`);
  console.log(`   Throughput: ${requestsPerSecond.toFixed(0)} req/s\n`);
  
  console.log(`⚡ REDIRECT LATENCY (Server-Side)`);
  console.log(`   P50: ${p50.toFixed(2)}ms`);
  console.log(`   P95: ${p95.toFixed(2)}ms ${checks.p95Latency ? '✓' : '✗'} (target: <100ms)`);
  console.log(`   P99: ${p99.toFixed(2)}ms ${checks.p99Latency ? '✓' : '✗'} (target: <200ms)`);
  console.log(`   Max: ${max.toFixed(2)}ms\n`);
  
  console.log(`🌐 HTTP REQUEST DURATION (Including Network)`);
  console.log(`   P95: ${httpP95.toFixed(2)}ms ${checks.httpP95 ? '✓' : '✗'} (target: <150ms)\n`);
  
  console.log(`💾 CACHE PERFORMANCE`);
  console.log(`   Hit Rate: ${(cacheHitRate * 100).toFixed(2)}% ${checks.cacheHit ? '✓' : '✗'} (target: >85%)\n`);
  
  console.log(`🛡️ RELIABILITY`);
  console.log(`   Error Rate: ${(errorRate * 100).toFixed(3)}% ${checks.errorRate ? '✓' : '✗'} (target: <0.1%)\n`);
  
  console.log(`\n${'='.repeat(56)}`);
  console.log(`OVERALL: ${allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
  console.log(`${'='.repeat(56)}\n`);
  
  // Performance grade
  let grade = 'F';
  if (allPassed) grade = 'A';
  else if (checks.p95Latency && checks.cacheHit) grade = 'B';
  else if (checks.p95Latency || checks.cacheHit) grade = 'C';
  else if (checks.errorRate) grade = 'D';
  
  console.log(`PERFORMANCE GRADE: ${grade}\n`);
  
  // Recommendations
  if (!allPassed) {
    console.log(`📝 RECOMMENDATIONS:\n`);
    
    if (!checks.p95Latency) {
      console.log(`   • P95 latency exceeded target - consider:`);
      console.log(`     - Increase Deno KV cache TTL`);
      console.log(`     - Add database read replicas`);
      console.log(`     - Optimize database indexes`);
      console.log(`     - Check for edge function cold starts\n`);
    }
    
    if (!checks.cacheHit) {
      console.log(`   • Cache hit rate below target - consider:`);
      console.log(`     - Verify feature flag 'enable_cache' is true`);
      console.log(`     - Check Deno KV availability`);
      console.log(`     - Increase cache TTL (currently 5 minutes)`);
      console.log(`     - Review cache invalidation strategy\n`);
    }
    
    if (!checks.errorRate) {
      console.log(`   • Error rate exceeded threshold - investigate:`);
      console.log(`     - Check rate limiting configuration`);
      console.log(`     - Verify test links exist in database`);
      console.log(`     - Review edge function error logs`);
      console.log(`     - Check domain verification status\n`);
    }
  }
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Main
if (process.argv.length < 3) {
  console.error('Usage: node analyze-results.js <summary.json>');
  process.exit(1);
}

const filePath = process.argv[2];
if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

analyzeResults(filePath);
