import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private client: RedisClientType;
  private readonly LINK_TTL = 300; // 5 minutes

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
    
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async connect() {
    await this.client.connect();
    console.log('✓ Redis cache connected');
  }

  async getLink(slug: string): Promise<any | null> {
    try {
      const cached = await this.client.get(`link:${slug}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setLink(slug: string, linkData: any): Promise<void> {
    try {
      await this.client.setEx(
        `link:${slug}`,
        this.LINK_TTL,
        JSON.stringify(linkData)
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidate(slug: string): Promise<void> {
    try {
      await this.client.del(`link:${slug}`);
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }
}
