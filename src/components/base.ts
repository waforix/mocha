import { EventEmitter } from 'node:events';

/**
 * Base interface for all components
 * @category Components
 */
export interface IComponent {
  /**
   * Initialize the component
   */
  initialize(): Promise<void>;

  /**
   * Destroy the component and clean up resources
   */
  destroy(): Promise<void>;

  /**
   * Check if component is initialized
   */
  isInitialized(): boolean;
}

/**
 * Base class for all components
 * @category Components
 */
export abstract class BaseComponent extends EventEmitter implements IComponent {
  protected initialized = false;

  /**
   * Initialize the component
   */
  async initialize(): Promise<void> {
    this.initialized = true;
    this.emit('initialized');
  }

  /**
   * Destroy the component and clean up resources
   */
  async destroy(): Promise<void> {
    this.initialized = false;
    this.removeAllListeners();
    this.emit('destroyed');
  }

  /**
   * Check if component is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Wait for initialization
   * @param timeout - Timeout in milliseconds
   * @throws Error if initialization times out
   */
  protected async waitForInitialization(timeout = 30000): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${this.constructor.name} initialization timeout`));
      }, timeout);

      this.once('initialized', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
}

