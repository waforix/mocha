import { BaseComponent } from './base';
import { GatewayConnectionError } from '../errors/network';
import type { GatewayConfig } from '../validation';

/**
 * Gateway component for Discord connection management
 * @category Components
 */
export class GatewayComponent extends BaseComponent {
  private config: GatewayConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  /**
   * Create a new gateway component
   * @param config - Gateway configuration
   */
  constructor(config: GatewayConfig) {
    super();
    this.config = config;
  }

  /**
   * Initialize the gateway component
   */
  async initialize(): Promise<void> {
    try {
      await this.connect();
      await super.initialize();
    } catch (error) {
      throw new GatewayConnectionError(
        'Failed to initialize gateway',
        { token: this.config.token ? '***' : 'missing' },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Destroy the gateway component
   */
  async destroy(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    await this.disconnect();
    await super.destroy();
  }

  /**
   * Connect to Discord gateway
   */
  private async connect(): Promise<void> {
    try {
      // Validate token
      if (!this.config.token || this.config.token.length === 0) {
        throw new Error('Discord token is required');
      }

      // Simulate connection (in real implementation, would connect to Discord)
      this.emit('connecting');

      // Validate intents
      if (this.config.intents < 0) {
        throw new Error('Invalid intents value');
      }

      this.reconnectAttempts = 0;
      this.emit('connected');
    } catch (error) {
      throw new GatewayConnectionError(
        'Failed to connect to gateway',
        { intents: this.config.intents },
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Disconnect from Discord gateway
   */
  private async disconnect(): Promise<void> {
    this.emit('disconnecting');
    this.emit('disconnected');
  }

  /**
   * Attempt to reconnect
   */
  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.config.maxReconnects) {
      throw new GatewayConnectionError(
        'Max reconnection attempts exceeded',
        { attempts: this.reconnectAttempts, max: this.config.maxReconnects }
      );
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 60000);

    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

    return new Promise((resolve, reject) => {
      this.reconnectTimer = setTimeout(async () => {
        try {
          await this.connect();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * Check if gateway is connected
   */
  isConnected(): boolean {
    return this.initialized;
  }

  /**
   * Get current reconnect attempt count
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Get gateway configuration
   */
  getConfig(): GatewayConfig {
    return { ...this.config };
  }
}

