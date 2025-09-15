# Production Deployment

This guide covers best practices for deploying Waforix in production environments.

## 🏭 Environment Configuration

### Environment Variables

Create a `.env` file for your production configuration:

```bash
# Database Configuration
DB_TYPE=postgres
DB_HOST=your-postgres-host.com
DB_PORT=5432
DB_NAME=discord_stats
DB_USER=stats_user
DB_PASSWORD=your_secure_password

# Connection Pool Settings
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000

# Cache Configuration
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Application Settings
NODE_ENV=production
LOG_LEVEL=info
PORT=3000

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_key
```

### Production Configuration

```typescript
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '5'),
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000')
    },
    ssl: process.env.NODE_ENV === 'production'
  },
  cache: {
    type: 'redis',
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    ttl: 600000 // 10 minutes
  },
  processing: {
    batchSize: 1000,
    batchTimeout: 5000,
    maxBatches: 10
  },
  monitoring: {
    enabled: true,
    metricsInterval: 60000
  },
  limits: {
    maxMemoryUsage: '1GB',
    maxCacheSize: 500000,
    maxQueueSize: 100000
  }
});
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY bun.lockb ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S waforix -u 1001

WORKDIR /app

COPY --from=builder --chown=waforix:nodejs /app/dist ./dist
COPY --from=builder --chown=waforix:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=waforix:nodejs /app/package.json ./package.json

USER waforix

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js

CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  waforix:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - waforix-network
    volumes:
      - ./logs:/app/logs
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - waforix-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - waforix-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - waforix
    networks:
      - waforix-network

volumes:
  postgres_data:
  redis_data:

networks:
  waforix-network:
    driver: bridge
```

## ☸️ Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: waforix
  labels:
    app: waforix
spec:
  replicas: 3
  selector:
    matchLabels:
      app: waforix
  template:
    metadata:
      labels:
        app: waforix
    spec:
      containers:
      - name: waforix
        image: waforix/mocha:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: waforix-secrets
              key: db-host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: waforix-secrets
              key: db-password
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: waforix-service
spec:
  selector:
    app: waforix
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔒 Security Configuration

### SSL/TLS Setup

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    location / {
        proxy_pass http://waforix:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Database Security

```typescript
// Production database configuration with SSL
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync('./certs/ca-cert.pem'),
      cert: fs.readFileSync('./certs/client-cert.pem'),
      key: fs.readFileSync('./certs/client-key.pem')
    }
  }
});
```

## 📊 Monitoring & Logging

### Health Checks

```typescript
// healthcheck.js
import { StatsClient } from 'waforix';

const client = new StatsClient({
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    // ... other config
  }
});

async function healthCheck() {
  try {
    await client.initialize();
    const health = await client.healthCheck();
    
    if (health.database === 'healthy' && health.cache === 'healthy') {
      console.log('✅ Health check passed');
      process.exit(0);
    } else {
      console.error('❌ Health check failed:', health);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    process.exit(1);
  }
}

healthCheck();
```

### Logging Configuration

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Integrate with Waforix
const client = new StatsClient({
  database: { /* ... */ },
  logger: logger
});
```

### Metrics Collection

```typescript
import { StatsClient } from 'waforix';
import { createPrometheusMetrics } from '@prometheus-io/client';

const client = new StatsClient({
  database: { /* ... */ },
  monitoring: {
    enabled: true,
    metricsInterval: 60000,
    prometheus: {
      enabled: true,
      port: 9090
    }
  }
});

// Custom metrics
client.on('messageTracked', () => {
  messageCounter.inc();
});

client.on('slowQuery', (query) => {
  slowQueryCounter.inc();
  queryDuration.observe(query.duration);
});
```

## 🚀 Scaling Strategies

### Horizontal Scaling

```typescript
// Load balancer configuration
const clients = [
  new StatsClient({ 
    database: { /* ... */ },
    instanceId: 'worker-1'
  }),
  new StatsClient({ 
    database: { /* ... */ },
    instanceId: 'worker-2'
  }),
  new StatsClient({ 
    database: { /* ... */ },
    instanceId: 'worker-3'
  })
];

// Round-robin load balancing
let currentClient = 0;
function getClient() {
  const client = clients[currentClient];
  currentClient = (currentClient + 1) % clients.length;
  return client;
}
```

### Database Scaling

```typescript
// Read replicas configuration
const client = new StatsClient({
  database: {
    type: 'postgres',
    master: {
      host: 'master-db.example.com',
      database: 'discord_stats',
      username: 'write_user',
      password: 'password'
    },
    replicas: [
      {
        host: 'replica1-db.example.com',
        database: 'discord_stats',
        username: 'read_user',
        password: 'password'
      },
      {
        host: 'replica2-db.example.com',
        database: 'discord_stats',
        username: 'read_user',
        password: 'password'
      }
    ]
  }
});
```

## 🔄 Backup & Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="discord_stats"

# PostgreSQL backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://your-backup-bucket/

# Clean up old backups (keep last 30 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
```

### Disaster Recovery

```typescript
// Recovery script
import { StatsClient } from 'waforix';

async function recoverFromBackup(backupFile: string) {
  const client = new StatsClient({
    database: {
      type: 'postgres',
      host: process.env.RECOVERY_DB_HOST,
      // ... other config
    }
  });

  await client.initialize();
  
  // Import backup data
  const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  await client.importData('guild_id', backupData);
  
  console.log('✅ Recovery completed');
}
```

## 📈 Performance Optimization

### Production Optimizations

```typescript
const client = new StatsClient({
  database: {
    type: 'postgres',
    // ... connection details
    pool: {
      min: 10,
      max: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  cache: {
    type: 'redis',
    // ... redis config
    ttl: 1800000, // 30 minutes
    size: 1000000  // 1M items
  },
  processing: {
    batchSize: 5000,
    batchTimeout: 2000,
    maxBatches: 20
  }
});
```

### Resource Monitoring

```typescript
// Monitor resource usage
setInterval(async () => {
  const metrics = await client.getPerformanceMetrics();
  const memUsage = process.memoryUsage();
  
  console.log({
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
    cacheHitRate: metrics.cacheHitRate + '%',
    avgQueryTime: metrics.avgQueryTime + 'ms',
    queueSize: metrics.queueSize
  });
}, 60000);
```

## 🚨 Error Handling

### Production Error Handling

```typescript
import * as Sentry from '@sentry/node';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  Sentry.captureException(error);
  process.exit(1);
});

// Waforix error handling
client.on('error', (error) => {
  console.error('Waforix error:', error);
  Sentry.captureException(error);
});
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates installed
- [ ] Monitoring setup configured
- [ ] Backup strategy implemented
- [ ] Load testing completed

### Deployment
- [ ] Deploy to staging environment
- [ ] Run integration tests
- [ ] Verify health checks
- [ ] Monitor resource usage
- [ ] Test failover procedures

### Post-Deployment
- [ ] Monitor application logs
- [ ] Verify metrics collection
- [ ] Test backup procedures
- [ ] Update documentation
- [ ] Notify team of deployment

## 🆘 Support

For production deployment issues:
- [Troubleshooting Guide](https://github.com/waforix/mocha/wiki/Troubleshooting)
- [Performance Guide](https://github.com/waforix/mocha/wiki/Performance-Optomization)
- [GitHub Issues](https://github.com/waforix/mocha/issues)
- [Discord Community](https://discord.gg/your-invite)
