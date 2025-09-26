type Cached<T> = {
  key: string;
  value: T;
  ttl?: number;
};

const DEFAULT_CAPACITY = 100_000;

export class Cache<T> {
  private capacity: number;
  private hits: number;
  private misses: number;
  private list: Cached<T>[];
  private map: Map<string, number>;

  public constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this.hits = 0;
    this.misses = 0;
    this.list = [];
    this.map = {} as Map<string, number>;
  }

  public get(key: string): T | null {
    const index = this.map.get(key);
    if (index) {
      this.hits++;
      this.list.push(this.list.splice(index, 1)[0]);
      this.map.set(this.list[this.list.length - 1].key, this.list.length - 1);
      return this.list[this.list.length - 1].value;
    }
    this.misses++;
    return null;
  }

  public add(key: string, data: T): void {
    if (this.get(key)) {
      return;
    }
    if (this.list.length === this.capacity) {
      this.evict();
    }
    this.list.push({ key: key, value: data });
    this.map.set(key, this.list.length - 1);
  }

  public evict(): void {
    const deleted = this.list.shift();
    if (deleted) {
      this.map.delete(deleted.key);
    }
  }

  public remove(key: string): void {
    if (this.get(key)) {
      this.map.delete(this.list[this.list.length - 1].key);
      this.list.pop();
    }
  }

  public getHits(): number {
    return this.hits;
  }

  public getMisses(): number {
    return this.misses;
  }
}
