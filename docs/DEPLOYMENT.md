# Deployment Guide

## Prerequisites

- Node.js 18+ or Bun runtime
- Database (SQLite, PostgreSQL, or MySQL)
- Discord Bot Token
- Discord Application ID

## Environment Setup

### Required Environment Variables

```bash
DISCORD_TOKEN=your_bot_token
DISCORD_APPLICATION_ID=your_app_id
DATABASE_TYPE=sqlite|postgres|mysql
```

### Database-Specific Variables

#### SQLite
```bash
DATABASE_PATH=./data/stats.db
```

#### PostgreSQL
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=waforix
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_SSL=false
```

#### MySQL
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=waforix
DATABASE_USER=username
DATABASE_PASSWORD=password
```

## Installation

### Using Bun (Recommended)
```bash
bun install
bun run build
```

### Using npm
```bash
npm install
npm run build
```

## Database Setup

### Generate Schemas
```bash
bun run schemas:generate
```

### Run Migrations
```bash
bun run db:generate
```

### Initialize Database
```bash
bun run db:init
```

## Production Deployment

### Docker Deployment

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
```

### Process Management

#### PM2
```bash
pm2 start ecosystem.config.js
```

#### Systemd
```ini
[Unit]
Description=Waforix Stats Bot
After=network.target

[Service]
Type=simple
User=waforix
WorkingDirectory=/opt/waforix
ExecStart=/usr/local/bin/bun start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## Health Checks

### Database Connection
```bash
curl http://localhost:3000/health/db
```

### Memory Usage
```bash
curl http://localhost:3000/health/memory
```

### Cache Status
```bash
curl http://localhost:3000/health/cache
```

## Monitoring

### Metrics Collection
- Database query performance
- Cache hit rates
- Memory usage
- Event processing latency

### Logging
- Structured JSON logs
- Error tracking
- Performance metrics
- Audit trails

### Alerts
- Database connection failures
- High memory usage
- Cache miss rates
- API error rates

## Scaling

### Horizontal Scaling
- Multiple bot instances
- Load balancing
- Shared database

### Vertical Scaling
- Increase memory allocation
- Optimize database queries
- Tune cache sizes

## Backup & Recovery

### Database Backups
```bash
# SQLite
cp data/stats.db backups/stats-$(date +%Y%m%d).db

# PostgreSQL
pg_dump waforix > backups/waforix-$(date +%Y%m%d).sql

# MySQL
mysqldump waforix > backups/waforix-$(date +%Y%m%d).sql
```

### Automated Backups
```bash
# Cron job for daily backups
0 2 * * * /opt/waforix/scripts/backup.sh
```

## Security

### Bot Permissions
- Read Message History
- View Channels
- Connect to Voice Channels

### Database Security
- Use connection pooling
- Enable SSL/TLS
- Regular security updates
- Access control lists

### API Security
- Rate limiting
- Input validation
- Error handling
- Audit logging
