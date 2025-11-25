import { Pool } from 'pg';
import { CacheService } from './cache';
import { AnalyticsService } from './analytics';

export interface RedirectContext {
  ip: string;
  userAgent: string;
  referrer?: string;
}

export interface RedirectResult {
  destinationUrl: string;
  linkId: string;
}

export class RedirectService {
  private pool: Pool;

  constructor(
    databaseUrl: string,
    private cache: CacheService,
    private analytics: AnalyticsService
  ) {
    this.pool = new Pool({ connectionString: databaseUrl });
  }

  async initialize() {
    // Test database connection
    try {
      await this.pool.query('SELECT 1');
      console.log('✓ Database connected');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async handleRedirect(
    slug: string,
    context: RedirectContext
  ): Promise<RedirectResult | null> {
    // Check cache first
    let linkData = await this.cache.getLink(slug);

    // If not in cache, fetch from database
    if (!linkData) {
      const result = await this.pool.query(
        `SELECT id, destination_url, status, expires_at 
         FROM links 
         WHERE slug = $1 AND status = 'active'`,
        [slug]
      );

      if (result.rows.length === 0) {
        return null;
      }

      linkData = result.rows[0];

      // Check expiration
      if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
        return null;
      }

      // Cache the link
      await this.cache.setLink(slug, linkData);
    }

    // Track click asynchronously (don't block redirect)
    this.analytics.trackClick(linkData.id, context).catch(console.error);

    return {
      destinationUrl: linkData.destination_url,
      linkId: linkData.id,
    };
  }
}
