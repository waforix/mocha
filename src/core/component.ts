/**
 * Core component exports
 * Re-exports the BaseComponent from the existing components module
 * which provides lifecycle management and event handling
 *
 * @category Core
 */

export { BaseComponent, type IComponent } from '../components/base';

/**
 * Lifecycle state of a component
 * @category Core
 */
export enum ComponentState {
  UNINITIALIZED = 'uninitialized',
  INITIALIZED = 'initialized',
  DESTROYED = 'destroyed',
}
