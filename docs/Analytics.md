# Analytics & Insights

Waforix provides powerful analytics capabilities to understand server activity, user engagement, and growth patterns.

## Overview

The analytics system offers:
- **Real-time Statistics**: Current server activity metrics
- **Historical Analysis**: Trends over time periods
- **User Insights**: Individual and aggregate user behavior
- **Channel Analytics**: Per-channel activity breakdown
- **Growth Metrics**: Member and engagement growth tracking

## Server Statistics

### Basic Server Stats
```typescript
// Get overall server statistics
const stats = await client.getServerStats('guild_id', 30); // Last 30 days

console.log({
  totalMessages: stats.totalMessages,
  totalVoiceTime: stats.totalVoiceTime,
  activeUsers: stats.activeUsers,
  topChannels: stats.topChannels
});
```

### Advanced Server Analytics
```typescript
// Get comprehensive server insights
const insights = await client.getServerInsights('guild_id', {
  days: 30,
  includeHourlyActivity: true,
  includeGrowthTrend: true,
  includeChannelBreakdown: true
});

console.log({
  // Activity patterns
  hourlyActivity: insights.hourlyActivity,
  dailyActivity: insights.dailyActivity,
  
  // Growth metrics
  memberGrowth: insights.memberGrowth,
  engagementTrend: insights.engagementTrend,
  
  // Channel insights
  channelActivity: insights.channelActivity,
  channelGrowth: insights.channelGrowth
});
```

## User Analytics

### Individual User Stats
```typescript
// Get stats for a specific user
const userStats = await client.getUserStats('guild_id', 'user_id', 30);

console.log({
  messages: userStats.messages,
  voiceTime: userStats.voiceTime,
  reactions: userStats.reactions,
  joinDate: userStats.joinDate,
  lastActive: userStats.lastActive,
  rank: userStats.rank // User's rank in server
});
```

### User Activity Patterns
```typescript
// Get detailed user activity patterns
const userActivity = await client.getUserActivity('guild_id', 'user_id', {
  days: 30,
  includeHourlyBreakdown: true,
  includeChannelBreakdown: true
});

console.log({
  // When user is most active
  hourlyActivity: userActivity.hourlyActivity,
  dailyActivity: userActivity.dailyActivity,
  
  // Where user is most active
  channelActivity: userActivity.channelActivity,
  
  // Activity trends
  activityTrend: userActivity.trend
});
```

## Leaderboards

### Message Leaderboard
```typescript
// Get top message senders
const messageLeaderboard = await client.getLeaderboard('guild_id', 'messages', {
  limit: 10,
  days: 30
});

messageLeaderboard.forEach((user, index) => {
  console.log(`${index + 1}. ${user.username}: ${user.count} messages`);
});
```

### Voice Activity Leaderboard
```typescript
// Get top voice users
const voiceLeaderboard = await client.getLeaderboard('guild_id', 'voice', {
  limit: 10,
  days: 30
});

voiceLeaderboard.forEach((user, index) => {
  const hours = Math.round(user.totalTime / 3600000); // Convert to hours
  console.log(`${index + 1}. ${user.username}: ${hours} hours`);
});
```

### Custom Leaderboards
```typescript
// Get reaction leaderboard
const reactionLeaderboard = await client.getLeaderboard('guild_id', 'reactions', {
  limit: 10,
  days: 30,
  action: 'add' // Only count added reactions
});

// Get most active in specific channel
const channelLeaderboard = await client.getLeaderboard('guild_id', 'messages', {
  limit: 10,
  days: 30,
  channelId: 'specific_channel_id'
});
```

## Activity Heatmaps

### Hourly Activity Heatmap
```typescript
// Get activity by hour of day
const hourlyActivity = await client.getHourlyActivity('guild_id', 30);

// Returns array of 24 objects (one for each hour)
hourlyActivity.forEach((hour, index) => {
  console.log(`${index}:00 - ${hour.activity} messages`);
});
```

### Daily Activity Heatmap
```typescript
// Get activity by day of week
const dailyActivity = await client.getDailyActivity('guild_id', 30);

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
dailyActivity.forEach((day, index) => {
  console.log(`${days[index]}: ${day.activity} messages`);
});
```

### Channel Activity Heatmap
```typescript
// Get activity breakdown by channel
const channelActivity = await client.getChannelActivity('guild_id', 30);

channelActivity.forEach(channel => {
  console.log(`#${channel.name}: ${channel.messages} messages, ${channel.uniqueUsers} users`);
});
```

## Growth Analytics

### Member Growth Tracking
```typescript
// Get member growth over time
const memberGrowth = await client.getMemberGrowth('guild_id', 90); // Last 90 days

memberGrowth.forEach(day => {
  console.log(`${day.date}: +${day.joins} joins, -${day.leaves} leaves (net: ${day.net})`);
});
```

### Engagement Growth
```typescript
// Track engagement metrics over time
const engagementGrowth = await client.getEngagementGrowth('guild_id', 30);

engagementGrowth.forEach(day => {
  console.log(`${day.date}: ${day.messages} messages, ${day.activeUsers} active users`);
});
```

### Retention Analysis
```typescript
// Analyze user retention
const retention = await client.getRetentionAnalysis('guild_id', {
  cohortDays: 30,  // Look at users who joined in last 30 days
  retentionDays: 7 // Check if they were active in following 7 days
});

console.log(`Retention rate: ${retention.rate}%`);
console.log(`Retained users: ${retention.retained}/${retention.total}`);
```

## Advanced Analytics

### Sentiment Analysis
```typescript
// Analyze message sentiment (requires content storage)
const sentiment = await client.getSentimentAnalysis('guild_id', 30);

console.log({
  positive: sentiment.positive,
  neutral: sentiment.neutral,
  negative: sentiment.negative,
  averageScore: sentiment.averageScore
});
```

### Peak Activity Detection
```typescript
// Find peak activity periods
const peaks = await client.getPeakActivity('guild_id', 30);

peaks.forEach(peak => {
  console.log(`Peak on ${peak.date} at ${peak.hour}:00 - ${peak.activity} messages`);
});
```

### Correlation Analysis
```typescript
// Analyze correlations between different metrics
const correlations = await client.getCorrelationAnalysis('guild_id', 30);

console.log({
  messageVoiceCorrelation: correlations.messageVoice,
  memberActivityCorrelation: correlations.memberActivity,
  channelCrossActivity: correlations.channelCross
});
```

## Custom Analytics Queries

### Raw Query Interface
```typescript
// Execute custom analytics queries
const customStats = await client.executeAnalyticsQuery(`
  SELECT 
    DATE(timestamp) as date,
    COUNT(*) as messages,
    COUNT(DISTINCT userId) as unique_users
  FROM message_events 
  WHERE guildId = ? AND timestamp >= ?
  GROUP BY DATE(timestamp)
  ORDER BY date DESC
`, ['guild_id', Date.now() - (30 * 24 * 60 * 60 * 1000)]);
```

### Query Builder
```typescript
// Use query builder for complex analytics
const query = client.analytics
  .select(['date', 'count', 'uniqueUsers'])
  .from('messages')
  .where('guildId', 'guild_id')
  .where('timestamp', '>=', thirtyDaysAgo)
  .groupBy('date')
  .orderBy('date', 'desc');

const results = await query.execute();
```

## Real-time Analytics

### Live Activity Monitoring
```typescript
// Set up real-time activity monitoring
client.on('activityUpdate', (data) => {
  console.log(`Current active users: ${data.activeUsers}`);
  console.log(`Messages in last hour: ${data.recentMessages}`);
  console.log(`Voice users: ${data.voiceUsers}`);
});

// Start monitoring
await client.startRealTimeMonitoring('guild_id');
```

### Activity Alerts
```typescript
// Set up activity threshold alerts
client.setActivityAlert('guild_id', {
  type: 'spike',
  threshold: 100, // Alert if messages per hour > 100
  callback: (alert) => {
    console.log(`Activity spike detected: ${alert.value} messages/hour`);
  }
});

client.setActivityAlert('guild_id', {
  type: 'drop',
  threshold: 5, // Alert if messages per hour < 5
  callback: (alert) => {
    console.log(`Low activity detected: ${alert.value} messages/hour`);
  }
});
```

## Data Visualization Helpers

### Chart Data Preparation
```typescript
// Prepare data for Chart.js
const chartData = await client.getChartData('guild_id', {
  type: 'line',
  metric: 'messages',
  days: 30,
  groupBy: 'day'
});

// Returns Chart.js compatible format
console.log({
  labels: chartData.labels,     // ['2023-01-01', '2023-01-02', ...]
  datasets: chartData.datasets  // [{ label: 'Messages', data: [10, 15, 8, ...] }]
});
```

### Heatmap Data
```typescript
// Prepare heatmap data
const heatmapData = await client.getHeatmapData('guild_id', {
  days: 30,
  xAxis: 'hour',    // 0-23
  yAxis: 'dayOfWeek' // 0-6
});

// Returns 2D array for heatmap visualization
console.log(heatmapData); // [[0, 1, 2, ...], [5, 8, 12, ...], ...]
```

## Performance Considerations

### Caching Analytics Results
```typescript
const client = new StatsClient({
  database: { type: 'postgres', /* ... */ },
  analytics: {
    cacheResults: true,
    cacheTTL: 300000, // 5 minutes
    cacheSize: 1000   // Max cached queries
  }
});
```

### Pagination for Large Results
```typescript
// Paginate large analytics results
const results = await client.getServerStats('guild_id', 365, {
  page: 1,
  limit: 100
});

console.log(`Page ${results.page} of ${results.totalPages}`);
console.log(`Showing ${results.data.length} of ${results.total} results`);
```

### Background Processing
```typescript
// Process analytics in background
const client = new StatsClient({
  database: { type: 'postgres', /* ... */ },
  analytics: {
    backgroundProcessing: true,
    processingInterval: 3600000 // Process every hour
  }
});

// Get pre-computed results
const stats = await client.getCachedServerStats('guild_id');
```
