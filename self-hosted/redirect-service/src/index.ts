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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Redirect handler - matches any path
app.get('*', async (req, res) => {
  const path = req.path.substring(1); // Remove leading slash
  
  if (!path) {
    return res.status(404).send('Not Found');
  }

  try {
    const result = await redirectService.handleRedirect(path, {
      ip: req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      referrer: req.headers['referer'] || req.headers['referrer'] as string,
    });

    if (!result) {
      return res.status(404).send('Link not found');
    }

    // 302 redirect with no-cache headers
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    res.redirect(302, result.destinationUrl);
  } catch (error) {
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
