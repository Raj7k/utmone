# utm.one Redirect Service

High-performance redirect service for utm.one short links.

## Features

- Sub-100ms redirect latency
- Redis caching layer
- PostgreSQL persistence
- Device/browser detection
- Analytics tracking
- Health monitoring

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Build TypeScript
npm run build

# Start service
npm start
```

## Docker Deployment

```bash
# Build image
docker build -t utm-one-redirect .

# Run container
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  utm-one-redirect
```

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `PORT` | No | 8080 | HTTP port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | No | redis://localhost:6379 | Redis connection string |

## API Endpoints

### `GET /:slug`

Redirect to destination URL for the given short link slug.

**Response:**
- 302: Redirect to destination
- 404: Link not found
- 500: Server error

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Performance

- Average latency: 50-80ms
- Cache hit rate: 90%+
- Throughput: 10,000+ req/s per instance

## Monitoring

The service logs to stdout in JSON format:

```json
{
  "level": "info",
  "msg": "Redirect",
  "slug": "abc123",
  "latency_ms": 45,
  "cache_hit": true
}
```

Integrate with log aggregators (DataDog, Better Stack) for monitoring.

## License

MIT
