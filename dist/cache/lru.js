export class LRUCache {
    maxSize;
    ttlMs;
    cache = new Map();
    accessOrder = [];
    constructor(maxSize, ttlMs = 300000 // 5 minutes default
    ) {
        this.maxSize = maxSize;
        this.ttlMs = ttlMs;
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return undefined;
        if (Date.now() - item.timestamp > this.ttlMs) {
            this.delete(key);
            return undefined;
        }
        this.moveToEnd(key);
        return item.value;
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, { value, timestamp: Date.now() });
            this.moveToEnd(key);
            return;
        }
        if (this.cache.size >= this.maxSize) {
            const oldest = this.accessOrder.shift();
            if (oldest)
                this.cache.delete(oldest);
        }
        this.cache.set(key, { value, timestamp: Date.now() });
        this.accessOrder.push(key);
    }
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            const index = this.accessOrder.indexOf(key);
            if (index > -1)
                this.accessOrder.splice(index, 1);
        }
        return deleted;
    }
    clear() {
        this.cache.clear();
        this.accessOrder = [];
    }
    moveToEnd(key) {
        const index = this.accessOrder.indexOf(key);
        if (index > -1) {
            this.accessOrder.splice(index, 1);
            this.accessOrder.push(key);
        }
    }
    get size() {
        return this.cache.size;
    }
    keys() {
        return Array.from(this.cache.keys());
    }
}
