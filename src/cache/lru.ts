export class LRUCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private accessOrder: string[] = [];

  constructor(
    private maxSize: number,
    private ttlMs: number = 300000 // 5 minutes default
  ) {}

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) return undefined;

    if (Date.now() - item.timestamp > this.ttlMs) {
      this.delete(key);
      return undefined;
    }

    this.moveToEnd(key);
    return item.value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.set(key, { value, timestamp: Date.now() });
      this.moveToEnd(key);
      return;
    }

    if (this.cache.size >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      if (oldest) this.cache.delete(oldest);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
    this.accessOrder.push(key);
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      const index = this.accessOrder.indexOf(key);
      if (index > -1) this.accessOrder.splice(index, 1);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  private moveToEnd(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
    }
  }

  get size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}
