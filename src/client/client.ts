import { EventEmitter } from 'node:events';
import { CacheComponent, GatewayComponent, StatsComponent } from '../components';
import { disconnect, getInstance } from '../database';
import { type ClientConfig, ClientConfigSchema, validate } from '../validation';

/**
 * Main client for the library
 * Orchestrates all components and provides unified API
 * @category Core
 */
export class Client extends EventEmitter {
  private config: ClientConfig;
  private cache: CacheComponent;
  private stats: StatsComponent;
  private gateway?: GatewayComponent;
  private initialized = false;

  /**
   * Create a new client instance
   * @param config - Client configuration
   * @throws InvalidInputError if configuration is invalid
   */
  constructor(config: ClientConfig) {
    super();
    this.config = validate(ClientConfigSchema, config, 'ClientConfig');

    // Initialize cache component
    this.cache = new CacheComponent(
      this.config.cache || {
        userStatsSize: 1000,
        guildStatsSize: 100,
        leaderboardSize: 500,
        querySize: 2000,
        ttlMs: 300000,
        strategy: 'lru',
      }
    );

    // Initialize stats component
    this.stats = new StatsComponent(this.cache);

    // Initialize gateway component if token provided
    if (this.config.gateway) {
      this.gateway = new GatewayComponent(this.config.gateway);
    }
  }

  /**
   * Initialize the client
   * @throws DatabaseConnectionError if database connection fails
   */
  async initialize(): Promise<void> {
    try {
      // Initialize database
      await getInstance();

      // Initialize cache
      await this.cache.initialize();

      // Initialize gateway if configured
      if (this.gateway) {
        await this.gateway.initialize();
      }

      this.initialized = true;
      this.emit('ready');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Destroy the client and clean up resources
   */
  async destroy(): Promise<void> {
    try {
      if (this.gateway) {
        await this.gateway.destroy();
      }
      await this.cache.destroy();
      await disconnect();
      this.initialized = false;
      this.emit('destroyed');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Wait for client initialization
   * @param timeout - Timeout in milliseconds
   * @throws Error if initialization times out
   */
  private async waitForInitialization(timeout = 30000): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Client initialization timeout'));
      }, timeout);

      this.once('ready', () => {
        clearTimeout(timer);
        resolve();
      });

      this.once('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  /**
   * Get user message statistics
   * @param guildId - Guild ID
   * @param userId - User ID
   * @param days - Number of days to look back
   * @returns User message stats
   */
  async getUserStats(guildId: string, userId: string, days = 30) {
    await this.waitForInitialization();
    return this.stats.getUserMessageStats(guildId, userId, days);
  }

  /**
   * Get guild statistics
   * @param guildId - Guild ID
   * @returns Guild stats
   */
  async getGuildStats(guildId: string) {
    await this.waitForInitialization();
    return this.stats.getGuildStats(guildId);
  }

  /**
   * Get top users by message count
   * @param guildId - Guild ID
   * @param limit - Number of top users to return
   * @returns Array of top users with message counts
   */
  async getTopUsers(guildId: string, limit = 10) {
    await this.waitForInitialization();
    return this.stats.getTopUsers(guildId, limit);
  }

  /**
   * Clear all cached statistics
   */
  clearStatsCache(): void {
    this.stats.clearCache();
  }

  /**
   * Get cache component
   */
  getCache(): CacheComponent {
    return this.cache;
  }

  /**
   * Get stats component
   */
  getStats(): StatsComponent {
    return this.stats;
  }

  /**
   * Get gateway component
   */
  getGateway(): GatewayComponent | undefined {
    return this.gateway;
  }

  /**
   * Get client configuration
   */
  getConfig(): ClientConfig {
    return { ...this.config };
  }
}
