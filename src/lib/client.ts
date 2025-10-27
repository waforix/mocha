import { EventEmitter } from 'node:events';
import { AutocompleteManager } from '../autocomplete/index';
import type { CacheConfig } from '../cache/index';
import { CacheManager } from '../cache/index';
import { GatewayClient, type GatewayOptions } from '../gateway';
import { CommandHandlerManager } from './commands/handler';
import { TIMEOUTS } from './constants';

export interface ClientOptions extends GatewayOptions {
  cache?: CacheConfig;
}

/**
 * Main Discord client for the library
 * Orchestrates gateway connection, caching, and command handling
 */
export class Client extends EventEmitter {
  private gateway: GatewayClient;
  private cache: CacheManager;
  private autocomplete: AutocompleteManager;
  private commandHandlers: CommandHandlerManager;
  private initialized = false;

  constructor(options: ClientOptions) {
    super();
    this.validateOptions(options);
    this.gateway = new GatewayClient(options);
    this.cache = new CacheManager(options.cache);
    this.autocomplete = new AutocompleteManager();
    this.commandHandlers = new CommandHandlerManager();
    this.initializeAsync(options).catch((error) => {
      this.emit('error', error);
    });
  }

  private validateOptions(options: ClientOptions) {
    if (!options.token) {
      throw new Error('Discord token is required');
    }

    if (typeof options.token !== 'string') {
      throw new Error('Discord token must be a string');
    }
    const tokenRegex = /^[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}$/;

    if (!tokenRegex.test(options.token)) {
      throw new Error(
        'Invalid Discord token format. Expected format: MTxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx'
      );
    }
  }

  private async initializeAsync(_options: ClientOptions): Promise<void> {
    try {
      this.setupEventHandlers();
      this.initialized = true;
      this.emit('ready');
    } catch (error) {
      this.emit('error', error);
    }
  }

  private setupEventHandlers() {
    this.gateway.on('dispatch', (event, data) => {
      this.emit('dispatch', event, data);
    });

    this.gateway.on('error', (error) => {
      this.emit('gatewayError', error);
    });
  }

  /**
   * Connect the client to Discord gateway
   */
  async connect() {
    await this.waitForInitialization();
    this.gateway.connect();
  }

  /**
   * Disconnect the client from Discord gateway
   */
  disconnect() {
    this.gateway.disconnect();
  }

  /**
   * Close the client and clean up resources
   */
  async close(): Promise<void> {
    this.disconnect();
    this.initialized = false;
  }

  private async waitForInitialization(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Client initialization timeout'));
      }, TIMEOUTS.DATABASE_INIT);

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

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get the autocomplete manager
   */
  getAutocompleteManager(): AutocompleteManager {
    return this.autocomplete;
  }

  /**
   * Get the command handler manager
   */
  getCommandHandlerManager(): CommandHandlerManager {
    return this.commandHandlers;
  }
}
