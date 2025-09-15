# Data Export

Waforix provides comprehensive data export capabilities for backup, analysis, and compliance purposes.

## Overview

The export system supports:
- **Multiple Formats**: JSON, CSV, SQL dumps
- **Flexible Filtering**: By date, user, channel, event type
- **Incremental Exports**: Export only new/changed data
- **Streaming**: Handle large datasets efficiently
- **Compression**: Reduce export file sizes

## Basic Export

### Export All Data
```typescript
// Export all server data
const exportData = await client.exportData('guild_id', {
  format: 'json',
  includeAll: true
});

console.log(`Exported ${exportData.totalRecords} records`);
console.log(`File size: ${exportData.fileSize} bytes`);
```

### Export Specific Time Range
```typescript
// Export data from specific date range
const exportData = await client.exportData('guild_id', {
  format: 'json',
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  includeMessages: true,
  includeVoice: true,
  includeReactions: true,
  includeMembers: true
});
```

## Export Formats

### JSON Export
```typescript
// JSON format (default)
const jsonExport = await client.exportData('guild_id', {
  format: 'json',
  pretty: true, // Pretty-print JSON
  days: 30
});

// Structure:
{
  "metadata": {
    "guildId": "guild_id",
    "exportDate": "2023-12-01T00:00:00Z",
    "dateRange": { "start": "...", "end": "..." },
    "totalRecords": 1000
  },
  "users": [...],
  "channels": [...],
  "messages": [...],
  "voice": [...],
  "reactions": [...],
  "members": [...]
}
```

### CSV Export
```typescript
// CSV format for spreadsheet analysis
const csvExport = await client.exportData('guild_id', {
  format: 'csv',
  days: 30,
  includeHeaders: true
});

// Creates separate CSV files for each data type:
// - messages.csv
// - voice_events.csv
// - reactions.csv
// - member_events.csv
```

### SQL Dump Export
```typescript
// SQL dump for database migration
const sqlExport = await client.exportData('guild_id', {
  format: 'sql',
  includeSchema: true,
  includeData: true,
  days: 30
});

// Generates SQL INSERT statements compatible with target database
```

## Filtered Exports

### User-Specific Export
```typescript
// Export data for specific user (GDPR compliance)
const userExport = await client.exportUserData('user_id', {
  format: 'json',
  includeAllGuilds: false,
  guildId: 'specific_guild_id'
});
```

### Channel-Specific Export
```typescript
// Export data from specific channels
const channelExport = await client.exportData('guild_id', {
  format: 'json',
  channelIds: ['channel_1', 'channel_2'],
  days: 30
});
```

### Event Type Filtering
```typescript
// Export only specific event types
const messageExport = await client.exportData('guild_id', {
  format: 'json',
  includeMessages: true,
  includeVoice: false,
  includeReactions: false,
  includeMembers: false,
  days: 30
});
```

## Advanced Export Options

### Streaming Export
```typescript
// Stream large exports to avoid memory issues
const stream = await client.createExportStream('guild_id', {
  format: 'json',
  days: 365 // Large dataset
});

stream.on('data', (chunk) => {
  // Process chunk of data
  console.log(`Received ${chunk.records.length} records`);
});

stream.on('end', () => {
  console.log('Export completed');
});

stream.on('error', (error) => {
  console.error('Export failed:', error);
});
```

### Incremental Export
```typescript
// Export only new data since last export
const incrementalExport = await client.exportData('guild_id', {
  format: 'json',
  incremental: true,
  lastExportDate: new Date('2023-11-01') // Last export date
});

console.log(`New records: ${incrementalExport.newRecords}`);
console.log(`Modified records: ${incrementalExport.modifiedRecords}`);
```

### Compressed Export
```typescript
// Export with compression
const compressedExport = await client.exportData('guild_id', {
  format: 'json',
  compress: true,
  compressionLevel: 6, // 1-9, higher = better compression
  days: 90
});

console.log(`Original size: ${compressedExport.originalSize}`);
console.log(`Compressed size: ${compressedExport.compressedSize}`);
console.log(`Compression ratio: ${compressedExport.compressionRatio}%`);
```

## Export to External Services

### Export to Cloud Storage
```typescript
// Export directly to AWS S3
const s3Export = await client.exportToS3('guild_id', {
  bucket: 'my-discord-backups',
  key: `exports/guild_${guildId}_${Date.now()}.json`,
  format: 'json',
  compress: true,
  days: 30
});

// Export to Google Cloud Storage
const gcsExport = await client.exportToGCS('guild_id', {
  bucket: 'discord-exports',
  filename: `guild_${guildId}_backup.json`,
  format: 'json',
  days: 30
});
```

### Export to Database
```typescript
// Export to another database
const dbExport = await client.exportToDatabase('guild_id', {
  target: {
    type: 'postgres',
    host: 'backup-db.example.com',
    database: 'discord_backup',
    username: 'backup_user',
    password: 'backup_password'
  },
  days: 30,
  createTables: true // Create tables if they don't exist
});
```

### Export via Webhook
```typescript
// Send export data via webhook
const webhookExport = await client.exportViaWebhook('guild_id', {
  webhookUrl: 'https://api.example.com/discord-data',
  format: 'json',
  batchSize: 1000, // Send in batches
  days: 7
});
```

## Scheduled Exports

### Automatic Backups
```typescript
// Set up automatic daily backups
const scheduler = client.createExportScheduler('guild_id', {
  schedule: '0 2 * * *', // Daily at 2 AM (cron format)
  format: 'json',
  compress: true,
  destination: {
    type: 's3',
    bucket: 'daily-backups',
    keyPrefix: 'discord-stats/'
  },
  retention: 30 // Keep 30 days of backups
});

await scheduler.start();
```

### Weekly Reports
```typescript
// Generate weekly activity reports
const reportScheduler = client.createExportScheduler('guild_id', {
  schedule: '0 9 * * 1', // Mondays at 9 AM
  format: 'csv',
  days: 7,
  destination: {
    type: 'email',
    to: 'admin@example.com',
    subject: 'Weekly Discord Activity Report'
  }
});
```

## Data Privacy & Compliance

### GDPR Compliance
```typescript
// Export user data for GDPR requests
const gdprExport = await client.exportUserData('user_id', {
  format: 'json',
  includePersonalData: true,
  includeMetadata: true,
  anonymizeOthers: true // Anonymize other users' data
});

// Delete user data after export
await client.deleteUserData('user_id', {
  confirmDeletion: true,
  exportBeforeDelete: true
});
```

### Data Anonymization
```typescript
// Export with anonymized user data
const anonymizedExport = await client.exportData('guild_id', {
  format: 'json',
  anonymizeUsers: true,
  hashUserIds: true,
  removePersonalData: true,
  days: 30
});
```

### Audit Trail
```typescript
// Track all export operations
const exportHistory = await client.getExportHistory('guild_id');

exportHistory.forEach(export => {
  console.log(`${export.date}: ${export.format} export by ${export.userId}`);
  console.log(`Records: ${export.recordCount}, Size: ${export.fileSize}`);
});
```

## Export Validation

### Data Integrity Checks
```typescript
// Validate export data integrity
const validation = await client.validateExport(exportData);

console.log({
  isValid: validation.isValid,
  recordCount: validation.recordCount,
  missingRecords: validation.missingRecords,
  corruptedRecords: validation.corruptedRecords,
  checksum: validation.checksum
});
```

### Schema Validation
```typescript
// Validate export against schema
const schemaValidation = await client.validateExportSchema(exportData, {
  schemaVersion: '1.0',
  strictMode: true
});

if (!schemaValidation.isValid) {
  console.error('Schema validation errors:', schemaValidation.errors);
}
```

## Import Functionality

### Import from Export
```typescript
// Import previously exported data
const importResult = await client.importData('guild_id', {
  source: './export.json',
  format: 'json',
  overwriteExisting: false,
  validateData: true
});

console.log(`Imported ${importResult.recordsImported} records`);
console.log(`Skipped ${importResult.recordsSkipped} duplicates`);
console.log(`Errors: ${importResult.errors.length}`);
```

### Migration Between Databases
```typescript
// Migrate data between database types
const migration = await client.migrateData({
  source: {
    type: 'sqlite',
    path: './old-stats.db'
  },
  target: {
    type: 'postgres',
    host: 'localhost',
    database: 'new_discord_stats',
    username: 'user',
    password: 'password'
  },
  batchSize: 1000,
  validateMigration: true
});
```

## Performance Optimization

### Parallel Processing
```typescript
// Export multiple guilds in parallel
const guildIds = ['guild1', 'guild2', 'guild3'];
const exports = await Promise.all(
  guildIds.map(guildId => 
    client.exportData(guildId, {
      format: 'json',
      days: 30
    })
  )
);
```

### Memory Management
```typescript
// Configure memory usage for large exports
const largeExport = await client.exportData('guild_id', {
  format: 'json',
  days: 365,
  memoryLimit: '512MB',
  useStreaming: true,
  batchSize: 10000
});
```

### Progress Tracking
```typescript
// Track export progress
const exportJob = client.createExportJob('guild_id', {
  format: 'json',
  days: 365
});

exportJob.on('progress', (progress) => {
  console.log(`Export progress: ${progress.percentage}%`);
  console.log(`Processed: ${progress.processed}/${progress.total} records`);
});

exportJob.on('complete', (result) => {
  console.log('Export completed:', result);
});

await exportJob.start();
```
