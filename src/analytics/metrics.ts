export interface Metrics {
  eventsProcessed: number;
  eventsPerSecond: number;
  queriesExecuted: number;
  cacheHits: number;
  cacheMisses: number;
  errors: number;
  uptime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
}

export class MetricsCollector {
  private metrics: Metrics = {
    eventsProcessed: 0,
    eventsPerSecond: 0,
    queriesExecuted: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errors: 0,
    uptime: 0,
    memoryUsage: { heapUsed: 0, heapTotal: 0, external: 0 },
  };

  private startTime = Date.now();
  private lastEventCount = 0;
  private lastEventTime = Date.now();

  incrementEventsProcessed(): void {
    this.metrics.eventsProcessed++;
    this.updateEventsPerSecond();
  }

  incrementQueriesExecuted(): void {
    this.metrics.queriesExecuted++;
  }

  incrementCacheHits(): void {
    this.metrics.cacheHits++;
  }

  incrementCacheMisses(): void {
    this.metrics.cacheMisses++;
  }

  incrementErrors(): void {
    this.metrics.errors++;
  }

  private updateEventsPerSecond(): void {
    const now = Date.now();
    const timeDiff = (now - this.lastEventTime) / 1000;

    if (timeDiff >= 1) {
      const eventDiff = this.metrics.eventsProcessed - this.lastEventCount;
      this.metrics.eventsPerSecond = Math.round(eventDiff / timeDiff);
      this.lastEventCount = this.metrics.eventsProcessed;
      this.lastEventTime = now;
    }
  }

  getMetrics(): Metrics {
    const memUsage = process.memoryUsage();

    return {
      ...this.metrics,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
      },
    };
  }

  reset(): void {
    this.metrics = {
      eventsProcessed: 0,
      eventsPerSecond: 0,
      queriesExecuted: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      uptime: 0,
      memoryUsage: { heapUsed: 0, heapTotal: 0, external: 0 },
    };
    this.startTime = Date.now();
    this.lastEventCount = 0;
    this.lastEventTime = Date.now();
  }
}
