# Self-Hosting utm.one

This guide explains how to self-host utm.one on your own infrastructure using Docker.

## Overview

utm.one consists of four main services:

- **Dashboard** (port 3000) - React web application
- **Redirect Service** (port 8080) - High-performance link redirector
- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Cache layer

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 10GB+ disk space

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/utm-one.git
cd utm-one
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
POSTGRES_PASSWORD=your_secure_password_here
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Access the application**
- Dashboard: http://localhost:3000
- Redirect Service: http://localhost:8080

### Initial Setup

1. Visit http://localhost:3000
2. Create your first admin account
3. Create a workspace
4. Start creating short links!

## Architecture

```
┌──────────────────────────────────────────┐
│         Load Balancer / CDN              │
│      (CloudFlare, Nginx, Traefik)        │
└──────────────┬───────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ↓                ↓
┌─────────────┐  ┌─────────────┐
│  Dashboard  │  │  Redirect   │
│  (Port 3000)│  │  (Port 8080)│
└──────┬──────┘  └──────┬──────┘
       │                │
       └────────┬───────┘
                │
       ┌────────┴───────┐
       │                │
       ↓                ↓
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   Redis     │
│ (Port 5432) │  │ (Port 6379) │
└─────────────┘  └─────────────┘
```

## DNS Configuration

### Option 1: Subdomain (Recommended for most users)

Point your subdomain to your server:

```dns
go.yourdomain.com    CNAME    your-server.com
```

### Option 2: Root Domain

For root domain (yourdomain.com), use an A record:

```dns
yourdomain.com    A    123.45.67.89
```

### Option 3: Multiple Domains

You can serve multiple custom domains by configuring a reverse proxy (see below).

## SSL/HTTPS Setup

### Using CloudFlare (Easiest)

1. Add your domain to CloudFlare
2. Point DNS to your server
3. Enable "Full (Strict)" SSL mode
4. CloudFlare handles SSL certificates automatically

### Using Let's Encrypt (Self-Managed)

Add Caddy as a reverse proxy:

```yaml
# docker-compose.override.yml
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:
```

```Caddyfile
# Caddyfile
yourdomain.com {
    reverse_proxy redirect-service:8080
}

dashboard.yourdomain.com {
    reverse_proxy app:3000
}
```

## Data Backup

### Automated Backups (Recommended)

Add this to your `docker-compose.override.yml`:

```yaml
services:
  backup:
    image: prodrigestivill/postgres-backup-local
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_DB: utm_one
      POSTGRES_USER: utm_one_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      SCHEDULE: "@daily"
      BACKUP_KEEP_DAYS: 7
      BACKUP_KEEP_WEEKS: 4
      BACKUP_KEEP_MONTHS: 6
    volumes:
      - ./backups:/backups
    depends_on:
      - postgres
```

### Manual Backup

```bash
# Database backup
docker-compose exec postgres pg_dump -U utm_one_user utm_one > backup.sql

# Redis backup
docker-compose exec redis redis-cli SAVE
docker cp utm-one_redis_1:/data/dump.rdb ./redis-backup.rdb
```

### Restore from Backup

```bash
# Database restore
docker-compose exec -T postgres psql -U utm_one_user utm_one < backup.sql

# Redis restore
docker cp ./redis-backup.rdb utm-one_redis_1:/data/dump.rdb
docker-compose restart redis
```

## Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f redirect-service
docker-compose logs -f app
```

### Update utm.one

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### Database Migrations

Migrations run automatically on startup. To run manually:

```bash
docker-compose exec app npm run migrate
```

## Monitoring

### Health Checks

All services expose health endpoints:

```bash
# Dashboard
curl http://localhost:3000/health

# Redirect service
curl http://localhost:8080/health
```

### Metrics (Optional)

Add Prometheus for monitoring:

```yaml
# docker-compose.override.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

## Performance Tuning

### PostgreSQL Optimization

Edit `docker-compose.override.yml`:

```yaml
services:
  postgres:
    command:
      - postgres
      - -c
      - max_connections=200
      - -c
      - shared_buffers=256MB
      - -c
      - effective_cache_size=1GB
      - -c
      - maintenance_work_mem=64MB
      - -c
      - checkpoint_completion_target=0.9
      - -c
      - wal_buffers=16MB
      - -c
      - default_statistics_target=100
```

### Redis Optimization

```yaml
services:
  redis:
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Redirect Service Scaling

Run multiple redirect service instances:

```yaml
services:
  redirect-service:
    deploy:
      replicas: 3
```

Add Nginx load balancer in front.

## Scaling

### Horizontal Scaling

For high traffic, deploy multiple app containers:

```yaml
services:
  app:
    deploy:
      replicas: 3
  
  redirect-service:
    deploy:
      replicas: 5
```

Add a load balancer (Nginx, HAProxy, or CloudFlare).

### Vertical Scaling

Increase resources in `docker-compose.yml`:

```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
  
  redis:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G
```

## Security

### Firewall Rules

Only expose necessary ports:

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct database access
sudo ufw deny 5432/tcp
sudo ufw deny 6379/tcp
```

### Database Security

1. **Never expose PostgreSQL port publicly**
2. Use strong passwords (20+ characters)
3. Enable SSL connections:

```yaml
services:
  postgres:
    command: postgres -c ssl=on -c ssl_cert_file=/var/lib/postgresql/server.crt -c ssl_key_file=/var/lib/postgresql/server.key
```

### Rate Limiting

Configure nginx rate limiting:

```nginx
limit_req_zone $binary_remote_addr zone=redirect:10m rate=100r/s;

server {
    location / {
        limit_req zone=redirect burst=200 nodelay;
        proxy_pass http://redirect-service:8080;
    }
}
```

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose logs

# Check resource usage
docker stats
```

### Database connection failed

```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U utm_one_user -d utm_one -c "SELECT 1"
```

### High memory usage

```bash
# Check container resource usage
docker stats

# Restart services
docker-compose restart
```

### Slow redirects

1. Check Redis connection:
```bash
docker-compose exec redis redis-cli ping
```

2. Monitor redirect service logs:
```bash
docker-compose logs -f redirect-service
```

3. Check database query performance:
```bash
docker-compose exec postgres psql -U utm_one_user -d utm_one -c "
  SELECT query, calls, mean_exec_time 
  FROM pg_stat_statements 
  ORDER BY mean_exec_time DESC 
  LIMIT 10;
"
```

## Support

- Documentation: https://docs.utm.one
- GitHub Issues: https://github.com/yourusername/utm-one/issues
- Email: support@utm.one

## License

MIT License - see LICENSE file for details
