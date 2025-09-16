export interface RateLimitConfig {
  maxIdentifyRequests: number;
  identifyResetInterval: number;
  maxPresenceUpdates: number;
  presenceResetInterval: number;
  maxGuildMemberRequests: number;
  guildMemberResetInterval: number;
}

export class GatewayRateLimiter {
  private identifyRequests = 0;
  private presenceUpdates = 0;
  private guildMemberRequests = 0;
  private identifyResetTimer?: NodeJS.Timeout;
  private presenceResetTimer?: NodeJS.Timeout;
  private guildMemberResetTimer?: NodeJS.Timeout;

  private readonly config: RateLimitConfig = {
    maxIdentifyRequests: 1,
    identifyResetInterval: 5000,
    maxPresenceUpdates: 5,
    presenceResetInterval: 60000,
    maxGuildMemberRequests: 120,
    guildMemberResetInterval: 60000,
  };

  constructor(config?: Partial<RateLimitConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  canIdentify(): boolean {
    return this.identifyRequests < this.config.maxIdentifyRequests;
  }

  recordIdentify(): boolean {
    if (!this.canIdentify()) {
      return false;
    }

    this.identifyRequests++;

    if (!this.identifyResetTimer) {
      this.identifyResetTimer = setTimeout(() => {
        this.identifyRequests = 0;
        this.identifyResetTimer = undefined;
      }, this.config.identifyResetInterval);
    }

    return true;
  }

  canUpdatePresence(): boolean {
    return this.presenceUpdates < this.config.maxPresenceUpdates;
  }

  recordPresenceUpdate(): boolean {
    if (!this.canUpdatePresence()) {
      return false;
    }

    this.presenceUpdates++;

    if (!this.presenceResetTimer) {
      this.presenceResetTimer = setTimeout(() => {
        this.presenceUpdates = 0;
        this.presenceResetTimer = undefined;
      }, this.config.presenceResetInterval);
    }

    return true;
  }

  canRequestGuildMembers(): boolean {
    return this.guildMemberRequests < this.config.maxGuildMemberRequests;
  }

  recordGuildMemberRequest(): boolean {
    if (!this.canRequestGuildMembers()) {
      return false;
    }

    this.guildMemberRequests++;

    if (!this.guildMemberResetTimer) {
      this.guildMemberResetTimer = setTimeout(() => {
        this.guildMemberRequests = 0;
        this.guildMemberResetTimer = undefined;
      }, this.config.guildMemberResetInterval);
    }

    return true;
  }

  getStatus() {
    return {
      identify: {
        current: this.identifyRequests,
        max: this.config.maxIdentifyRequests,
        canProceed: this.canIdentify(),
      },
      presence: {
        current: this.presenceUpdates,
        max: this.config.maxPresenceUpdates,
        canProceed: this.canUpdatePresence(),
      },
      guildMembers: {
        current: this.guildMemberRequests,
        max: this.config.maxGuildMemberRequests,
        canProceed: this.canRequestGuildMembers(),
      },
    };
  }

  reset() {
    this.identifyRequests = 0;
    this.presenceUpdates = 0;
    this.guildMemberRequests = 0;

    if (this.identifyResetTimer) {
      clearTimeout(this.identifyResetTimer);
      this.identifyResetTimer = undefined;
    }

    if (this.presenceResetTimer) {
      clearTimeout(this.presenceResetTimer);
      this.presenceResetTimer = undefined;
    }

    if (this.guildMemberResetTimer) {
      clearTimeout(this.guildMemberResetTimer);
      this.guildMemberResetTimer = undefined;
    }
  }

  destroy() {
    this.reset();
  }
}

export class GatewayMessageQueue {
  private queue: Array<{ payload: unknown; priority: number; timestamp: number }> = [];
  private processing = false;
  private readonly maxQueueSize = 1000;
  private readonly processInterval = 100;

  enqueue(payload: unknown, priority = 0): boolean {
    if (this.queue.length >= this.maxQueueSize) {
      return false;
    }

    this.queue.push({
      payload,
      priority,
      timestamp: Date.now(),
    });

    this.queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);

    if (!this.processing) {
      this.processQueue();
    }

    return true;
  }

  private async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      try {
        await this.sendMessage(item.payload);
      } catch (error) {
        console.error('Failed to send queued message:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, this.processInterval));
    }

    this.processing = false;
  }

  private async sendMessage(_payload: unknown): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
  }

  isProcessing(): boolean {
    return this.processing;
  }
}
