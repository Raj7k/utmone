import express from 'express';
import { config } from './config';
import { RedirectService } from './redirect';
import { AnalyticsService } from './analytics';
import { CacheService } from './cache';

const app = express();

// Initialize services
const cacheService = new CacheService(config.redisUrl);
const analyticsService = new AnalyticsService(config.databaseUrl);
const redirectService = new RedirectService(
  config.databaseUrl,
  cacheService,
  analyticsService
);

// Middleware
app.use(express.json());

// Metrics storage
let metrics = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  redirectsSuccess: 0,
  redirectsNotFound: 0,
  redirectsError: 0,
  avgLatency: 0,
  latencySum: 0,
};

// Prometheus-compatible metrics endpoint
app.get('/metrics', (req, res) => {
  const hitRate = metrics.totalRequests > 0 
    ? (metrics.cacheHits / metrics.totalRequests * 100).toFixed(2)
    : 0;
  
  const avgLatency = metrics.totalRequests > 0
    ? (metrics.latencySum / metrics.totalRequests).toFixed(2)
    : 0;

  const metricsOutput = `
# HELP utm_one_requests_total Total number of redirect requests
# TYPE utm_one_requests_total counter
utm_one_requests_total ${metrics.totalRequests}

# HELP utm_one_cache_hits_total Total number of cache hits
# TYPE utm_one_cache_hits_total counter
utm_one_cache_hits_total ${metrics.cacheHits}

# HELP utm_one_cache_misses_total Total number of cache misses
# TYPE utm_one_cache_misses_total counter
utm_one_cache_misses_total ${metrics.cacheMisses}

# HELP utm_one_cache_hit_rate Cache hit rate percentage
# TYPE utm_one_cache_hit_rate gauge
utm_one_cache_hit_rate ${hitRate}

# HELP utm_one_redirects_success_total Successful redirects
# TYPE utm_one_redirects_success_total counter
utm_one_redirects_success_total ${metrics.redirectsSuccess}

# HELP utm_one_redirects_not_found_total Redirects not found
# TYPE utm_one_redirects_not_found_total counter
utm_one_redirects_not_found_total ${metrics.redirectsNotFound}

# HELP utm_one_redirects_error_total Redirect errors
# TYPE utm_one_redirects_error_total counter
utm_one_redirects_error_total ${metrics.redirectsError}

# HELP utm_one_latency_avg_ms Average redirect latency in milliseconds
# TYPE utm_one_latency_avg_ms gauge
utm_one_latency_avg_ms ${avgLatency}
`;

  res.set('Content-Type', 'text/plain');
  res.send(metricsOutput);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Redirect handler - matches any path
app.get('*', async (req, res) => {
  const startTime = Date.now();
  const path = req.path.substring(1); // Remove leading slash
  
  if (!path) {
    return res.status(404).send('Not Found');
  }

  metrics.totalRequests++;

  try {
    const result = await redirectService.handleRedirect(path, {
      ip: req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      referrer: req.headers['referer'] || req.headers['referrer'] as string,
    });

    const latency = Date.now() - startTime;
    metrics.latencySum += latency;

    if (!result) {
      metrics.cacheMisses++;
      metrics.redirectsNotFound++;
      return res.status(404).send('Link not found');
    }

    // Track cache hit/miss
    if (result.fromCache) {
      metrics.cacheHits++;
    } else {
      metrics.cacheMisses++;
    }
    
    metrics.redirectsSuccess++;

    // 302 redirect with no-cache headers
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    res.redirect(302, result.destinationUrl);
  } catch (error) {
    metrics.redirectsError++;
    console.error('Redirect error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
const PORT = config.port;

async function start() {
  await cacheService.connect();
  await redirectService.initialize();
  
  app.listen(PORT, () => {
    console.log(`✓ Redirect service listening on port ${PORT}`);
    console.log(`✓ Redis connected: ${config.redisUrl}`);
    console.log(`✓ Database connected: ${config.databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  });
}

start().catch(console.error);
