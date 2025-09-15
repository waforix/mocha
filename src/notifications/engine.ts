import type { NotificationAction, NotificationEvent, NotificationRule } from './types';

export class NotificationEngine {
  private rules = new Map<string, NotificationRule>();
  private cooldowns = new Map<string, number>();

  addRule(rule: NotificationRule): void {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
    this.cooldowns.delete(ruleId);
  }

  async checkRules(guildId: string, metrics: Record<string, number>): Promise<NotificationEvent[]> {
    const events: NotificationEvent[] = [];
    const now = Date.now();

    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.guildId !== guildId) continue;

      const lastTriggered = this.cooldowns.get(rule.id) || 0;
      if (now - lastTriggered < rule.cooldown) continue;

      const metricValue = metrics[rule.metric];
      if (metricValue === undefined) continue;

      if (this.evaluateCondition(rule, metricValue)) {
        const event: NotificationEvent = {
          ruleId: rule.id,
          guildId,
          metric: rule.metric,
          value: metricValue,
          threshold: rule.condition.value,
          message: this.generateMessage(rule, metricValue),
          timestamp: new Date(),
        };

        events.push(event);
        this.cooldowns.set(rule.id, now);
        await this.executeActions(rule.actions, event);
      }
    }

    return events;
  }

  private evaluateCondition(rule: NotificationRule, value: number): boolean {
    const { operator, value: threshold } = rule.condition;

    switch (operator) {
      case 'gt':
        return value > threshold;
      case 'lt':
        return value < threshold;
      case 'eq':
        return Math.abs(value - threshold) < 0.01;
      case 'change':
        return Math.abs(value - threshold) > threshold * 0.1;
      default:
        return false;
    }
  }

  private generateMessage(rule: NotificationRule, value: number): string {
    const { metric, condition } = rule;
    const change = (((value - condition.value) / condition.value) * 100).toFixed(1);

    return `${metric} alert: ${value} (${change}% change from ${condition.value})`;
  }

  private async executeActions(
    actions: NotificationAction[],
    event: NotificationEvent
  ): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'webhook':
            await this.executeWebhook(action, event);
            break;
          case 'log':
            console.log(`Notification: ${event.message}`);
            break;
          case 'email':
            await this.executeEmail(action, event);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute ${action.type} action:`, error);
      }
    }
  }

  private async executeWebhook(
    action: NotificationAction,
    event: NotificationEvent
  ): Promise<void> {
    const config = action.config as {
      url: string;
      method?: string;
      headers?: Record<string, string>;
    };

    await fetch(config.url, {
      method: config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(event),
    });
  }

  private async executeEmail(_action: NotificationAction, event: NotificationEvent): Promise<void> {
    console.log(`Email notification would be sent: ${event.message}`);
  }
}
