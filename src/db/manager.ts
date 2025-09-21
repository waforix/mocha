import { createDatabaseConnection } from './factory';
import type { DatabaseConfig, DatabaseInstance } from './types';

export class DatabaseManager {
  private instance?: DatabaseInstance;
  private config?: DatabaseConfig;

  async initialize(config: DatabaseConfig): Promise<DatabaseInstance> {
    if (this.instance && this.config && this.configEquals(config)) {
      return this.instance;
    }

    await this.close();
    this.config = config;
    this.instance = await createDatabaseConnection(config);
    return this.instance;
  }

  getInstance(): DatabaseInstance {
    if (!this.instance) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  async close(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = undefined;
      this.config = undefined;
    }
  }

  isInitialized(): boolean {
    return !!this.instance;
  }

  private configEquals(config: DatabaseConfig): boolean {
    if (!this.config) return false;

    if (this.config.type !== config.type) return false;

    if (config.type === 'sqlite' && this.config.type === 'sqlite') {
      return this.config.path === config.path;
    }

    if (config.type === 'postgres' && this.config.type === 'postgres') {
      return this.config.connectionString === config.connectionString;
    }

    return false;
  }
}
