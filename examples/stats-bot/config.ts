import { config } from 'dotenv';

config();

export const CONFIG = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    applicationId: process.env.APPLICATION_ID || '',
    guildId: process.env.GUILD_ID || '',
    ownerId: process.env.OWNER_ID || '',
  },
  database: {
    path: process.env.DB_PATH || './data/stats.db',
  },
  cache: {
    userStatsSize: Number(process.env.CACHE_USER_STATS_SIZE) || 2000,
    guildStatsSize: Number(process.env.CACHE_GUILD_STATS_SIZE) || 200,
    ttlMs: Number(process.env.CACHE_TTL_MS) || 600000,
  },
  features: {
    enableMetrics: process.env.ENABLE_METRICS !== 'false',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',
  },
  bot: {
    prefix: process.env.BOT_PREFIX || '!',
  },
  env: {
    isDev: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

export function validateConfig(): void {
  if (!CONFIG.discord.token) {
    throw new Error('DISCORD_TOKEN is required');
  }

  if (!CONFIG.discord.applicationId) {
    throw new Error('APPLICATION_ID is required for slash commands');
  }

  if (!CONFIG.discord.guildId) {
    console.warn('GUILD_ID not set - bot will work on all guilds');
  }
}
