import { EventEmitter } from 'node:events';
import type { CacheConfig } from '../cache/index';
import { CacheManager, createHeatmapKey } from '../cache/index';
import { getDb } from '../db/index';
import { EventDispatcher } from '../events/index';
import type { GatewayOptions } from '../gateway/index';
import { GatewayClient } from '../gateway/index';
import { StatsAggregator } from '../stats/index';

export interface StatsClientOptions extends GatewayOptions {
  dbPath?: string;
  cache?: CacheConfig;
}

export class StatsClient extends EventEmitter {
  private gateway: GatewayClient;
  private dispatcher: EventDispatcher;
  private aggregator: StatsAggregator;
  private cache: CacheManager;
  private db: ReturnType<typeof getDb>;

  constructor(options: StatsClientOptions) {
    super();

    this.db = getDb(options.dbPath);
    this.gateway = new GatewayClient(options);
    this.dispatcher = new EventDispatcher();
    this.aggregator = new StatsAggregator(this.db);
    this.cache = new CacheManager(options.cache);

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.gateway.on('dispatch', (event, data) => {
      this.dispatcher.dispatch(event, data);
    });

    this.dispatcher.on('processed', (event, data) => {
      this.emit('eventProcessed', event, data);

      if (data.guild_id) {
        this.cache.invalidateGuild(data.guild_id);
      }
    });

    this.dispatcher.on('error', (error, event, data) => {
      this.emit('processingError', error, event, data);
    });

    this.gateway.on('error', (error) => {
      this.emit('gatewayError', error);
    });
  }

  async connect() {
    this.gateway.connect();
  }

  disconnect() {
    this.gateway.disconnect();
  }

  async getUserStats(guildId: string, userId: string, days = 30) {
    const cached = this.cache.getUserStats(guildId, userId, days);
    if (cached) return cached;

    const stats = await this.aggregator.getUserStats(guildId, userId, days);
    this.cache.setUserStats(guildId, userId, days, stats);

    return stats;
  }

  async getGuildStats(guildId: string, days = 30) {
    const cached = this.cache.getGuildStats(guildId, days);
    if (cached) return cached;

    const stats = await this.aggregator.getGuildStats(guildId, days);
    this.cache.setGuildStats(guildId, days, stats);

    return stats;
  }

  async getLeaderboard(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    const cached = this.cache.getLeaderboard(guildId, type, limit, days);
    if (cached) return cached;

    const leaderboard = await this.aggregator.getLeaderboard(guildId, type, limit, days);
    this.cache.setLeaderboard(guildId, type, limit, days, leaderboard);

    return leaderboard;
  }

  async getActivityHeatmap(guildId: string, userId?: string, days = 7) {
    const key = createHeatmapKey(guildId, userId, days);
    const cached = this.cache.getQuery(key);
    if (cached) return cached;

    const heatmap = await this.aggregator.getActivityHeatmap(guildId, userId, days);
    this.cache.setQuery(key, heatmap);

    return heatmap;
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  clearCache() {
    this.cache.clear();
  }

  getDatabase() {
    return this.db;
  }
}
