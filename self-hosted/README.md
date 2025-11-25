# utm.one Self-Hosted Deployment Guide

Enterprise-grade short link platform with branded QR codes, UTM tracking, and analytics. Deploy on your own infrastructure for complete control and data ownership.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- 2GB+ RAM available
- Domain with DNS access

### Installation

```bash
# 1. Clone and navigate to self-hosted directory
cd self-hosted

# 2. Copy environment template
cp .env.example .env

# 3. Configure your settings
nano .env

# 4. Start all services
docker-compose up -d

# 5. Verify services are running
docker-compose ps
```

Your redirect service will be available at `http://localhost:8080`

## 📋 Configuration

### Environment Variables

Edit `.env` with your configuration:

```bash
# Database
POSTGRES_PASSWORD=your_secure_password_here  # REQUIRED

# Domains
PRIMARY_DOMAIN=yourdomain.com
REDIRECT_DOMAIN=go.yourdomain.com
```

### DNS Configuration

For `go.yourdomain.com` to work:

**Option 1: CNAME (Subdomains)**
```
go.yourdomain.com.  CNAME  your-server-ip-or-hostname
```

**Option 2: A Record**
```
go.yourdomain.com.  A  123.45.67.89
```

### SSL/HTTPS Setup

#### Using Caddy (Included - Recommended)

```bash
# 1. Update Caddyfile with your domain
nano Caddyfile

# 2. Start with Caddy proxy
docker-compose --profile with-proxy up -d
```

Caddy automatically provisions Let's Encrypt SSL certificates.

#### Using Cloudflare

1. Point your domain to your server IP
2. Enable Cloudflare proxy (orange cloud)
3. SSL/TLS mode: "Full" or "Full (strict)"

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       v
┌─────────────┐
│    Caddy    │ ← Automatic SSL
│  (Port 443) │
└──────┬──────┘
       │
       v
┌──────────────────┐
│ Redirect Service │ ← Express.js + Redis Cache
│   (Port 8080)    │
└────────┬─────────┘
         │
    ┌────┴─────┐
    v          v
┌────────┐ ┌───────┐
│ Redis  │ │ PG DB │
└────────┘ └───────┘
```

## 🔧 Advanced Configuration

### Custom Domains

1. Add TXT record for verification:
```
_utm-verification.yourdomain.com  TXT  utm_xxxxxxxxxxxxx
```

2. Add routing record:
```
go.yourdomain.com  CNAME  your-redirect-service.com
```

### Performance Tuning

#### PostgreSQL
```bash
# Edit docker-compose.yml
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
```

#### Redis
```bash
services:
  redis:
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Scaling

#### Horizontal Scaling (Multiple Redirect Instances)

```yaml
services:
  redirect-service:
    deploy:
      replicas: 3
    # ... rest of config
```

#### Load Balancer (Nginx)

```nginx
upstream redirect_cluster {
    least_conn;
    server redirect-service-1:8080;
    server redirect-service-2:8080;
    server redirect-service-3:8080;
}

server {
    listen 443 ssl;
    server_name go.yourdomain.com;
    
    location / {
        proxy_pass http://redirect_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 💾 Backup & Restore

### Automated Backup (Recommended)

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup PostgreSQL
docker-compose exec -T postgres pg_dump -U utm_one_user utm_one | gzip > "$BACKUP_DIR/utm_one_$DATE.sql.gz"

# Backup Redis
docker-compose exec -T redis redis-cli --rdb /data/dump.rdb
docker cp $(docker-compose ps -q redis):/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "utm_one_*.sql.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "redis_*.rdb" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Schedule daily backups (cron)
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Manual Backup

```bash
# PostgreSQL
docker-compose exec postgres pg_dump -U utm_one_user utm_one > backup.sql

# Redis
docker-compose exec redis redis-cli SAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb ./redis_backup.rdb
```

### Restore

```bash
# PostgreSQL
docker-compose exec -T postgres psql -U utm_one_user utm_one < backup.sql

# Redis
docker cp redis_backup.rdb $(docker-compose ps -q redis):/data/dump.rdb
docker-compose restart redis
```

## 📊 Monitoring

### Health Checks

```bash
# Check all services
docker-compose ps

# Check redirect service health
curl http://localhost:8080/health

# Expected: {"status":"ok","timestamp":"2024-..."}
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f redirect-service

# Last 100 lines
docker-compose logs --tail=100 redirect-service
```

### Prometheus Metrics (Optional)

```bash
# Enable in .env
PROMETHEUS_ENABLED=true

# Metrics endpoint
curl http://localhost:8080/metrics
```

## 🔒 Security Best Practices

1. **Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Firewall Rules**
   ```bash
   # Allow only necessary ports
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw deny 5432/tcp  # Block external DB access
   ufw deny 6379/tcp  # Block external Redis access
   ```

3. **Rate Limiting**
   - Enabled by default in redirect service
   - Configure in `.env`:
   ```
   RATE_LIMIT_MAX_REQUESTS=1000
   RATE_LIMIT_WINDOW_MS=60000
   ```

4. **SSL/TLS**
   - Always use HTTPS in production
   - Use Caddy for automatic SSL

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs redirect-service

# Common issues:
# 1. Database not ready
docker-compose up -d postgres
docker-compose logs postgres  # Wait for "ready to accept connections"

# 2. Port conflicts
netstat -tulpn | grep :8080
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Solution: Set limits in docker-compose.yml
services:
  redirect-service:
    deploy:
      resources:
        limits:
          memory: 512M
```

### Slow Redirects

```bash
# Check Redis connection
docker-compose exec redis redis-cli PING
# Expected: PONG

# Check cache hit rate
docker-compose exec redis redis-cli INFO stats | grep keyspace

# Solution: Increase Redis memory
# Edit docker-compose.yml
redis:
  command: redis-server --maxmemory 1gb
```

### Database Connection Failed

```bash
# Verify database URL
docker-compose exec redirect-service env | grep DATABASE_URL

# Test connection
docker-compose exec postgres psql -U utm_one_user -d utm_one -c "SELECT 1;"
```

## 🔄 Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild services
docker-compose build

# Restart with zero downtime
docker-compose up -d --no-deps redirect-service
```

## 📦 Database Migrations

```bash
# Run migrations
docker-compose exec postgres psql -U utm_one_user -d utm_one -f /docker-entrypoint-initdb.d/01-schema.sql
```

## 🌐 Production Deployment

### AWS EC2

```bash
# 1. Launch t3.small or larger
# 2. Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Deploy
git clone <your-repo>
cd self-hosted
docker-compose --profile with-proxy up -d
```

### DigitalOcean

```bash
# Use Docker Droplet (pre-installed)
# Follow Quick Start steps
```

### Kubernetes

See `kubernetes/` directory for manifests.

## 📞 Support

- Documentation: https://utm.one/docs/self-hosted
- Issues: https://github.com/yourusername/utm-one/issues
- Email: support@utm.one

## 📄 License

MIT License - See LICENSE file for details
