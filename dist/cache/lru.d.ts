export declare class LRUCache<T> {
    private maxSize;
    private ttlMs;
    private cache;
    private accessOrder;
    constructor(maxSize: number, ttlMs?: number);
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    delete(key: string): boolean;
    clear(): void;
    private moveToEnd;
    get size(): number;
    keys(): string[];
}
