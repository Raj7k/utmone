import { Pool } from 'pg';
import UAParser from 'ua-parser-js';
import { RedirectContext } from './redirect';

export class AnalyticsService {
  private pool: Pool;
  private parser: UAParser;

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl });
    this.parser = new UAParser();
  }

  async trackClick(linkId: string, context: RedirectContext): Promise<void> {
    try {
      const ua = this.parser.setUA(context.userAgent).getResult();

      await this.pool.query(
        `INSERT INTO link_clicks (
          link_id, ip_address, user_agent, referrer,
          device_type, os, browser, clicked_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          linkId,
          context.ip,
          context.userAgent,
          context.referrer || null,
          ua.device.type || 'desktop',
          ua.os.name || 'unknown',
          ua.browser.name || 'unknown',
        ]
      );

      // Update link stats
      await this.pool.query(
        `UPDATE links 
         SET total_clicks = COALESCE(total_clicks, 0) + 1,
             last_clicked_at = NOW()
         WHERE id = $1`,
        [linkId]
      );
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics failures shouldn't break redirects
    }
  }
}
