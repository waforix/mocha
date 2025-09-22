import type { AutocompleteHandler, AutocompleteRegistration } from './types';

export class AutocompleteRegistry {
  private handlers = new Map<string, AutocompleteHandler>();

  register(commandName: string, optionName: string, handler: AutocompleteHandler): void {
    const key = `${commandName}:${optionName}`;
    this.handlers.set(key, handler);
  }

  get(commandName: string, optionName: string): AutocompleteHandler | undefined {
    const key = `${commandName}:${optionName}`;
    return this.handlers.get(key);
  }

  unregister(commandName: string, optionName: string): boolean {
    const key = `${commandName}:${optionName}`;
    return this.handlers.delete(key);
  }

  clear(): void {
    this.handlers.clear();
  }

  getRegistrations(): AutocompleteRegistration[] {
    const registrations: AutocompleteRegistration[] = [];
    for (const [key, handler] of this.handlers) {
      const [commandName, optionName] = key.split(':');
      registrations.push({ commandName, optionName, handler });
    }
    return registrations;
  }
}
