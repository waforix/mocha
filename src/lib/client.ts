import { EventEmitter } from 'node:events';
import { MetricsCollector } from '../analytics/index';
import type { CacheConfig } from '../cache/index';
import { CacheManager, createHeatmapKey } from '../cache/index';
import { type CommonDatabase, createDatabaseAdapter, getDb } from '../db/index';
import type { DatabaseConfig, DatabaseInstance } from '../db/types';
import { EventDispatcher } from '../events/index';
import { DataExporter, type ExportOptions } from '../export/index';
import type { GatewayOptions } from '../gateway/index';
import { GatewayClient } from '../gateway/index';
import { NotificationEngine } from '../notifications/index';
import { RateLimitManager } from '../ratelimit/index';
import { StatsAggregator } from '../stats/index';

export interface StatsClientOptions extends GatewayOptions {
  dbPath?: string;
  database?: DatabaseConfig;
  cache?: CacheConfig;
  enableMetrics?: boolean;
  enableNotifications?: boolean;
  enableRateLimit?: boolean;
}

export class StatsClient extends EventEmitter {
  private gateway: GatewayClient;
  private dispatcher!: EventDispatcher;
  private aggregator!: StatsAggregator;
  private cache: CacheManager;
  private db!: DatabaseInstance;
  private dbAdapter!: CommonDatabase;
  private metrics?: MetricsCollector;
  private notifications?: NotificationEngine;
  private rateLimit?: RateLimitManager;
  private exporter!: DataExporter;
  private initialized = false;

  constructor(options: StatsClientOptions) {
    super();
    this.gateway = new GatewayClient(options);

    this.cache = new CacheManager(options.cache);

    this.initializeDatabase(options)
      .then(() => {
        this.setupComponents(options);
        this.setupEventHandlers();
        this.initialized = true;
        this.emit('ready');
      })
      .catch((error) => {
        this.emit('error', error);
      });
  }

  private async initializeDatabase(options: StatsClientOptions) {
    const config = options.database || {
      type: 'sqlite' as const,
      path: options.dbPath || './data/stats.db',
    };
    this.db = await getDb(config);
    this.dbAdapter = createDatabaseAdapter(this.db);
  }

  private setupComponents(options: StatsClientOptions) {
    this.dispatcher = new EventDispatcher(this.dbAdapter);
    this.aggregator = new StatsAggregator(this.dbAdapter);
    this.exporter = new DataExporter(this.dbAdapter);

    if (options.enableMetrics !== false) {
      this.metrics = new MetricsCollector();
    }

    if (options.enableNotifications) {
      this.notifications = new NotificationEngine();
    }

    if (options.enableRateLimit) {
      this.rateLimit = new RateLimitManager();
    }
  }

  private setupEventHandlers() {
    this.gateway.on('dispatch', (event, data) => {
      this.dispatcher.dispatch(event, data);
    });

    this.dispatcher.on('processed', (event, data) => {
      this.metrics?.incrementEventsProcessed();
      this.emit('eventProcessed', event, data);

      if (data.guild_id) {
        this.cache.invalidateGuild(data.guild_id);
      }
    });

    this.dispatcher.on('error', (error, event, data) => {
      this.metrics?.incrementErrors();
      this.emit('processingError', error, event, data);
    });

    this.gateway.on('error', (error) => {
      this.metrics?.incrementErrors();
      this.emit('gatewayError', error);
    });
  }

  async connect() {
    await this.waitForInitialization();
    this.gateway.connect();
  }

  disconnect() {
    this.gateway.disconnect();
  }

  private async waitForInitialization(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Database initialization timeout'));
      }, 10000);

      this.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async getUserStats(guildId: string, userId: string, days = 30) {
    await this.waitForInitialization();
    const cached = this.cache.getUserStats(guildId, userId, days);
    if (cached) return cached;

    const stats = await this.aggregator.getUserStats(guildId, userId, days);
    this.cache.setUserStats(guildId, userId, days, stats);

    return stats;
  }

  async getGuildStats(guildId: string, days = 30) {
    await this.waitForInitialization();
    const cached = this.cache.getGuildStats(guildId, days);
    if (cached) return cached;

    const stats = await this.aggregator.getGuildStats(guildId, days);
    this.cache.setGuildStats(guildId, days, stats);

    return stats;
  }

  async getLeaderboard(guildId: string, type: 'messages' | 'voice', limit = 10, days = 30) {
    await this.waitForInitialization();
    const cached = this.cache.getLeaderboard(guildId, type, limit, days);
    if (cached) return cached;

    const leaderboard = await this.aggregator.getLeaderboard(guildId, type, limit, days);
    this.cache.setLeaderboard(guildId, type, limit, days, leaderboard);

    return leaderboard;
  }

  async getActivityHeatmap(guildId: string, userId?: string, days = 7) {
    await this.waitForInitialization();
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

  async getDatabase() {
    await this.waitForInitialization();
    return this.db;
  }

  getMetrics() {
    return this.metrics?.getMetrics();
  }

  async exportData(options: ExportOptions) {
    await this.waitForInitialization();
    return await this.exporter.export(options);
  }

  getNotificationEngine() {
    return this.notifications;
  }

  getRateLimitManager() {
    return this.rateLimit;
  }

  isRateLimited(key: string, tokens = 1): boolean {
    return this.rateLimit ? !this.rateLimit.isAllowed(key, tokens) : false;
  }
}
