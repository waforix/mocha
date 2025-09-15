# Migration Guide

This guide helps you upgrade Waforix between different versions and migrate between database types.

## 🔄 Version Migrations

### From v1.x to v2.x

The major change in v2.x is the addition of PostgreSQL support and the new database configuration format.

#### Breaking Changes
- **Database Configuration**: New structured format required
- **Initialization**: Async initialization now required
- **Event Tracking**: Enhanced event data structures
- **Analytics**: New analytics methods and improved performance

#### Configuration Migration

**Old Configuration (v1.x)**
```typescript
const client = new StatsClient({
  dbPath: './stats.db',
  cacheSize: 1000,
  batchSize: 500
});
```

**New Configuration (v2.x)**
```typescript
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './stats.db'
  },
  cache: {
    size: 1000
  },
  processing: {
    batchSize: 500
  }
});

// Async initialization now required
await client.initialize();
```

#### Backward Compatibility

For easier migration, v2.x maintains backward compatibility with v1.x configuration:

```typescript
// This still works in v2.x
const client = new StatsClient({
  dbPath: './stats.db',  // Automatically converted to new format
  cacheSize: 1000        // Automatically converted to new format
});
```

#### Step-by-Step Migration

**Step 1: Update Dependencies**
```bash
# Update to v2.x
bun update waforix

# Or with npm
npm update waforix
```

**Step 2: Update Configuration**
```typescript
// Before
const client = new StatsClient({
  dbPath: './stats.db',
  cacheSize: 1000
});

// After
const client = new StatsClient({
  database: {
    type: 'sqlite',
    path: './stats.db'
  },
  cache: {
    size: 1000
  }
});

// Add async initialization
await client.initialize();
```

**Step 3: Update Method Calls**
```typescript
// Before - synchronous initialization
const client = new StatsClient({ dbPath: './stats.db' });

// After - async initialization
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' }
});
await client.initialize();
```

**Step 4: Test Your Application**
```typescript
// Add health check to verify migration
const health = await client.healthCheck();
if (health.database === 'healthy') {
  console.log('✅ Migration successful');
} else {
  console.error('❌ Migration issues detected');
}
```

### From v2.0 to v2.1

Minor version updates with new features and improvements.

#### New Features in v2.1
- Enhanced PostgreSQL connection pooling
- Improved caching mechanisms
- New analytics methods
- Better error handling

#### Migration Steps
```bash
# Update to v2.1
bun update waforix
```

No configuration changes required for v2.1 - fully backward compatible.

## 🗄️ Database Migrations

### SQLite to PostgreSQL

Migrating from SQLite to PostgreSQL for better performance and scalability.

#### Step 1: Set Up PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE discord_stats;
CREATE USER stats_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE discord_stats TO stats_user;
\q
```

#### Step 2: Export SQLite Data
```typescript
// Export from SQLite
const sqliteClient = new StatsClient({
  database: {
    type: 'sqlite',
    path: './old-stats.db'
  }
});

await sqliteClient.initialize();

// Export all data
const exportData = await sqliteClient.exportData('guild_id', {
  format: 'json',
  includeAll: true
});

console.log(`Exported ${exportData.totalRecords} records`);
```

#### Step 3: Import to PostgreSQL
```typescript
// Initialize PostgreSQL client
const pgClient = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'secure_password'
  }
});

await pgClient.initialize();

// Import data
await pgClient.importData('guild_id', exportData);
console.log('Migration completed successfully');
```

#### Step 4: Verify Migration
```typescript
// Compare record counts
const sqliteStats = await sqliteClient.getServerStats('guild_id');
const pgStats = await pgClient.getServerStats('guild_id');

console.log('SQLite messages:', sqliteStats.totalMessages);
console.log('PostgreSQL messages:', pgStats.totalMessages);

if (sqliteStats.totalMessages === pgStats.totalMessages) {
  console.log('✅ Migration verified successfully');
} else {
  console.error('❌ Migration verification failed');
}
```

### PostgreSQL to SQLite

Migrating from PostgreSQL to SQLite (for development or smaller deployments).

#### Step 1: Export PostgreSQL Data
```typescript
const pgClient = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'stats_user',
    password: 'password'
  }
});

const exportData = await pgClient.exportData('guild_id', {
  format: 'json',
  includeAll: true
});
```

#### Step 2: Import to SQLite
```typescript
const sqliteClient = new StatsClient({
  database: {
    type: 'sqlite',
    path: './new-stats.db'
  }
});

await sqliteClient.initialize();
await sqliteClient.importData('guild_id', exportData);
```

## 🔧 Schema Migrations

### Automatic Schema Updates

Waforix automatically handles schema migrations when you update versions:

```typescript
const client = new StatsClient({
  database: { type: 'sqlite', path: './stats.db' }
});

// Schema is automatically updated during initialization
await client.initialize();
```

### Manual Schema Migration

For advanced users who want to control schema updates:

```typescript
// Check current schema version
const schemaVersion = await client.getSchemaVersion();
console.log('Current schema version:', schemaVersion);

// Run specific migration
await client.runMigration('2.0.0');

// Verify migration
const newVersion = await client.getSchemaVersion();
console.log('New schema version:', newVersion);
```

## 📊 Data Validation

### Pre-Migration Validation
```typescript
// Validate data before migration
const validation = await client.validateData('guild_id');

if (!validation.isValid) {
  console.error('Data validation failed:', validation.errors);
  // Fix issues before proceeding
} else {
  console.log('✅ Data validation passed');
  // Proceed with migration
}
```

### Post-Migration Validation
```typescript
// Validate data after migration
const postValidation = await newClient.validateData('guild_id');

if (postValidation.isValid) {
  console.log('✅ Migration completed successfully');
} else {
  console.error('❌ Migration validation failed');
}
```

## 🚨 Troubleshooting Migrations

### Common Issues

#### Configuration Errors
```typescript
// Error: Invalid database configuration
// Solution: Check your database configuration format

// Incorrect
const client = new StatsClient({
  type: 'postgres',  // Wrong location
  host: 'localhost'
});

// Correct
const client = new StatsClient({
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'discord_stats',
    username: 'user',
    password: 'password'
  }
});
```

#### Connection Issues
```typescript
// Test database connection before migration
try {
  await client.initialize();
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  // Check connection parameters
}
```

#### Data Loss Prevention
```typescript
// Always backup before migration
const backup = await oldClient.exportData('guild_id', {
  format: 'json',
  includeAll: true
});

// Save backup to file
await fs.writeFile('./backup.json', JSON.stringify(backup, null, 2));
console.log('✅ Backup created');
```

### Recovery Procedures

#### Rollback Migration
```typescript
// If migration fails, rollback to previous version
const rollback = await client.rollbackMigration('1.9.0');

if (rollback.success) {
  console.log('✅ Rollback successful');
} else {
  console.error('❌ Rollback failed:', rollback.error);
}
```

#### Restore from Backup
```typescript
// Restore data from backup file
const backupData = JSON.parse(await fs.readFile('./backup.json', 'utf8'));
await client.importData('guild_id', backupData);
console.log('✅ Data restored from backup');
```

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup all data
- [ ] Test new configuration in development
- [ ] Verify database connectivity
- [ ] Check schema compatibility
- [ ] Plan rollback strategy

### During Migration
- [ ] Monitor migration progress
- [ ] Check for errors
- [ ] Validate data integrity
- [ ] Test basic functionality

### Post-Migration
- [ ] Verify all data migrated correctly
- [ ] Test all application features
- [ ] Monitor performance
- [ ] Update documentation
- [ ] Clean up old data (if desired)

## 🆘 Getting Help

If you encounter issues during migration:

1. **Check the logs** for detailed error messages
2. **Verify your configuration** against the examples
3. **Test with a small dataset** first
4. **Consult the [Troubleshooting Guide](https://github.com/waforix/mocha/wiki/Troubleshooting)**
5. **Open an issue** on [GitHub](https://github.com/waforix/mocha/issues)
6. **Join our Discord** for real-time support

## 📚 Additional Resources

- [Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)
- [Performance Optimization](https://github.com/waforix/mocha/wiki/Performance-Optomization)
- [Data Export Guide](https://github.com/waforix/mocha/wiki/Data-Export)
- [API Reference](https://github.com/waforix/mocha/wiki/API-Reference)
