# utm.one Self-Hosting Guide

Deploy utm.one on your own infrastructure with Docker for complete data ownership and zero vendor lock-in.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 10GB disk space

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/utm-one/self-hosted.git
   cd self-hosted
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access utm.one**
   Open http://localhost:3000

## Configuration

### Environment Variables

Create a `.env` file with:

```env
# Database
POSTGRES_PASSWORD=your_secure_password_here

# Application
NODE_ENV=production
PORT=3000

# Optional: Custom domain
CUSTOM_DOMAIN=utm.yourdomain.com
```

### Custom Domain

To use a custom domain:

1. Point your domain's DNS to your server's IP
2. Update `CUSTOM_DOMAIN` in `.env`
3. Configure SSL with Let's Encrypt (see below)

### SSL/HTTPS Setup

We recommend using Caddy as a reverse proxy:

```bash
# Install Caddy
curl https://getcaddy.com | bash -s personal

# Create Caddyfile
cat > Caddyfile <<EOF
utm.yourdomain.com {
    reverse_proxy localhost:3000
}
EOF

# Start Caddy
caddy start
```

## Data Backup

### Automated Daily Backups

```bash
# Add to crontab
0 2 * * * docker exec utm_one_postgres pg_dump -U utm_one_user utm_one > /backups/utm_one_$(date +\%Y\%m\%d).sql
```

### Manual Backup

```bash
# Database
docker exec utm_one_postgres pg_dump -U utm_one_user utm_one > backup.sql

# Redis cache
docker exec utm_one_redis redis-cli SAVE
docker cp utm_one_redis:/data/dump.rdb ./redis_backup.rdb
```

### Restore from Backup

```bash
# Database
cat backup.sql | docker exec -i utm_one_postgres psql -U utm_one_user utm_one

# Redis
docker cp redis_backup.rdb utm_one_redis:/data/dump.rdb
docker restart utm_one_redis
```

## Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Update utm.one

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Database Migrations

```bash
docker exec utm_one_app npm run migrate
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response: `{"status":"ok","database":"connected","redis":"connected"}`

### Prometheus Metrics

Metrics available at: http://localhost:3000/metrics

Example metrics:
- `utm_one_redirects_total` - Total redirect count
- `utm_one_redirect_latency_seconds` - Redirect latency
- `utm_one_database_connections` - Active DB connections

## Performance Tuning

### PostgreSQL

Edit `docker-compose.yml`:

```yaml
postgres:
  command: postgres -c max_connections=200 -c shared_buffers=256MB
```

### Redis

```yaml
redis:
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

## Scaling

### Horizontal Scaling

Run multiple app containers behind a load balancer:

```yaml
app:
  deploy:
    replicas: 3
```

### Vertical Scaling

Increase resources in `docker-compose.yml`:

```yaml
app:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 4G
```

## Security

### Firewall Rules

```bash
# Allow only HTTPS
ufw allow 443/tcp
ufw allow 80/tcp  # For Let's Encrypt
ufw enable
```

### Database Security

```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  # Don't expose port to public
  # ports:
  #   - "5432:5432"
```

## Troubleshooting

### Container won't start

```bash
docker-compose logs app
```

### Database connection failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Test connection
docker exec utm_one_postgres psql -U utm_one_user -d utm_one -c "SELECT 1"
```

### High memory usage

```bash
# Check resource usage
docker stats
```

## Support

- GitHub Issues: https://github.com/utm-one/self-hosted/issues
- Documentation: https://utm.one/docs/self-hosting
- Email: support@utm.one

## License

utm.one self-hosted is released under the MIT License. See LICENSE file for details.
