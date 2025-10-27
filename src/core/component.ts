import { EventEmitter } from 'node:events';

/**
 * Lifecycle state of a component
 * @category Core
 */
export enum ComponentState {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  STARTING = 'starting',
  STARTED = 'started',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  DESTROYED = 'destroyed',
}

/**
 * Base component class for all library components
 * Provides lifecycle management and event handling
 *
 * @example
 * ```typescript
 * class MyComponent extends BaseComponent {
 *   async initialize() {
 *     // Setup logic
 *   }
 *
 *   async start() {
 *     // Start logic
 *   }
 *
 *   async stop() {
 *     // Stop logic
 *   }
 * }
 * ```
 *
 * @category Core
 */
export abstract class BaseComponent extends EventEmitter {
  protected state: ComponentState = ComponentState.UNINITIALIZED;
  protected name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  /**
   * Get the current state of the component
   */
  getState(): ComponentState {
    return this.state;
  }

  /**
   * Get the name of the component
   */
  getName(): string {
    return this.name;
  }

  /**
   * Check if component is initialized
   */
  isInitialized(): boolean {
    return this.state !== ComponentState.UNINITIALIZED;
  }

  /**
   * Check if component is started
   */
  isStarted(): boolean {
    return this.state === ComponentState.STARTED;
  }

  /**
   * Initialize the component
   * Called once during client initialization
   *
   * @throws {Error} If initialization fails
   */
  async initialize(): Promise<void> {
    if (this.state !== ComponentState.UNINITIALIZED) {
      throw new Error(`Cannot initialize component in state: ${this.state}`);
    }

    this.state = ComponentState.INITIALIZING;
    try {
      await this.onInitialize();
      this.state = ComponentState.INITIALIZED;
      this.emit('initialized');
    } catch (error) {
      this.state = ComponentState.UNINITIALIZED;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Start the component
   * Called after initialization
   *
   * @throws {Error} If start fails
   */
  async start(): Promise<void> {
    if (this.state !== ComponentState.INITIALIZED) {
      throw new Error(`Cannot start component in state: ${this.state}`);
    }

    this.state = ComponentState.STARTING;
    try {
      await this.onStart();
      this.state = ComponentState.STARTED;
      this.emit('started');
    } catch (error) {
      this.state = ComponentState.INITIALIZED;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Stop the component
   * Called during client shutdown
   *
   * @throws {Error} If stop fails
   */
  async stop(): Promise<void> {
    if (this.state !== ComponentState.STARTED) {
      throw new Error(`Cannot stop component in state: ${this.state}`);
    }

    this.state = ComponentState.STOPPING;
    try {
      await this.onStop();
      this.state = ComponentState.STOPPED;
      this.emit('stopped');
    } catch (error) {
      this.state = ComponentState.STARTED;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Destroy the component
   * Called during final cleanup
   *
   * @throws {Error} If destroy fails
   */
  async destroy(): Promise<void> {
    if (this.state === ComponentState.DESTROYED) {
      return;
    }

    try {
      if (this.state === ComponentState.STARTED) {
        await this.stop();
      }
      await this.onDestroy();
      this.state = ComponentState.DESTROYED;
      this.emit('destroyed');
      this.removeAllListeners();
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Override this method to implement initialization logic
   * @protected
   */
  protected async onInitialize(): Promise<void> {
    // Override in subclass
  }

  /**
   * Override this method to implement start logic
   * @protected
   */
  protected async onStart(): Promise<void> {
    // Override in subclass
  }

  /**
   * Override this method to implement stop logic
   * @protected
   */
  protected async onStop(): Promise<void> {
    // Override in subclass
  }

  /**
   * Override this method to implement destroy logic
   * @protected
   */
  protected async onDestroy(): Promise<void> {
    // Override in subclass
  }
}

